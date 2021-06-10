from django.db import models
from django.contrib.auth.models import User

class JobType(models.Model):
    title = models.CharField(max_length=50)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING)