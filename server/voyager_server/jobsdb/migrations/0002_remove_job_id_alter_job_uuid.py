# Generated by Django 4.1.2 on 2022-10-17 19:42

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("jobsdb", "0001_initial"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="job",
            name="id",
        ),
        migrations.AlterField(
            model_name="job",
            name="uuid",
            field=models.UUIDField(editable=False, primary_key=True, serialize=True),
        ),
    ]
