from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from django.contrib.auth import authenticate
from ..models import User
from rest_framework_simplejwt.tokens import RefreshToken
from ..serializers import UserSerializer
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
    
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }
    
@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    errors = {}
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        
        if not username:
            errors['username'] = 'Username is required.'
        if not password:
            errors['password'] = 'Password is required.'
        
        if errors:
            return Response(errors, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        
        if user is not None:
            tokens = get_tokens_for_user(user)
            serialized_user = UserSerializer(user).data
            return Response({"message": "Login successful", "tokens": tokens, "user": serialized_user}, status=status.HTTP_200_OK)
        else:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)
        
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get('refresh')
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"message": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
    except Exception as e:
        return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)