"""Module responsible for accepting and rejecting job invites. Invitations are created in views/job.py"""
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

# accessed with url '/shared/pk'
class JobInviteView(ViewSet):
    # Sending a DELETE request to /jobs/pk/share will delete an existing invitation
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

    def list(self, request):
        return Response('hi there!')
        
        