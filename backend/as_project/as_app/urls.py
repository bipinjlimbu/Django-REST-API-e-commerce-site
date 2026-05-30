from django.urls import path
from .views.auth_view import register_view, login_view, logout_view
from .views.main_view import profile_view, category_view

urlpatterns = [
    path('register/', register_view, name='register'),
    path('login/', login_view, name='login'),
    path('logout/', logout_view, name='logout'),
    path('profile/<int:user_id>/', profile_view, name='profile'),
    path('category/', category_view, name='category'),
]