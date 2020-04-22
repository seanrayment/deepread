from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from .models import Document
from authentication.models import CustomUser
from rest_framework.response import Response
from django.http import Http404
from .serializers import DocumentSerializer

class DocumentListView(APIView):

    def get(self, request, format='json'):
        try:
            user = CustomUser.objects.get(username=request.user.username)
            docs = user.document_set.filter(is_deleted=False)
            serializer = DocumentSerializer(docs, many=True)                
            return Response(serializer.data)
        except:
            raise Http404

class DocumentView(APIView):

    def get_document(self, pk):
        try:
            return Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            raise Http404

    def get(self, request, pk, format='json'):
        try:
            user = CustomUser.objects.get(username=request.user.username)
            doc = self.get_document(pk)
            if doc.owner == user:
                serializer = DocumentSerializer(doc)
                return Response(serializer.data)
            
            raise Http404
        except:
            raise Http404