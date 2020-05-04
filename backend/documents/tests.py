from django.test import TestCase
from rest_framework import status
from .models import Document, Highlight, Annotation
from .serializers import HighlightSerializer, DocumentSerializer, AnnotationSerializer
from authentication.models import CustomUser
from authentication.serializers import CustomUserSerializer
from rest_framework.test import APIClient
from authentication.views import ObtainTokenPairWithColorView
from rest_framework.test import APIRequestFactory
import json
# HTTP methods work on docs when authenticated
# HTTP methods don't work on docs when not authenticated
# HTTP methods don't work on doc that is not associated with user

class HighlightTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="sar5498",
            email="sar5498@test.com",
            password="longenoughpassword"
        )
        self.doc = Document.objects.create(
            owner=self.user,
            contents="This is the Lorem Ipsum content yuo were waiting for"
        )


        self.highlight_attrs = {
            "start_char": 0,
            "end_char": 2
        }

        self.invalid_attrs = {
            "start_char": 2,
            "end_char": 0
        }

    def test_highlight_serializer(self):
        self.highlight = Highlight.objects.create(
            document=self.doc,
            start_char=0,
            end_char=0
        )
        serializer = HighlightSerializer(instance=self.highlight)
        self.assertTrue(serializer.data["start_char"] == self.highlight.start_char)
        self.assertTrue(serializer.data["end_char"] == self.highlight.end_char)
        self.assertTrue(serializer.data["document"] == self.doc.title)

    def test_highlight_deserializer(self):
        serializer = HighlightSerializer(data=self.highlight_attrs)
        self.assertTrue(serializer.is_valid())
        hlight = serializer.save(document=self.doc)
        self.assertTrue(Highlight.objects.filter(start_char=0, end_char=2).exists())
        self.assertTrue(len(serializer.errors.keys()) == 0)
    
    def test_highlight_invalidaton(self):
        self.serializer = HighlightSerializer(data=self.invalid_attrs)
        self.assertFalse(self.serializer.is_valid())

class AnnotationTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="sar5498",
            email="sar5498@test.com",
            password="longenoughpassword"
        )
        self.doc = Document.objects.create(
            owner=self.user,
            contents="This is the Lorem Ipsum content yuo were waiting for"
        )


        self.annotation_attrs = {
            "start_char": 0,
            "end_char": 2,
            "contents": "This part was really cool"
        }

        self.invalid_attrs = {
            "start_char": 2,
            "end_char": 0,
            "contents": "This part was really cool"
        }

    def test_annotation_serializer(self):
        self.annotation = Annotation.objects.create(
            document=self.doc,
            start_char=0,
            end_char=2,
            contents="This part was really cool"
        )
        serializer = AnnotationSerializer(instance=self.annotation)
        self.assertTrue(serializer.data["start_char"] == self.annotation.start_char)
        self.assertTrue(serializer.data["end_char"] == self.annotation.end_char)
        self.assertTrue(serializer.data["contents"] == self.annotation.contents)
        self.assertTrue(serializer.data["document"] == self.doc.title)

    def test_annotation_deserializer(self):
        serializer = AnnotationSerializer(data=self.annotation_attrs)
        self.assertTrue(serializer.is_valid())
        a = serializer.save(document=self.doc)
        self.assertTrue(Annotation.objects.filter(**self.annotation_attrs).exists())
        self.assertTrue(len(serializer.errors.keys()) == 0)
    
    def test_annotation_invalidaton(self):
        self.serializer = AnnotationSerializer(data=self.invalid_attrs)
        self.assertFalse(self.serializer.is_valid())

class DocumentTest(TestCase):
    def setUp(self):
        self.user = CustomUser.objects.create(
            username="sar5498",
            email="sar5498@test.com",
            password="longenoughpassword"
        )

        self.document_attributes = {
            "title": "This is the test title",
            "contents": "This is the test contents",
            "line_height": 1.5,
            "font_size": 14,
            "char_width": 60,
            "color": "ffffff",
            "font_family": "Times New Roman"
        }

        self.invalid_attributes = {
            "line_height": 6.0,
            "font_size": 14,
            "char_width": 60,
            "color": "#ffffff",
            "font_family": "times new roman"                   
        }

    def test_document_serializer(self):
        doc = Document.objects.create(**self.document_attributes, owner=self.user)
        serializer = DocumentSerializer(instance=doc)
        for (key, value) in self.document_attributes.items():
            self.assertTrue(serializer.data[key] == value)
    
    def test_document_deserializer(self):
        serializer = DocumentSerializer(data=self.document_attributes)
        self.assertTrue(serializer.is_valid())
        doc = serializer.save(owner=self.user)
        self.assertTrue(Document.objects.filter(**self.document_attributes).exists())
        self.assertTrue(len(serializer.errors.keys()) == 0)

    def test_document_invalidation(self):
        serializer = DocumentSerializer(data=self.invalid_attributes)
        self.assertFalse(serializer.is_valid())
        self.assertTrue("line_height" in serializer.errors and "color" in serializer.errors and "font_family" in serializer.errors)


class HighlightViewTest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()

        self.highlight_attrs = {
            "start_char": 0,
            "end_char": 2
        }

        self.custom_user_attributes = {
            "username": "sar5498",
            "email": "sar5498@gmail.com",
            "password": "longenoughpassword"
        }
        
        self.another_user = {
            "username": "srayment",
            "email": "srayment@test.com",
            "password": "longenoughpassword"
        }

        self.user_credentials = {
            "username": "sar5498",
            "password": "longenoughpassword"
        }

        self.user_serializer = CustomUserSerializer(data=self.custom_user_attributes)
        self.user_serializer.is_valid()
        self.user = self.user_serializer.save()
        self.saved_doc = Document.objects.create(owner=self.user, title="this title should be persisted", contents="this is then lorem ipsum contents you've all been waiting for")
        response = self.client.post('/api/token/obtain/', self.user_credentials)
        self.auth_string = 'JWT ' + json.loads(response.content)["access"]
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_string)

    def test_highlight_create(self):
        response = self.client.post('/api/highlights/{pk}/'.format(pk=self.saved_doc.pk), self.highlight_attrs)
        self.assertTrue(response.status_code == status.HTTP_201_CREATED)
        res_dict = json.loads(response.content)
        self.assertTrue("pk" in res_dict and "start_char" in res_dict and "end_char" in res_dict)

    def test_highlight_get(self):
        self.highlight = Highlight.objects.create(**self.highlight_attrs, document=self.saved_doc)
        response = self.client.get('/api/highlight/{pk}/'.format(pk=self.highlight.pk))
        self.assertTrue(response.status_code == status.HTTP_200_OK)
        res_dict = json.loads(response.content)
        self.assertTrue(res_dict["start_char"] == self.highlight.start_char)
        self.assertTrue(res_dict["end_char"] == self.highlight.end_char)

    def test_highlight_get_wrong_user(self):
        self.different_user_serializer = CustomUserSerializer(data=self.another_user)
        self.different_user_serializer.is_valid()
        self.different_user = self.different_user_serializer.save()
        self.their_doc = Document.objects.create(owner=self.different_user, title="this doc is owned by another user", contents="this is not visible unless requested by the correct owner")
        self.their_highlight = Highlight.objects.create(**self.highlight_attrs, document=self.their_doc)
        response = self.client.get('/api/highlight/{pk}/'.format(pk=self.their_highlight.pk))
        self.assertTrue(response.status_code == status.HTTP_404_NOT_FOUND)
        
class AnnotationViewTest(TestCase):
    
    def setUp(self):
        self.client = APIClient()
        self.factory = APIRequestFactory()

        self.ann_attrs = {
            "start_char": 0,
            "end_char": 2,
            "contents": "this section was cool"
        }

        self.custom_user_attributes = {
            "username": "sar5498",
            "email": "sar5498@gmail.com",
            "password": "longenoughpassword"
        }
        
        self.another_user = {
            "username": "srayment",
            "email": "srayment@test.com",
            "password": "longenoughpassword"
        }

        self.user_credentials = {
            "username": "sar5498",
            "password": "longenoughpassword"
        }

        self.user_serializer = CustomUserSerializer(data=self.custom_user_attributes)
        self.user_serializer.is_valid()
        self.user = self.user_serializer.save()
        self.saved_doc = Document.objects.create(owner=self.user, title="this title should be persisted", contents="this is then lorem ipsum contents you've all been waiting for")
        response = self.client.post('/api/token/obtain/', self.user_credentials)
        self.auth_string = 'JWT ' + json.loads(response.content)["access"]
        self.client.credentials(HTTP_AUTHORIZATION=self.auth_string)

    def test_annotation_create(self):
        response = self.client.post('/api/annotations/{pk}/'.format(pk=self.saved_doc.pk), self.ann_attrs)
        self.assertTrue(response.status_code == status.HTTP_201_CREATED)
        res_dict = json.loads(response.content)
        self.assertTrue("pk" in res_dict and "start_char" in res_dict and "end_char" in res_dict and "contents" in res_dict)

    def test_annotation_get(self):
        self.annotation = Annotation.objects.create(**self.ann_attrs, document=self.saved_doc)
        response = self.client.get('/api/annotation/{pk}/'.format(pk=self.annotation.pk))
        self.assertTrue(response.status_code == status.HTTP_200_OK)
        res_dict = json.loads(response.content)
        self.assertTrue(res_dict["start_char"] == self.annotation.start_char)
        self.assertTrue(res_dict["end_char"] == self.annotation.end_char)
        self.assertTrue(res_dict["contents"] == self.annotation.contents)

    def test_annotation_wrong_user(self):
        self.different_user_serializer = CustomUserSerializer(data=self.another_user)
        self.different_user_serializer.is_valid()
        self.different_user = self.different_user_serializer.save()
        self.their_doc = Document.objects.create(owner=self.different_user, title="this doc is owned by another user", contents="this is not visible unless requested by the correct owner")
        self.their_annotation = Annotation.objects.create(**self.ann_attrs, document=self.their_doc)
        response = self.client.get('/api/annotation/{pk}/'.format(pk=self.their_annotation.pk))
        self.assertTrue(response.status_code == status.HTTP_404_NOT_FOUND)
        