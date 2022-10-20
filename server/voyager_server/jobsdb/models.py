from django.contrib.postgres.fields import ArrayField
from django.db import models


class Job(models.Model):
    uuid = models.UUIDField(primary_key=True, editable=False)
    job_files = ArrayField(models.FileField())
