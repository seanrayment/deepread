# Generated by Django 2.2.10 on 2020-05-03 05:11

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('documents', '0003_auto_20200503_0228'),
    ]

    operations = [
        migrations.AlterUniqueTogether(
            name='highlight',
            unique_together={('document', 'start_char', 'end_char')},
        ),
    ]
