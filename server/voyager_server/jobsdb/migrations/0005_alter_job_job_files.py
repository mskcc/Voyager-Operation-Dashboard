# Generated by Django 4.1.2 on 2022-10-24 15:51

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("jobsdb", "0004_alter_job_uuid"),
    ]

    operations = [
        migrations.AlterField(
            model_name="job",
            name="job_files",
            field=django.contrib.postgres.fields.ArrayField(
                base_field=models.FileField(upload_to=None), size=None
            ),
        ),
    ]
