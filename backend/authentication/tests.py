from django.test import TestCase
from rest_framework import status
from .models import CustomUser
from .serializers import CustomUserSerializer
from .views import CustomUserCreate, ObtainTokenPairWithColorView
from rest_framework.test import APIRequestFactory
import json

class CustomUserTest(TestCase):
    def setUp(self):
        CustomUser.objects.create(
            username="sar5498",
            email="sar5498@test.com",
            password="longenoughpassword")
    
    def test_user_exists(self):
        self.assertTrue(CustomUser.objects.filter(username="sar5498").exists())

class CustomUserSerializerTest(TestCase):
    def setUp(self):
        self.custom_user_attributes = {
            "username": "sar5498",
            "email": "sar5498@gmail.com",
            "password": "longenoughpassword"
        }
        self.invalid_user_attributes = {
            "username": "anewusername",
            "email": "invalidemail",
            "password": "short"
        }

    def test_custom_user_serializer(self):
        self.custom_user = CustomUser.objects.create(**self.custom_user_attributes)
        self.serializer = CustomUserSerializer(instance=self.custom_user)
        self.assertTrue("password" not in self.serializer.data)
        self.assertTrue(self.serializer.data["username"] == self.custom_user_attributes["username"])
        self.assertTrue(self.serializer.data["email"] == self.custom_user_attributes["email"])

    def test_custom_user_deserialize(self):
        self.serializer = CustomUserSerializer(data=self.custom_user_attributes)
        self.assertTrue(self.serializer.is_valid())
        self.user = self.serializer.save()
        self.assertTrue(CustomUser.objects.filter(username=self.custom_user_attributes["username"]).exists())
        self.assertTrue(len(self.serializer.errors.keys()) == 0)

    def test_duplicate_user_invalidation(self):
        CustomUser.objects.create(**self.custom_user_attributes)
        self.serializer = CustomUserSerializer(data=self.custom_user_attributes)
        self.assertFalse(self.serializer.is_valid())
        self.assertTrue("email" in self.serializer.errors and "username" in self.serializer.errors)
        
    def test_user_field_invalidation(self):
        self.serializer = CustomUserSerializer(data=self.invalid_user_attributes)
        self.assertFalse(self.serializer.is_valid())
        self.assertTrue("email" in self.serializer.errors and "password" in self.serializer.errors)

class CustomUserViewTest(TestCase):

    def setUp(self):
        self.factory = APIRequestFactory()
        self.custom_user_attributes = {
            "username": "sar5498",
            "email": "sar5498@gmail.com",
            "password": "longenoughpassword"
        }

        self.invalid_user_attributes = {
            "username": "anewusername",
            "email": "invalidemail",
            "password": "short"
        }

        self.login_credentials = {
            "username": "sar5498",
            "password": "longenoughpassword"
        }

    def test_user_create(self):
        request = self.factory.post('/api/user/create/', json.dumps(self.custom_user_attributes), content_type='application/json')
        view = CustomUserCreate.as_view()
        response = view(request)
        response.render()
        self.assertEqual(json.loads(response.content), json.loads('{"username": "sar5498", "email": "sar5498@gmail.com"}'))
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_user_create_404(self):
        request = self.factory.post('/api/user/create/', json.dumps(self.invalid_user_attributes), content_type='application/json')
        view = CustomUserCreate.as_view()
        response = view(request)
        response.render()
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)        

    def test_obtain_token(self):
        self.serializer = CustomUserSerializer(data=self.custom_user_attributes)
        self.assertTrue(self.serializer.is_valid())
        self.user = self.serializer.save()        
        request = self.factory.post('/api/token/obtain/', json.dumps(self.login_credentials), content_type='application/json')
        view = ObtainTokenPairWithColorView.as_view()
        response = view(request)
        response.render()
        response_dict = json.loads(response.content)
        self.assertTrue("refresh" in response_dict and "access" in response_dict)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    

    # user views
        # can create a user w/ correct information
        # returns 404 if given incorrect information
        # can obtain a token with correct information
        # gets rejected with wrong information
        # refresh works if token is not expired
        # fails if token is blacklisted
        # can get user info if authed as that user
        # do not get user info if not authenticated