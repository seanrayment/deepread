# Generated by Django 3.0.4 on 2020-04-23 03:06

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0003_document_font_family'),
    ]

    operations = [
        migrations.AlterField(
            model_name='document',
            name='font_family',
            field=models.CharField(choices=[('georgia', 'georgia'), ('serif', 'serif'), ('times_new_roman', 'times_new_roman'), ('arial', 'arial'), ('helvetica', 'helvetica'), ('sans_serif', 'sans_serif'), ('tahoma', 'tahoma')], default='georgia', max_length=24),
        ),
    ]
