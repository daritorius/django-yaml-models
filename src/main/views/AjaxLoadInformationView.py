# -*- coding: utf-8 -*-
import json
from django import http
from django.utils.translation import ugettext_lazy as _
from django.views.generic import View
from main.models import Users, Rooms
from django.core import serializers


class AjaxLoadInformationView(View):

    def get(self, request):
        objects = serializers.serialize("json", Users.objects.all()) if request.GET.get('type', None) == 'users' else \
            serializers.serialize("json", Rooms.objects.all())
        result = {'objects': objects}
        return http.HttpResponse(json.dumps(result), content_type='application/json')