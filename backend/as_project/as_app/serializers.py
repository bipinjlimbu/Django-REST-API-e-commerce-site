from rest_framework import serializers
from .models import User, Category, Product, Brands, CartItem

class UserSerializer(serializers.ModelSerializer):
    
    profile_picture = serializers.SerializerMethodField()
    
    class Meta:
        model = User
        fields = "__all__"
        
    def get_profile_picture(self, obj):
        request = self.context.get('request')

        if obj.profile_picture:
            url = obj.profile_picture.url

            if request:
                return request.build_absolute_uri(url)

            return url

        return None
    
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = "__all__"
        
class ProductSerializer(serializers.ModelSerializer):
    class Meta:
        model = Product
        fields = "__all__"
        
    def get_product_image(self, obj):
        request = self.context.get('request')

        if obj.product_image:
            url = obj.product_image.url

            if request:
                return request.build_absolute_uri(url)

            return url

        return None
    
class BrandSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brands
        fields = "__all__"
        
    def get_brand_logo(self, obj):
        request = self.context.get('request')

        if obj.brand_logo:
            url = obj.brand_logo.url

            if request:
                return request.build_absolute_uri(url)

            return url

        return None
    
class CartItemSerializer(serializers.Serializer):
    class Meta:
        model = CartItem
        fields = "__all__"