function loadNews() {
    const newsContents = localStorage.getItem("news");
    document.getElementById("news-feed").innerHTML = newsContents;
}


