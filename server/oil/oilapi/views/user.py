from django.db.models import Q
from django.http import HttpResponseServerError
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
import json


class UserSerializer(serializers.ModelSerializer):
    """JSON serializer for Users"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username', 'email']


class UserView(ViewSet):
    # Return a list of users based on a search query
    # Allows for email or username search
    def list(self, request):
        user = request.auth.user
        key = request.query_params.get('search', None)
        if key != None:
            try:
                users = User.objects.filter(
                    Q(email__icontains=key) |
                    Q(username__icontains=key),
                    ~Q(id=user.id)
                )
                serializer = UserSerializer(
                    users, many=True, context={'request': request})
                return Response(serializer.data)
            except User.DoesNotExist as ex:
                return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

    def update(self, request, pk=None):
        user = request.auth.user
        if user.id != int(pk):
            return Response("You cannot edit a user account that is not your own", status=status.HTTP_401_UNAUTHORIZED)

        req = request.data
        try:
            edit_user = User.objects.get(pk=user.id)
            edit_user.set_password(req['password'])
            edit_user.username = req['username']
            edit_user.email = req['email']
            edit_user.first_name = req['first_name']
            edit_user.last_name = req['last_name']

            edit_user.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response("You cannot edit a user account that is not your own", status=status.HTTP_401_UNAUTHORIZED)

    # Get current user
    @action(methods=['get'], detail=False)
    def me(self, request):
        user = request.auth.user
        serializer = UserSerializer(user, context={'request': request})
        return Response(serializer.data)
