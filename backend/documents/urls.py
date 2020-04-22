from django.urls import path
from .views import DocumentView, DocumentListView

urlpatterns = [
    path('documents/<int:pk>/', DocumentView.as_view(), name='get_document'),
    path('documents/', DocumentListView.as_view(), name="get_documents"),
]