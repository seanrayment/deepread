from django.db import models
from authentication.models import CustomUser

class Document(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    num_chars = models.IntegerField(default=0)
    is_deleted = models.BooleanField(default=False)
    contents = models.TextField(blank=True)
    title = models.TextField(blank=False, default="My new document")

    def save(self, *args, **kwargs):
        self.num_chars = len(self.contents)
        super(Document, self).save(*args, **kwargs)

    def __str__(self):
        return self.title