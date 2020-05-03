from django.urls import path
from .views import DocumentView, DocumentListView, HighlightListView, HighlightView

urlpatterns = [
    path('documents/<int:pk>/', DocumentView.as_view(), name='get_document'),
    path('documents/', DocumentListView.as_view(), name="get_documents"),
    path('highlights/<int:pk>/', HighlightListView.as_view(), name="get_highlights"),
    path('highlight/<int:pk>/', HighlightView.as_view(), name="get_highlight")
]