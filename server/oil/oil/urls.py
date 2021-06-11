"""oil URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from rest_framework.authtoken.views import obtain_auth_token
from django.contrib import admin
from django.urls import path
from rest_framework import routers
from django.conf.urls import include, url
from oilapi.views import (  JobView,
                            JobTypeView,
                            UserPairView,
                            JobInviteView,
                            UserView,
                            login_user,
                            register_user
                            )   

router = routers.DefaultRouter(trailing_slash=False)
router.register(r'jobs', JobView, 'job')
router.register(r'jobtypes', JobTypeView, 'job_type')
router.register(r'friends', UserPairView, 'user_pair')
router.register(r'shared', JobInviteView, 'job_invite')
router.register(r'users', UserView, 'user')

urlpatterns = [
    path('', include(router.urls)),
    path('admin/', admin.site.urls),
    url(r'^login$', login_user),
    url(r'^register$', register_user),
    url(r'^api-token-auth$', obtain_auth_token),
    url(r'^api-auth', include('rest_framework.urls', namespace='rest_framework')),
]
