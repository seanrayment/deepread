from django.db import models
from authentication.models import CustomUser
from django.core.exceptions import ValidationError
from django.core.validators import MaxValueValidator, MinValueValidator

def validate_rgb_hex(value):
    try:
        if len(value) != 6:
            raise ValidationError("color must be a 6 digit hex string")
        int(value, 16)
    except ValueError:
        raise ValidationError("{v} is not a valid rgb hex string".format(v=value))


class Document(models.Model):
    GEORGIA = 'Georgia'
    SERIF = 'serif'
    TIMES_NEW_ROMAN = 'Times New Roman'
    ARIAL = 'Arial'
    HELVETICA = 'Helvetica'
    SANS_SERIF = 'sans-serif'
    TAHOMA = 'Tahoma'
    FONTS = [
        (GEORGIA, GEORGIA),
        (SERIF, SERIF),
        (TIMES_NEW_ROMAN, TIMES_NEW_ROMAN),
        (ARIAL, ARIAL),
        (HELVETICA, HELVETICA),
        (SANS_SERIF, SANS_SERIF),
        (TAHOMA, TAHOMA),
    ]

    line_height = models.FloatField(default=1.0, validators=[MinValueValidator(0.5), MaxValueValidator(5.0)])
    font_size = models.IntegerField(default=14)
    char_width = models.IntegerField(default=80)
    color = models.CharField(max_length=6, default='000000', validators=[validate_rgb_hex])
    font_family = models.CharField(max_length=24, choices=FONTS, default=GEORGIA)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    num_chars = models.IntegerField(default=0)
    contents = models.TextField(blank=True)
    title = models.TextField(blank=False, default="My new document")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def save(self, *args, **kwargs):
        self.num_chars = len(self.contents)
        super(Document, self).save(*args, **kwargs)

    def __str__(self):
        return self.title