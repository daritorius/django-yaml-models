# -*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _
from django.views.generic import TemplateView
from main.forms.CreateRoomForm import CreateRoomForm
from main.forms.CreateUserForm import CreateUserForm


class IndexView(TemplateView):
    template_name = 'includes/index.html'

    def get_context_data(self, **kwargs):
        context = super(self.__class__, self).get_context_data(**kwargs)
        context['form_user'] = CreateUserForm
        context['form_room'] = CreateRoomForm
        return context