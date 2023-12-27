from django import forms

class newsWords(forms.Form):
    news_words = forms.CharField(label="News search words", max_length=100)