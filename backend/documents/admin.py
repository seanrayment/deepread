from django.contrib import admin
from .models import Document

class DocumentAdmin(admin.ModelAdmin):
    model = Document

admin.site.register(Document, DocumentAdmin)
