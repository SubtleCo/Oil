from django.db import models
from django.contrib.auth.models import User

class JobInvite(models.Model):
    job = models.ForeignKey("Job", on_delete=models.CASCADE)
    inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_inviter")
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="job_invitee")