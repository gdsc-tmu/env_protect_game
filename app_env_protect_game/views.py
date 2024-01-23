from django.shortcuts import render
import requests
import xmltodict
from .forms import newsWords

def retriveNews(news_words):
    language = 'hl=ja&gl=JP&ceid=JP:ja'
    # Fetch news data
    news_response = requests.get(f'https://news.google.com/rss/search?q={news_words}&{language}')
    news_json = xmltodict.parse(news_response.text)

    news_items = []

    # Extract the items in the news JSON
    for item in news_json['rss']['channel']['item']:
        news_items.append(item)

    # Create a new JSON object with the extracted items
    news_data = {'items': news_items}

    return news_data

def index(request):
    news_environment = retriveNews("環境問題")
    news_poverty = retriveNews("貧困")
    return render(request, "app_env_protect_game/index.html", {"data_news_environment": news_environment, "data_news_poverty": news_poverty})

'''HTMLのフォームから入力された文字列を受け取り、それを元にGoogleニュースから情報を取得する
def newsAPItest(request):
    if request.method == "POST":
        form = newsWords(request.POST)

        if form.is_valid():
            news_words = form.cleaned_data["news_words"]

            # Fetch news data
            news_response = requests.get(f'https://news.google.com/rss/search?q={news_words}')
            news_json = xmltodict.parse(news_response.text)

            news_items = []

            # Extract the items in the news JSON
            for item in news_json['rss']['channel']['item']:
                news_items.append(item)

            # Create a new JSON object with the extracted items
            news_data = {'items': news_items}

            return render(request, 'app_env_protect_game/Result.html', {"data": news_data})  # Pass the dictionary directly
        
            # if a GET (or any other method) we'll create a blank form
    else:
        form = newsWords()

    return render(request, "app_env_protect_game/Search.html", {"form": form})
'''

from django.http import HttpResponse
import json

'''game.jsからPOSTリクエストを受け取ってResultを返すはずだが、上手くいっていない
def gameResult(request):
    if request.method == "POST":
        request_body = json.loads(request.body)
        body = request_body.get("result")
        if body == "Gameover":
            return render(request, "app_env_protect_game/Result.html")
        else:
            return HttpResponse("Invalid request body")
    else:
        return HttpResponse("No post made")

'''