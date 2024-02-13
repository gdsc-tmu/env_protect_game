function loadNews() {
    const newsContents = localStorage.getItem("news");
    document.getElementById("news-feed").innerHTML = newsContents;

}

url = ""
function screenShot() {
    html2canvas(document.getElementById("screenCapture"),{
        backgroundColor: null,
    }).then(canvas => {
        url = canvas.toDataURL()
    });

}

function showScreenShot() {
    //const screenShot = localStorage.getItem("screenshot");
    document.getElementById("capturedScreen").src = url;
}
