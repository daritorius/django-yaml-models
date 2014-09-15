# -*- coding: utf-8 -*-
from django import forms
from django.forms import ModelForm
from django.utils.translation import ugettext_lazy as _
from main.models import Users


class CreateUserForm(ModelForm):
    class Meta:
        model = Users