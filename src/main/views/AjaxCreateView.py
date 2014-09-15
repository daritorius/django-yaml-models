# -*- coding: utf-8 -*-
from copy import copy
import json
import datetime
from django import http
from django.utils.translation import ugettext_lazy as _
from django.views.generic import View
from main.forms.CreateRoomForm import CreateRoomForm
from main.forms.CreateUserForm import CreateUserForm
from main.models import Users, Rooms
from django.core import serializers


class AjaxCreateView(View):
    forms = dict(users=CreateUserForm, rooms=CreateRoomForm)

    def post(self, request):
        post_request = copy(request.POST)
        if post_request.get('type') == 'users':
            post_request['date_joined'] = datetime.datetime.strptime(post_request.get('date_joined'), '%Y-%m-%d')
        form = self.forms[post_request.get('type')](post_request)
        if form.is_valid():
            item = Users.objects.create(**form.cleaned_data) if request.POST.get('type') == 'users' else \
                Rooms.objects.create(**form.cleaned_data)
            result = {'objects': serializers.serialize("json", [item])}
            return http.HttpResponse(json.dumps(result), content_type='application/json')
        result = {'errors': [(k, [v[0], form.fields[k].label]) for k, v in form.errors.items()]}
        return http.HttpResponse(json.dumps(result), content_type='application/json')

    def get(self, rquest):
        result = {'errors': u'Use only POST requests'}
        return http.HttpResponse(json.dumps(result), content_type='application/json')