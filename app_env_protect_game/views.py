from django.shortcuts import render
import requests
import xmltodict
# from .forms import newsWords
from django.http import HttpResponse
import json

def tutorial(request):
    return render(request, "app_env_protect_game/tutorial.html")

# Reference: https://qiita.com/KMD/items/872d8f4eed5d6ebf5df1
def retriveNews(news_words):
    language = 'hl=en&gl=EN&ceid=EN:en'
    number_of_news = 3

    # Fetch news data
    news_response = requests.get(f'https://news.google.com/rss/search?q={news_words}&{language}')
    news_json = xmltodict.parse(news_response.text)

    news_items = []
    import random
    news_len = len(news_json['rss']['channel']['item'])
    news_to_be_displayed = random.sample(range(news_len), number_of_news)
    
    id_counter = 1
    for item in news_to_be_displayed:
        news = news_json['rss']['channel']['item'][item]
        
        NewsId = f"news{id_counter}"
        id_counter += 1
        Id_to_be_added = {"id": NewsId}

        news.update(Id_to_be_added)

        news_items.append(news)

    # Create a new JSON object with the extracted items
    news_data = {'items': news_items}

    return news_data

def index(request):
    return render(request, "app_env_protect_game/index.html")

def resultRedirect(request):
    return render(request, 'app_env_protect_game/Result.html')

def getNewsFeed(request):
    if request.method == "POST":
        request_body = json.loads(request.body)
        body = request_body.get("result")
        gametime = request_body.get("gametime")

        if body == "poverty":
            news_poverty = retriveNews("economic poverty")
            return render(request, "app_env_protect_game/News.html", {"news_poverty": news_poverty, "gametime": gametime})
        elif body == "environment":
            news_environment = retriveNews("environment problems")
            return render(request, "app_env_protect_game/News.html", {"news_environment": news_environment, "gametime": gametime})
        else:
            return HttpResponse("Invalid request body")
    else:
        return HttpResponse("No POST request made")
    
def newsPage(request):
    poverty_news = retriveNews("economic poverty")
    env_news = retriveNews("environment problems")
    return render(request, "app_env_protect_game/News.html", {"poverty_news": poverty_news, "env_news": env_news})
    # poverty_and_enviroment_news = retriveNews("economic poverty and environment problems")
    # return render(request, "app_env_protect_game/News.html", {"poverty_and_enviroment_news": poverty_and_enviroment_news})
