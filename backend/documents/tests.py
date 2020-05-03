from django.test import TestCase
from .models import Document, Highlight, Annotation
from .serializers import HighlightSerializer, DocumentSerializer, AnnotationSerializer
from authentication.models import CustomUser

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
        print(self.document_attributes)
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
