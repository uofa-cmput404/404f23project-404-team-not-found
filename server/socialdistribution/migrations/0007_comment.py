# Generated by Django 4.1.4 on 2023-11-08 21:39

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0006_inboxitem_inbox_follower_follow_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('comment', models.TextField(max_length=255)),
                ('published', models.DateTimeField(auto_now_add=True)),
                ('contentType', models.TextField(default='text/plain', editable=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.author')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.post')),
            ],
        ),
    ]
