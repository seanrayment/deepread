# Generated by Django 3.0.4 on 2020-05-07 04:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0006_annotation'),
    ]

    operations = [
        migrations.AddField(
            model_name='document',
            name='dark_mode',
            field=models.BooleanField(default=False),
        ),
    ]
