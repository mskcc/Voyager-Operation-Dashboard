from django.shortcuts import render
from rest_framework import viewsets
from .serializers import JobSerializer
from .models import Job


class JobView(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.all()
