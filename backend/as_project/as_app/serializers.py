from rest_framework import serializers
from .models import User

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