from django.shortcuts import render
import requests
import xmltodict
# from .forms import newsWords
from django.http import HttpResponse
import json

# Reference: https://qiita.com/KMD/items/872d8f4eed5d6ebf5df1
def retriveNews(news_words):
    language = 'hl=ja&gl=JP&ceid=JP:ja'
    number_of_news = 20

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
        
        NewsId = f"point{id_counter}"
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
        print("Received POST request with body:", body)

        if body == "poverty":
            news_poverty = retriveNews("貧困")
            return render(request, "app_env_protect_game/News.html", {"news_poverty": news_poverty})
        elif body == "environment":
            news_environment = retriveNews("環境問題")
            return render(request, "app_env_protect_game/News.html", {"news_environment": news_environment})
        else:
            return HttpResponse("Invalid request body")
    else:
        return HttpResponse("No POST request made")


'''HTMLのフォームから入力された文字列を受け取り、それを元にGoogleニュースから情報を取得する
def resultRedirect(request):
    return render(request, 'app_env_protect_game/Result.html')

def getNewsFeed(request):
    if request.method == "POST":
        request_body = json.loads(request.body)
        body = request_body.get("result")
        print("Received POST request with body:", body)

        if body == "poverty":
            news_poverty = retriveNews("貧困")
            return render(request, "app_env_protect_game/News.html", {"news_poverty": news_poverty})
        elif body == "environment":
            news_environment = retriveNews("環境問題")
            return render(request, "app_env_protect_game/News.html", {"news_environment": news_environment})
        else:
            return HttpResponse("Invalid request body")
    else:
        return HttpResponse("No POST request made")


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

'''
if __name__ == "__main__":
    language = 'hl=ja&gl=JP&ceid=JP:ja'
    # Fetch news data
    news_response = requests.get(f'https://news.google.com/rss/search?q={"環境"}&{language}')
    news_json = xmltodict.parse(news_response.text)




'''


