# -*- coding: utf-8 -*-
from django.conf.urls import patterns, url, include
from django.utils.translation import ugettext_lazy as _
from main.views import index_view, ajax_load_view, ajax_create_view, ajax_update_view


urlpatterns = patterns('',
    url(r'^ajax/update/$', ajax_update_view, name='ajax_update_page'),
    url(r'^ajax/create/$', ajax_create_view, name='ajax_create_page'),
    url(r'^ajax/load/$', ajax_load_view, name='ajax_load_page'),
    url(r'^$', index_view, name='index_page'),
)