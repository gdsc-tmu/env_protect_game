from django.shortcuts import render

# if __name__ == "__main__":


# Create your views here.

def index(request):
    return render(request, "app_env_protect_game/index.html")


