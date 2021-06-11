from django.db.models import Q
from django.http import HttpResponseServerError
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from django.contrib.auth.models import User

class UserView(ViewSet):
    @action(methods=['get'], detail=False)
    def check(self, request):
        email = request.query_params.get('email', None)
        try:
            User.objects.get(email=email)
            return Response({
                "message":"That email already has an account",
                "valid": False
            })
        except User.DoesNotExist:
            return Response({"valid": True})