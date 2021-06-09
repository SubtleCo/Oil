from django.contrib.auth.models import User
from django.db import models


class PairInvite(models.Model):
    inviter = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pair_inviter")
    invitee = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pair_invitee")