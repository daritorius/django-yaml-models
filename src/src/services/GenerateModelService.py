# -*- coding: utf-8 -*-
import os
import yaml
from django.db import models
from django.conf import settings


class GenerateModelService(object):
    models_data_file = 'models.yaml'
    models_container = 'models.py'
    models_module = 'models'
    types = dict(char=models.CharField, int=models.IntegerField, date=models.DateField)
    models_data = None

    def __init__(self):
        for app in settings.INTERNAL_APPS:
            self._init_app_models_file(app)
            self._process_models_data(app)
            self._build_models(app)

    def _init_app_models_file(self, app):
        if not os.path.isfile(__import__(app).__path__[0] + '/' + self.models_container):
            models_file = open(__import__(app).__path__[0] + '/' + self.models_container, 'w+')
            models_file.close()

    def _process_models_data(self, app):
        with open(__import__(app).__path__[0] + '/' + self.models_data_file, 'r') as f:
            self.models_data = yaml.load(f)

    def _build_models(self, app):
        for key in self.models_data.keys():
            models_module = getattr(__import__('%s.%s' % (app, self.models_module)), self.models_module)
            if not getattr(models_module, key.title(), None):
                setattr(models_module, key.title(), self.__generate_model('%s.%s' % (app, self.models_module), key))

    def __generate_model(self, app, title):
        return type(title.title(), (models.Model,), self.__generate_fields(app, title))

    @staticmethod
    def __get_default_attrs(app):
        attrs = {'__module__': app}
        return attrs

    def __generate_fields(self, app, title):
        data = self.models_data[title]
        attrs = self.__get_default_attrs(app)
        for field in data['fields']:
            attrs[field['id']] = self.types[field['type']](verbose_name=field['title'],
                                                           max_length=255, blank=True, null=True)
        return attrs