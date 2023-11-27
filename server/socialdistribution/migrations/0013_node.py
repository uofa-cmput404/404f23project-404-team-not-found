# Generated by Django 4.1.4 on 2023-11-24 00:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0012_alter_comment_author_alter_like_author'),
    ]

    operations = [
        migrations.CreateModel(
            name='Node',
            fields=[
                ('name', models.CharField(max_length=255, primary_key=True, serialize=False)),
                ('host', models.CharField(max_length=255)),
                ('username', models.CharField(max_length=255)),
                ('password', models.CharField(max_length=255)),
                ('is_active', models.BooleanField(default=True)),
                ('is_authenticated', models.BooleanField(default=True)),
            ],
        ),
    ]
