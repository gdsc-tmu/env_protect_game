function loadNews() {
    const newsContents = localStorage.getItem("news");
    document.getElementById("news-feed").innerHTML = newsContents;
}


function rotation(){
    // https://stackoverflow.com/questions/35672631/how-can-i-make-a-circular-motion-in-javascript
    x = 100  // center
    y = 100   // center
    r = 300   // radius
    a = 0    // angle (from 0 to Math.PI * 2)

    function rotate(a) {        
        var px = x + r * Math.cos(a); // <-- that's the maths you need
        var py = y + r * Math.sin(a);
        for (let id = 1; id < 4; id++) {
            id = "${id}point";
            console.log(id)
            document.getElementById(id).style.left = px + "px";
            document.getElementById(id).style.top = py + "px";  
        }

    }

    setInterval(function() {
    a = (a + Math.PI / 360) % (Math.PI * 2);
    rotate(a);
    }, 30);


}

