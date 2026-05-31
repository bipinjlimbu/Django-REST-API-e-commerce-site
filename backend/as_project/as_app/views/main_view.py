from rest_framework import status
from rest_framework.decorators import api_view,permission_classes
from rest_framework.response import Response
from ..models import User, Category
from ..serializers import UserSerializer, CategorySerializer
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
import re
   
@api_view(['PUT','DELETE'])
@permission_classes([IsAuthenticated])
def profile_view(request, user_id):
    user = User.objects.get(id=user_id)
    
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
        
        serialized_user = UserSerializer(user, context={'request': request}).data
        
        return Response({'message': 'Profile updated successfully', 'user': serialized_user}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
    
@api_view(['GET', 'POST'])
@permission_classes([IsAdminUser])
def category_view(request):
    errors = {}
    if request.method == 'POST':
        name = request.data.get('name')
        slug = request.data.get('slug')
        
        if not name:
            errors['name'] = 'Name is required.'
        elif Category.objects.filter(name=name).exists():
            errors['name'] = 'Category name already exists.'
            
        if not slug:
            errors['slug'] = 'Slug is required.'
        elif Category.objects.filter(slug=slug).exists():
            errors['slug'] = 'Category slug already exists.'
            
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        category = Category.objects.create(name=name, slug=slug)
        serialized_category = CategorySerializer(category).data
        return Response({'message': 'Category created successfully', 'category': serialized_category}, status=status.HTTP_201_CREATED)
    
    elif request.method == 'GET':
        categories = Category.objects.all()
        serialized_categories = CategorySerializer(categories, many=True).data
        return Response({'categories': serialized_categories}, status=status.HTTP_200_OK)
    
@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAdminUser])
def single_category_view(request, category_id):
    try:
        category = Category.objects.get(id=category_id)
    except Category.DoesNotExist:
        return Response({'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    
    errors = {}
    if request.method == 'PUT':
        name = request.data.get('name')
        slug = request.data.get('slug')
        
        if not name:
            errors['name'] = 'Name is required.'
        elif Category.objects.filter(name=name).exclude(id=category.id).exists():
            errors['name'] = 'Category name already exists.'
            
        if not slug:
            errors['slug'] = 'Slug is required.'
        elif Category.objects.filter(slug=slug).exclude(id=category.id).exists():
            errors['slug'] = 'Category slug already exists.'
            
        if errors:
            return Response({'errors': errors}, status=status.HTTP_400_BAD_REQUEST)
        
        category.name = name
        category.slug = slug
        category.save()
        
        serialized_category = CategorySerializer(category).data
        return Response({'message': 'Category updated successfully', 'category': serialized_category}, status=status.HTTP_200_OK)
    
    elif request.method == 'GET':
        serialized_category = CategorySerializer(category).data
        return Response({'category': serialized_category}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        category.delete()
        return Response({'message': 'Category deleted successfully'}, status=status.HTTP_204_NO_CONTENT)