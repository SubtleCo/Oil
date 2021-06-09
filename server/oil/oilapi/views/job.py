from django.http import HttpResponseServerError
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.decorators import action
from oilapi.models import Job, JobType
from datetime import date

class JobSerializer(serializers.ModelSerializer):
    """JSON serializer for Jobs"""
    class Meta:
        model = Job
        fields = ['id', 'title', 'type', 'frequency', 'created_at', 'last_completed', 'last_completed_by', 'users']


class JobView(ViewSet):
    def create(self, request):
        user = request.auth.user

        req = request.data
        job = Job()
        job_type = JobType.objects.get(pk=req['type'])
        job.title = req['title']
        job.type = job_type
        job.created_by = user
        job.frequency = req['frequency']
        job.last_completed = req['last_completed']

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
        serializer = JobSerializer(jobs, many=True, context={'request': request})
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

            