from django.http import HttpResponseServerError
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.decorators import action
from oilapi.models import UserPair
from django.contrib.auth.models import User
from datetime import date

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class UserPairSerializer(serializers.ModelSerializer):
    """JSON serializer for Jobs"""
    user_1 = UserSerializer(many=False)
    user_2 = UserSerializer(many=False)

    class Meta:
        model = UserPair
        fields = ['id', 'user_1', 'user_2']

class UserPairView(ViewSet):
    @action(methods=['post','delete'], detail=True)
    def invite(self, request, pk=None):
        user = request.auth.user
        


            