from django.contrib import admin
from .models import Document, Highlight

class HighlightAdmin(admin.ModelAdmin):
    model = Highlight

class HighlightInline(admin.TabularInline):
    model = Highlight

class DocumentAdmin(admin.ModelAdmin):
    inlines = [
        HighlightInline,
    ]
    model = Document

    fields = (
        ('font_size', 'line_height', 'char_width'), 
        ('color', 'font_family'), 
        'owner', 
        'num_chars', 
        'title', 
        'contents')


admin.site.register(Document, DocumentAdmin)
admin.site.register(Highlight, HighlightAdmin)
