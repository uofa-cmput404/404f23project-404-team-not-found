from django.apps import AppConfig


class SocialdistributionConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'socialdistribution'

    def ready(self):
        import socialdistribution.signals.handlers
