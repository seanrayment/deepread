from django.shortcuts import render
from django.core.exceptions import ValidationError
from rest_framework import status, permissions
from rest_framework.views import APIView
from .models import Document, Highlight, Annotation
from authentication.models import CustomUser
from rest_framework.response import Response
from django.http import Http404
from .serializers import DocumentSerializer, HighlightSerializer, AnnotationSerializer
from authentication.serializers import CustomUserSerializer
import json

class DocumentListView(APIView):

    def get(self, request, format='json'):
        try:
            docs = request.user.document_set.all()
            serializer = DocumentSerializer(docs, many=True)                
            return Response(serializer.data)
        except:
            raise Http404

    def post(self, request, format='json'):
        serializer = DocumentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(owner=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class HighlightListView(APIView):
    def get_document(self, pk):
        try:
            return Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            raise Http404

    def get(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            highlights = doc.highlights.all()
            serializer = HighlightSerializer(highlights, many=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            serializer = HighlightSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    serializer.save(document=doc)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except ValidationError as err:
                    return Response(err.message_dict, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class AnnotationListView(APIView):
    def get_document(self, pk):
        try:
            return Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            raise Http404

    def get(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            annotations = doc.annotations.all()
            serializer = AnnotationSerializer(annotations, many=True)
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            serializer = AnnotationSerializer(data=request.data)
            if serializer.is_valid():
                try:
                    serializer.save(document=doc)
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except ValidationError as err:
                    return Response(err.message_dict, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

class DocumentView(APIView):
    def get_document(self, pk):
        try:
            return Document.objects.get(pk=pk)
        except Document.DoesNotExist:
            raise Http404

    def put(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            serializer = DocumentSerializer(doc, data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            serializer = DocumentSerializer(doc)
            return Response(serializer.data)
        raise Http404

    def delete(self, request, pk, format='json'):
        doc = self.get_document(pk)
        if doc.owner == request.user:
            doc.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        raise Http404

class HighlightView(APIView):
    def get_highlight(self, pk):
        try:
            return Highlight.objects.get(pk=pk)
        except Highlight.DoesNotExist:
            raise Http404

    def put(self, request, pk, format='json'):
        h = self.get_highlight(pk)
        doc = h.document
        if doc.owner == request.user:
            serializer = HighlightSerializer(h, data=request.data)
            if serializer.is_valid():
                try:
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except ValidationError as err:
                    return Response(err.message_dict, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk, format='json'):
        h = self.get_highlight(pk)
        doc = h.document
        if doc.owner == request.user:
            serializer = HighlightSerializer(h)
            return Response(serializer.data)
        raise Http404

    def delete(self, request, pk, format='json'):
        h = self.get_highlight(pk)
        doc = h.document
        if doc.owner == request.user:
            h.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        raise Http404


class AnnotationView(APIView):
    def get_annotation(self, pk):
        try:
            return Annotation.objects.get(pk=pk)
        except Annotation.DoesNotExist:
            raise Http404

    def put(self, request, pk, format='json'):
        a = self.get_annotation(pk)
        doc = h.document
        if doc.owner == request.user:
            serializer = AnnotationSerializer(a, data=request.data)
            if serializer.is_valid():
                try:
                    serializer.save()
                    return Response(serializer.data, status=status.HTTP_201_CREATED)
                except ValidationError as err:
                    return Response(err.message_dict, status=status.HTTP_400_BAD_REQUEST)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request, pk, format='json'):
        a = self.get_annotation(pk)
        doc = a.document
        if doc.owner == request.user:
            serializer = AnnotationSerializer(a)
            return Response(serializer.data)
        raise Http404

    def delete(self, request, pk, format='json'):
        a = self.get_annotation(pk)
        doc = a.document
        if doc.owner == request.user:
            a.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        raise Http404