from django.shortcuts import render
from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.settings import api_settings
from .serializers import JobSerializer
from .models import Job


class JobView(viewsets.ModelViewSet):
    serializer_class = JobSerializer
    queryset = Job.objects.all()

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)

        # Job.objects.filter(uuid=request.data["uuid"]).update(
        #     job_files=request.data["job_files"]
        # )

        if serializer.is_valid() == False:
            if Job.objects.filter(uuid=request.data["uuid"]).exists():
                return self.update(request)
            else:
                return Response(
                    serializer.data, status=status.HTTP_400_BAD_REQUEST, headers=headers
                )
        else:
            serializer.is_valid(raise_exception=True)
            self.perform_create(serializer)
            headers = self.get_success_headers(serializer.data)
            return Response(
                serializer.data, status=status.HTTP_201_CREATED, headers=headers
            )

    def perform_create(self, serializer):
        serializer.save()

    def get_success_headers(self, data):
        try:
            return {"Location": str(data[api_settings.URL_FIELD_NAME])}
        except (TypeError, KeyError):
            return {}

    # def update(self, request, *args, **kwargs):
    #     # return Response(status=status.HTTP_200_OK)

    #     # partial = kwargs.pop("partial", False)
    #     # instance = self.get_object()
    #     # serializer = self.get_serializer(instance, data=request.data, partial=partial)
    #     # serializer.is_valid(raise_exception=True)
    #     # self.perform_update(serializer)

    #     # if getattr(instance, "_prefetched_objects_cache", None):
    #     #     # If 'prefetch_related' has been applied to a queryset, we need to
    #     #     # forcibly invalidate the prefetch cache on the instance.
    #     #     instance._prefetched_objects_cache = {}

    #     #     return Response(serializer.data)

    # def perform_update(self, serializer):
    #     serializer.save()

    # def partial_update(self, request, *args, **kwargs):
    #     kwargs["partial"] = True
    #     return self.update(request, *args, **kwargs)
