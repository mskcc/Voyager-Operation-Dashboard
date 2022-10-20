from django.contrib import admin
from django.urls import path, include
from jobsdb import views
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r"jobs", views.JobView, "job")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include(router.urls)),
]
