# Generated by Django 4.1.4 on 2023-11-17 14:18

from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('socialdistribution', '0008_comment_type'),
    ]

    operations = [
        migrations.CreateModel(
            name='Like',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('context', models.TextField(default='https://www.w3.org/ns/activitystreams', editable=False)),
                ('type', models.TextField(default='Like', editable=False)),
                ('author', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.author')),
                ('comment', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.comment')),
                ('post', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='socialdistribution.post')),
            ],
        ),
    ]