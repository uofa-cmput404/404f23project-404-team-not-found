# Generated by Django 4.1.4 on 2023-11-09 23:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0007_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='comment',
            name='type',
            field=models.TextField(default='comment', editable=False),
        ),
    ]
