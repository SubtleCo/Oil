from django.http import HttpResponseServerError
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.decorators import action
from oilapi.models import Job, JobType, JobInvite, UserPair
from datetime import date
from django.db.models import Q
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    """JSON serializer for user, names only"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class JobSerializer(serializers.ModelSerializer):
    """JSON serializer for Jobs"""
    users = UserSerializer(many=True)
    last_completed_by = UserSerializer(many=False)
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'type', 'frequency', 'created_at',
                  'last_completed', 'last_completed_by', 'users']


class ShortJobSerializer(serializers.ModelSerializer):
    """JSON serializer for Jobs, abbreviated"""
    class Meta:
        model = Job
        fields = ['id', 'title']

class JobInviteSerializer(serializers.ModelSerializer):
    """JSON serializer for JobInvites"""
    job = ShortJobSerializer(many=False)
    inviter = UserSerializer(many=False)
    invitee = UserSerializer(many=False)

    class Meta:
        model = JobInvite
        fields = ['id', 'job', 'inviter', 'invitee', 'accepted']


class JobView(ViewSet):
    def create(self, request):
        user = request.auth.user

        req = request.data
        job = Job()
        job_type = JobType.objects.get(pk=req['type'])
        job.type = job_type
        job.title = req['title']
        job.created_by = user
        job.frequency = req['frequency']
        job.last_completed = req['last_completed']
        job.description = req['description']
        job.last_completed_by = user

        try:
            job.save()
            job.users.add(user)
            serializer = JobSerializer(job, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ex:
            return Response({"reason": ex.message}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        try:
            job = Job.objects.get(pk=pk)
            serializer = JobSerializer(job, context={'request': request})
            return Response(serializer.data)
        except Exception as ex:
            return HttpResponseServerError(ex)

    def list(self, request):
        user = request.auth.user

        # Only return jobs that the user is a part of
        jobs = Job.objects.filter(users=user)
        serializer = JobSerializer(
            jobs, many=True, context={'request': request})
        return Response(serializer.data)

    def update(self, request, pk=None):
        user = request.auth.user

        try:
            job = Job.objects.get(pk=pk)

            # Only the creator can alter the job
            if job.created_by != user:
                raise ValidationError("You can only edit jobs you created.")

            req = request.data
            job_type = JobType.objects.get(pk=req['type'])
            job.title = req['title']
            job.type = job_type
            job.frequency = req['frequency']
            job.description = req['description']
            job.last_completed = req['last_completed']
            job.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)

        except Job.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        except ValidationError as ex:
            return Response({"reason": ex.args[0]}, status=status.HTTP_401_UNAUTHORIZED)

    def destroy(self, request, pk=None):
        user = request.auth.user

        try:
            job = Job.objects.get(pk=pk)

            # Only the creator can delete the job
            if job.created_by != user:
                raise ValidationError("You can only delete jobs you created.")
            job.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)

        except Job.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        except ValidationError as ex:
            return Response({"reason": ex.args[0]}, status=status.HTTP_401_UNAUTHORIZED)

################################  Job Sharing Logic  ################################

    @action(methods=['post', 'delete'], detail=True)
    def share(self, request, pk=None):
        req = request.data
        user = request.auth.user
        user_2 = User.objects.get(pk=int(req['invitee']))

        # Make sure the job exists
        try:
            job = Job.objects.get(pk=pk)
        except Job.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        # Make sure users are friends
        try:
            friends = UserPair.objects.get(
                Q(user_1=user),
                Q(user_2=user_2),
                Q(accepted=True)
            )
        except UserPair.DoesNotExist:
            return Response('You are not friends with this user', status=status.HTTP_401_UNAUTHORIZED)

    # Sending a POST request to /jobs/pk/share will invite a user to a job
        if request.method == 'POST':
            # Make sure the invitation doesn't invite a user to a job they already share
            try:
                duplicate = JobInvite.objects.get(
                    Q(job=job),
                    Q(invitee=user_2)
                )
                return Response('You have already shared this job to this user!',
                                status=status.HTTP_400_BAD_REQUEST)
            except:
                pass

            # Create the invitation
            job_invite = JobInvite()
            job_invite.inviter = user
            job_invite.invitee = user_2
            job_invite.job = job

            try:
                job_invite.save()
                serializer = JobInviteSerializer(
                    job_invite, context={'request': request})
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            except ValidationError as ex:
                return Response({"reason": ex.message}, status=status.HTTP_400_BAD_REQUEST)
