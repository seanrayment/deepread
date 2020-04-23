from rest_framework import serializers
from .models import Document
from authentication.serializers import CustomUserSerializer
from authentication.models import CustomUser

class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Document
        fields = ('owner', 'num_chars', 'is_deleted', 'contents', 'title')