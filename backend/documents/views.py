from django.shortcuts import render
from rest_framework import status, permissions
from rest_framework.views import APIView
from .models import Document
from authentication.models import CustomUser
from rest_framework.response import Response
from django.http import Http404
from .serializers import DocumentSerializer

class DocumentView(APIView):

    def get_document(self, pk):
        try:
            return Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            raise Http404

    def get(self, request, pk, format='json'):
        print("successfully routed to document get method")
        try:
            user = CustomUser.objects.get(username=request.user.username)
            print(user.username)
            print(pk)
            doc = self.get_document(pk)
            print(doc.owner)
            if doc.owner == user:
                serializer = DocumentSerializer(doc)
                return Response(serializer.data)
            
            raise Http404
        except:
            raise Http404