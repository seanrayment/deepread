from rest_framework import serializers
from .models import Document, Highlight, Annotation
from authentication.serializers import CustomUserSerializer
from authentication.models import CustomUser

class HighlightSerializer(serializers.ModelSerializer):
    document = serializers.ReadOnlyField(source='document.title')
    class Meta:
        model = Highlight
        fields = (
            'pk',
            'document',
            'start_char',
            'end_char'
        )
    
    def validate(self, data):
        print(data)
        if data["start_char"] >= data["end_char"]:
            raise serializers.ValidationError("Start of highlight must occur before end of highlight")
        return data

class AnnotationSerializer(serializers.ModelSerializer):
    document = serializers.ReadOnlyField(source='document.title')
    class Meta:
        model = Annotation
        fields = (
            'pk',
            'document',
            'start_char',
            'end_char',
            'contents'
        )
    
    def validate(self, data):
        print(data)
        if data["start_char"] >= data["end_char"]:
            raise serializers.ValidationError("Start of annotation must occur before end of highlight")
        return data
            

class DocumentSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    highlights = HighlightSerializer(many=True, required=False)
    annotations = AnnotationSerializer(many=True, required=False)

    class Meta:
        model = Document
        fields = (
            'pk', 
            'owner', 
            'num_chars', 
            'contents', 
            'title', 
            'font_family', 
            'color', 
            'font_size', 
            'char_width', 
            'line_height', 
            'created_at', 
            'updated_at',
            'highlights',
            'annotations')

