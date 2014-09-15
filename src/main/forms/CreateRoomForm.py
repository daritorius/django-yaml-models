# -*- coding: utf-8 -*-
from django.forms import ModelForm
from django.utils.translation import ugettext_lazy as _
from main.models import Rooms


class CreateRoomForm(ModelForm):
    class Meta:
        model = Rooms