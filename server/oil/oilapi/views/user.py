from django.db.models import Q
from django.http import HttpResponseServerError
from rest_framework.decorators import action
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt

class UserSerializer(serializers.ModelSerializer):
    """JSON serializer for Users"""
    class Meta:
        model = User
        fields = ['id', 'first_name', 'last_name', 'username']


class UserView(ViewSet):
    # Return a list of users based on a search query
    # Allows for email or username search
    def list(self, request):
        key = request.query_params.get('search', None)
        if key is not None and key is not "":
            try:
                users = User.objects.filter(
                    Q(email__icontains=key) |
                    Q(username__icontains=key)
                    )
                serializer = UserSerializer(users, many=True, context={'request': request})
                return Response(serializer.data)
            except User.DoesNotExist as ex:
                return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

