from rest_framework import serializers
from .models import Document
from authentication.serializers import CustomUserSerializer

class DocumentSerializer(serializers.ModelSerializer):
    owner = CustomUserSerializer()

    class Meta:
        model = Document
        fields = ('owner', 'num_chars', 'is_deleted', 'contents', 'title')
