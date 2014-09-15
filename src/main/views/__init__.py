# -*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _
from main.views.AjaxCreateView import AjaxCreateView
from main.views.AjaxLoadInformationView import AjaxLoadInformationView
from main.views.AjaxUpdateView import AjaxUpdateView
from main.views.IndexView import IndexView


ajax_update_view = AjaxUpdateView.as_view()
ajax_create_view = AjaxCreateView.as_view()
ajax_load_view = AjaxLoadInformationView.as_view()
index_view = IndexView.as_view()