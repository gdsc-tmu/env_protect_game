from django.shortcuts import render
import requests
import xmltodict
from .forms import newsWords

# if __name__ == "__main__":

# Create your views here.

def index(request):
    return render(request, "app_env_protect_game/index.html")

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



