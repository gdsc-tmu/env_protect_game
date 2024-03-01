from django.urls import path
from . import views
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView

app_name = "app_env_protect_game"

urlpatterns = [
        path('', views.index, name="index"),
        path('newsFeed/', views.getNewsFeed, name="getNewsFeed"),
        path('result/', views.resultRedirect, name="resultRedirect"),
        path('newsPage/', views.newsPage, name="newsPage"),
        path('tutorial/', views.tutorial, name="tutorial")

]

# Favicon setting is referred to https://ordinarycoders.com/blog/article/add-a-custom-favicon-to-your-django-web-app

