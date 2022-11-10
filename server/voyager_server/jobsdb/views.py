from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.settings import api_settings
from .serializers import JobSerializer
from .models import Job


class JobView(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.all()
