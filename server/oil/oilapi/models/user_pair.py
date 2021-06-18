from django.db import models
from django.contrib.auth.models import User

class UserPair(models.Model):
    user_1 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pair_user_1")
    user_2 = models.ForeignKey(User, on_delete=models.CASCADE, related_name="pair_user_2")
    accepted = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    accepted_at = models.DateTimeField(null=True)