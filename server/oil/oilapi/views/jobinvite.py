"""Module responsible for accepting and rejecting job invites. Invitations are created in views/job.py"""
from django.http import HttpResponseServerError
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.decorators import action
from oilapi.models import Job, JobInvite
from datetime import datetime
from django.db.models import Q
from django.contrib.auth.models import User

class ShortJobSerializer(serializers.ModelSerializer):
    """JSON serializer for Jobs, abbreviated"""
    class Meta:
        model = Job
        fields = ['id', 'title']


class UserSerializer(serializers.ModelSerializer):
    """JSON serializer for user, names only"""
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']


class JobInviteSerializer(serializers.ModelSerializer):
    """JSON serializer for JobInvites"""
    job = ShortJobSerializer(many=False)
    inviter = UserSerializer(many=False)
    invitee = UserSerializer(many=False)

    class Meta:
        model = JobInvite
        fields = ['id', 'job', 'inviter', 'invitee', 'accepted']

# accessed with url '/shared/pk'
# pk is for JobInvite, not job
class JobInviteView(ViewSet):
    # Sending a DELETE request to /shared/pk will delete an existing invitation
    def destroy(self, request, pk=None):
        user = request.auth.user

        try:
            job_invite = JobInvite.objects.get(pk=pk)
        except JobInvite.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        # Ensure only the inviter or invitee can reject an invitation
        if job_invite.inviter != user and job_invite.invitee != user:
            return Response('Only the inviter or the invitee can cancel a shared job!', status=status.HTTP_401_UNAUTHORIZED)
        
        job_invite.delete()
        return Response(None, status=status.HTTP_204_NO_CONTENT)

    # List all job invites that involve the user
    # GET request to /shared
    def list(self, request):
        user = request.auth.user

        # get all invitations sent or recieved by the user
        job_invites = JobInvite.objects.filter(
            Q(inviter=user) | Q(invitee=user)
        )

        serializer = JobInviteSerializer(job_invites, many=True, context={'request': request})
        return Response(serializer.data)

    # The invitee accepts the job invitation
    # PUT request to /shared/pk
    def update(self, request, pk=None):
        user = request.auth.user

        try:
            job_invite = JobInvite.objects.get(
                Q(pk=pk),
                Q(invitee=user),
                Q(accepted=False)
            )
            # job_invite.accepted = True
            # job_invite.accepted_at = datetime.now()
            # job_invite.save()

            job = job_invite.job
            job.users.add(user)
            job_invite.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except JobInvite.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        


