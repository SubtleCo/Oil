from django.db import models
from django.contrib.auth.models import User
from datetime import date

class Job(models.Model):
    title = models.CharField(max_length=50)
    description = models.TextField(max_length=250, null=True)
    type = models.ForeignKey("JobType", on_delete=models.DO_NOTHING)
    created_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="job_creator")
    frequency = models.IntegerField(default=1)
    created_at = models.DateField(auto_now=False, auto_now_add=True)
    last_completed = models.DateField(auto_now=False, auto_now_add=False)
    last_completed_by = models.ForeignKey(User, on_delete=models.DO_NOTHING, related_name="last_job_completer", null=True)
    users = models.ManyToManyField(User, related_name="job")

    @property
    def days_lapsed(self):
        """How many days have passed since last completion"""
        lapse = date.today() - self.last_completed
        lapse_in_days = int(lapse.days)
        days_since_due = lapse_in_days - int(self.frequency)
        return days_since_due
