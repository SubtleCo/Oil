from django.http import HttpResponseServerError
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.decorators import action
from oilapi.models import Job, JobType
from datetime import date

class JobTypeSerializer(serializers.ModelSerializer):
    """JSON serializer for Jobs"""
    class Meta:
        model = JobType
        fields = ['id', 'title']

class JobTypeView(ViewSet):
    def create(self, request):
        user = request.auth.user

        req = request.data
        job_type = JobType()
        job_type.created_by = user
        job_type.title = req['title']

        try:
            job_type.save()
            serializer = JobTypeSerializer(job_type, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ex:
            return Response({"reason": ex.message}, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None):
        user = request.auth.user

        try:
            job_type = JobType.objects.get(pk=pk)

            # Only the creator can delete the job
            if job_type.created_by != user:
                raise ValidationError("You can only delete job types you created.")
            job_type.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        
        except JobType.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        except ValidationError as ex:
            return Response({"reason": ex.args[0]}, status=status.HTTP_401_UNAUTHORIZED)

            