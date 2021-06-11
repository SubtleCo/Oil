"""Register and login module"""
import json
from django.contrib import auth
from django.http import HttpResponse, HttpResponseNotAllowed
from django.contrib.auth import authenticate
from django.contrib.auth.models import User
from django.views.decorators.csrf import csrf_exempt
from rest_framework import status
from rest_framework.authtoken.models import Token

@csrf_exempt
def login_user(request):
    """ User login authentication """
    body = request.body.decode('utf-8')
    req_body = json.loads(body)

    if request.method == "POST":
        username = req_body['username']
        password = req_body['password']
        authed_user = authenticate(username=username, password=password)

        if authed_user is not None:
            token = Token.objects.get(user=authed_user)
            data = json.dumps({
                "valid": True,
                "token": token.key,
                "id": authed_user.id
                })
            return HttpResponse(data, content_type="application/json")

        else:
            # User provided incorrect login details
            data = json.dumps({"valid": False})
            return HttpResponse(data, content_type="application/json")

    return HttpResponseNotAllowed(permitted_methods=['POST'])

@csrf_exempt
def register_user(request):
    """ User and Token creation for a new user """

    req_body = json.loads(request.body.decode())

    # Create the new user with Django
    new_user = User.objects.create_user(
        username=req_body['username'],
        email=req_body['email'],
        password=req_body['password'],
        first_name=req_body['first_name'],
        last_name=req_body['last_name']
    )

    # Assign the new user a token
    token = Token.objects.create(user=new_user)

    # Return the token to the client
    data = json.dumps({"token": token.key, "id": new_user.id})
    return HttpResponse(data, content_type='application/json', status=status.HTTP_201_CREATED)


