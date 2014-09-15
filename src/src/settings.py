import os
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
SECRET_KEY = 'q0vhy^d=ue%ojn08e$ljp+qrffc2i94n(l0v2z@t)*=n$c$^)v'

DEBUG = True
TEMPLATE_DEBUG = True
ALLOWED_HOSTS = []

INSTALLED_APPS = (
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',

    ## external apps
    'south',
    'django_assets',
)

INTERNAL_APPS = (
    'main',
)

INSTALLED_APPS += INTERNAL_APPS

MIDDLEWARE_CLASSES = (
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
)

ROOT_URLCONF = 'src.urls'

WSGI_APPLICATION = 'src.wsgi.application'

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': os.path.join(BASE_DIR, 'db.sqlite3'),
    }
}

LANGUAGE_CODE = 'en-us'
TIME_ZONE = 'UTC'
USE_I18N = True
USE_L10N = True
USE_TZ = True

STATIC_URL = '/static/'
STATIC_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../static/'))
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '../media/'))

ASSETS_DEBUG = True
ASSETS_AUTO_BUILD = True
ASSETS_CACHE = False
ASSETS_ROOT = STATIC_ROOT
ASSETS_URL = STATIC_URL
ASSETS_DEFAULT_CSS_FILTERS = 'cssrewrite, cssmin'
ASSETS_DEFAULT_JS_FILTERS = 'rjsmin'

from src.services.GenerateModelService import GenerateModelService
process_models = GenerateModelService()