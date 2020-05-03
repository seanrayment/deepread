from django.urls import path
from .views import DocumentView, DocumentListView, HighlightListView, HighlightView, AnnotationListView, AnnotationView

urlpatterns = [
    path('documents/<int:pk>/', DocumentView.as_view(), name='get_document'),
    path('documents/', DocumentListView.as_view(), name="get_documents"),
    path('highlights/<int:pk>/', HighlightListView.as_view(), name="get_highlights"),
    path('highlight/<int:pk>/', HighlightView.as_view(), name="get_highlight"),
    path('annotations/<int:pk>/', AnnotationListView.as_view(), name="get_annotations"),
    path('annotation/<int:pk>/', AnnotationView.as_view(), name="get_annotation")
]