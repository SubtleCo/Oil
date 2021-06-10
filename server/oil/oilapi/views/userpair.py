from django.db.models import Q
from django.http import HttpResponseServerError
from rest_framework.exceptions import ValidationError
from rest_framework.viewsets import ViewSet
from rest_framework.response import Response
from rest_framework import serializers, status
from rest_framework.decorators import action
from oilapi.models import UserPair
from django.contrib.auth.models import User
from datetime import datetime

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
        fields = ['id', 'user_1', 'user_2', 'accepted']

class UserPairView(ViewSet):

    # Sending a POST to /friends/pk/invite will invite a friend
    @action(methods=['post'], detail=True)
    def invite(self, request, pk=None):
        user = request.auth.user
        user_2 = User.objects.get(pk=pk)

        # Make sure the user isn't trying to befriend themselves
        if user == user_2:
            return Response('No, you cannot befriend yourself.', status=status.HTTP_400_BAD_REQUEST)

        # Make sure this relationship does not already exist

        try:
            UserPair.objects.get(Q(user_1=user) & Q(user_2=user_2))
            return Response('You cannot double invite someone!', status=status.HTTP_401_UNAUTHORIZED)
        except:
            pass

        req = request.data
        user_pair = UserPair()
        user_pair.user_1 = user
        user_pair.user_2 = user_2


        try:
            user_pair.save()
            serializer = UserPairSerializer(user_pair, context={'request': request})
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        except ValidationError as ex:
            return Response({"reason": ex.message}, status=status.HTTP_400_BAD_REQUEST)

    # Return a list of friendships the user is part of
    def list(self, request):
        user = request.auth.user

        user_pairs = UserPair.objects.filter(Q(user_1=user) | Q(user_2=user))
        serializer = UserPairSerializer(user_pairs, many=True, context={'request': request})
        return Response(serializer.data)

    # Used to remove an accepted friendship OR reject an invite
    def destroy(self, request, pk=None):
        user = request.auth.user

        try:
            user_pair = UserPair.objects.get(pk=pk)
            # Only let someone from the relationship delete it
            if user_pair.user_1 != user and user_pair.user_2 != user:
                return Response('You can only remove your own relationships!', status=status.HTTP_401_UNAUTHORIZED)

            user_pair.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        
        except UserPair.DoesNotExist as ex:
            return Response(ex.args[0], status=status.HTTP_404_NOT_FOUND)

        except ValidationError as ex:
            return Response({"reason": ex.args[0]}, status=status.HTTP_401_UNAUTHORIZED)

    # Accept an invite from another user if user == user_2 in the UserPair
    @action(methods=['put'], detail=True)
    def accept(self, request, pk=None):
        user = request.auth.user

        try:
            user_pair = UserPair.objects.get(pk=pk)
            if user_pair.user_2 != user:
                return Response('Only the invited user can accept the invitation', status=status.HTTP_401_UNAUTHORIZED)
            user_pair.accepted = True
            user_pair.accepted_at = datetime.now()
            user_pair.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)

        except UserPair.DoesNotExist as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_404_NOT_FOUND)

        except Exception as ex:
            return Response({'message': ex.args[0]}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            