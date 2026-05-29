from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from ..models import User
from ..serializers import UserSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
import re

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    
    errors = {}
    if request.method == 'PUT':
        username = request.data.get('username', user.username)
        first_name = request.data.get('first_name', user.first_name)
        last_name = request.data.get('last_name', user.last_name)
        email = request.data.get('email', user.email)
        phone_number = request.data.get('phone_number', user.phone_number)
        profile_picture = request.FILES.get('profile_picture')
        
        username_pattern = re.compile(r'^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$')
        if username and User.objects.filter(username=username).exclude(id=user.id).exists():
            errors['username'] = 'Username already exists.'
        elif username and not username_pattern.match(username):
            errors['username'] = 'Username must contain at least one letter and one number.'
            
        email_pattern = re.compile(r'^[\w\.-]+@[\w\.-]+\.\w+$')
        if email and User.objects.filter(email=email).exclude(id=user.id).exists():
            errors['email'] = 'Email already exists.'
        elif email and not email_pattern.match(email):
            errors['email'] = 'Invalid email format.'
            
        if phone_number:
            phone_pattern = re.compile(r'^\+?1?\d{9,15}$')
            if not phone_pattern.match(phone_number):
                errors['phone_number'] = 'Invalid phone number format.'
        
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        user.username = username
        user.first_name = first_name
        user.last_name = last_name
        user.email = email
        user.phone_number = phone_number
        if profile_picture:
            user.profile_picture = profile_picture
        user.save()
        
        serialized_user = UserSerializer(user)
        
        return Response({'message': 'Profile updated successfully', 'user': serialized_user.data}, status=status.HTTP_200_OK)