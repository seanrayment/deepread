from rest_framework import serializers
from .models import Document
from authentication.serializers import CustomUserSerializer
from authentication.models import CustomUser

class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = Document
        fields = ('pk', 'owner', 'num_chars', 'contents', 'title', 'font_family', 'color', 'font_size', 'char_width', 'line_height')