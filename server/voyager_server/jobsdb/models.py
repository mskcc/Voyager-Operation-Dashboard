from django.contrib.postgres.fields import ArrayField
from django.db import models


class Job(models.Model):
    uuid = models.UUIDField(primary_key=True)
    job_files = ArrayField(models.CharField(max_length=300))
