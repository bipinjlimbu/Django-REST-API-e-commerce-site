from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from ..models import User
from rest_framework_simplejwt.tokens import RefreshToken
# from ..serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
import re

@api_view(['POST'])
@permission_classes([AllowAny])
def register_view(request):
    errors = {}
    if request.method == 'POST':
        username = request.data.get('username')
        first_name = request.data.get('first_name', '')
        last_name = request.data.get('last_name', '')
        email = request.data.get('email')
        password = request.data.get('password')
        confirm_password = request.data.get('confirm_password')
        phone_number = request.data.get('phone_number', '')
        
        username_pattern = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')
        if not username:
            errors['username'] = 'Username is required.'
        elif User.objects.filter(username=username).exists():
            errors['username'] = 'Username already exists.'
        elif not username_pattern.match(username):
            errors['username'] = 'Username must contain at least one letter and one number.'
        
        email_pattern = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$') 
        if not email:
            errors['email'] = 'Email is required.'
        elif User.objects.filter(email=email).exists():
            errors['email'] = 'Email already exists.'
        elif not email_pattern.match(email):
            errors['email'] = 'Invalid email format.'
            
        password_pattern = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')
        if not password:
            errors['password'] = 'Password is required.'
        elif not password_pattern.match(password):
            errors['password'] = 'Password must contain at least one letter and one number.'
        elif password != confirm_password:
            errors['confirm_password'] = 'Passwords do not match.'
            
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = User.objects.create_user(username=username, email=email, password=password, first_name=first_name, last_name=last_name, phone_number=phone_number)
        user.save()
        
        return Response({"message": "User created successfully"}, status=status.HTTP_201_CREATED)
    
    
            