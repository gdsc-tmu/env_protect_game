from django.urls import path
from . import views

app_name = "app_env_protect_game"

urlpatterns = [
        path('', views.index, name="index"),
        #path('newsAPItest/', views.newsAPItest, name="newsAPItest"),
        #path('gameResult/', views.gameResult, name="gameResult"),

]

