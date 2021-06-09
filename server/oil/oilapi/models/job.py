from django.db import models
from django.contrib.auth.models import User

class Job(models.Model):
    title = models.CharField(max_length=50)
    type = models.ForeignKey("JobType", on_delete=models.DO_NOTHING)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_creator")
    frequency = models.IntegerField(default=1)
    created_at = models.DateField(auto_now=False, auto_now_add=True)
    last_completed = models.DateField(auto_now=False, auto_now_add=False)
    last_completed_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="last_job_completer", null=True)
    users = models.ManyToManyField(User, related_name="job")
