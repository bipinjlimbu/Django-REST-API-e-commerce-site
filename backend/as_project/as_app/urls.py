from django.urls import path
from .views.auth_view import register_view

urlpatterns = [
    path('register/', register_view, name='register'),
]