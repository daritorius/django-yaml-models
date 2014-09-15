# -*- coding: utf-8 -*-
from django.utils.translation import ugettext_lazy as _
from django_assets import Bundle, register

test_main_css = Bundle(
    'css/jquery-ui.min.css',
    'css/base.css',
    filters='cssmin',
    output='css/test_main_css.css'
)
register('test_main_all_css', test_main_css)

test_main_js = Bundle(
    'js/jquery-1.11.1.min.js',
    'js/jquery-ui.min.js',
    'js/base.js',
    filters='jsmin',
    output='js/test_main_js.js'
)
register('test_main_all_js', test_main_js)