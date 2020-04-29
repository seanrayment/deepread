from .common import *
import os
import dj_database_url

DEBUG = False

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']

SIMPLE_JWT = {
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=10),
    'REFRESH_TOKEN_LIFETIME': timedelta(days=14),
    'ROTATE_REFRESH_TOKENS': True,
    'BLACKLIST_AFTER_ROTATION': True,
    'ALGORITHM': 'HS256',
    'SIGNING_KEY': SECRET_KEY,
    'VERIFYING_KEY': None,
    'AUTH_HEADER_TYPES': ('JWT',),
    'USER_ID_FIELD': 'id',
    'USER_ID_CLAIM': 'user_id',
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    'TOKEN_TYPE_CLAIM': 'token_type',
}

db_from_env = dj_database_url.config(conn_max_age=500)
DATABASES = {
    'default': db_from_env
}

ALLOWED_HOSTS = ['deepread-backend.herokuapp.com', 'deepread-backend.herokuapp.com/', '127.0.0.1']