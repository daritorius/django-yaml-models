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


class AjaxUpdateView(View):
    forms = dict(users=CreateUserForm, rooms=CreateRoomForm)

    def post(self, request):
        objects = []
        post_request = copy(request.POST)
        if post_request.get('type') == 'users':
            users_list = json.loads(post_request['users'])
            for key, value in users_list.iteritems():
                item = Users.objects.get(id=int(key))
                form = self.forms[post_request.get('type')](value['data'])
                if form.is_valid():
                    for title, new_data in value['data'].iteritems():
                        if 'date' in title:
                            new_data = datetime.datetime.strptime(new_data, '%Y-%m-%d')
                        setattr(item, title, new_data)
                    item.save()
                    objects.append(item)
                else:
                    result = {'errors': [(k, [v[0], form.fields[k].label]) for k, v in form.errors.items()]}
                    return http.HttpResponse(json.dumps(result), content_type='application/json')
        else:
            rooms_list = json.loads(post_request['rooms'])
            for key, value in rooms_list.iteritems():
                item = Rooms.objects.get(id=int(key))
                form = self.forms[post_request.get('type')](value['data'])
                if form.is_valid():
                    for title, new_data in value['data'].iteritems():
                        setattr(item, title, new_data)
                    item.save()
                    objects.append(item)
                else:
                    result = {'errors': [(k, [v[0], form.fields[k].label]) for k, v in form.errors.items()]}
                    return http.HttpResponse(json.dumps(result), content_type='application/json')
        result = {'objects': serializers.serialize("json", objects)}
        return http.HttpResponse(json.dumps(result), content_type='application/json')

    def get(self, rquest):
        result = {'errors': u'Use only POST requests'}
        return http.HttpResponse(json.dumps(result), content_type='application/json')