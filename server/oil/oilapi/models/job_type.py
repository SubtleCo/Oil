from django.db import models

class JobType(models.Model):
    title = models.CharField(max_length=50)