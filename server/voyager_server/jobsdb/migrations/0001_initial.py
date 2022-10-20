# Generated by Django 4.1.2 on 2022-10-17 19:29

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name="Job",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("uuid", models.CharField(max_length=100)),
                (
                    "job_files",
                    django.contrib.postgres.fields.ArrayField(
                        base_field=models.FileField(upload_to=""), size=None
                    ),
                ),
            ],
        ),
    ]