let fig0,fig1,fig2;
let img0,img1,img2;
let fc0,fc1,fc2;
for (let i = 0;i<3;i++){
    window['fig'+i] = document.createElement("figure");
    window['img'+i] = document.createElement("img");
    window['fc'+i] = document.createElement("p");
}
let figStatus = 'Trending';
const API = "eay92FzWBaLBIs7IWm14L2zy2fczrCAc";
document.addEventListener("DOMContentLoaded", init);
function init() {
trend();
document.querySelector('.btnTrendDiv button').addEventListener("click",trend);
function trend(){ 
    url = 'https://api.giphy.com/v1/gifs/trending?api_key=' + API + '&limit=3';
    for (let i = 0;i<3;i++){
        fetch(url)
        .then(response => response.json())
        .then(content => {
            figStatus='Trending';
            if(i===0) {    
                console.log(content.data);
                console.log("META", content.meta);
            }
            window['img'+i].src = content.data[i].images.downsized.url;
            window['img'+i].alt = content.data[i].title;
            window['fc'+i].textContent = content.data[i].title;
            window['fig'+i].appendChild(window['img'+i]);
            window['fig'+i].appendChild(window['fc'+i]);
            let out = document.querySelector("main .out");
            out.insertAdjacentElement("afterbegin", window['fig'+i]);
            document.querySelector('form div input[id=search]').value = "";
            document.querySelector('#gif-h').innerHTML = "Trending";
            document.querySelector('.search-status').innerHTML = '';
        })
    }
}

document.querySelector('form input[type=submit]').addEventListener("click", ev => {
    ev.preventDefault();
    if(document.querySelector('form div input[id=search]').value !== ""){    
        let url = 'https://api.giphy.com/v1/gifs/search?api_key=' + API + '&limit=3&q=';
        let str = document.querySelector('form div input[id=search]').value.trim();
        url = url.concat(str);
        console.log(url);
        let searchStatus = 'ALL-FOUND'
        for (let i = 0;i<3;i++){
            var foundGifs = 0;
            fetch(url)
            .then(response => response.json())
            .then(content => {
                //  data, pagination, meta
                if (content.data[i]){
                    figStatus = 'Search';
                    if(i===0){
                        console.log(content.data);
                        console.log("META", content.meta);
                    }
                    window['img'+i].src = content.data[i].images.downsized.url;
                    window['img'+i].alt = content.data[i].title;
                    window['fc'+i].textContent = content.data[i].title;
                    window['fig'+i].appendChild(window['img'+i]);
                    window['fig'+i].appendChild(window['fc'+i]);
                    let out = document.querySelector("main .out");
                    out.insertAdjacentElement("afterbegin", window['fig'+i]);
                    document.querySelector('form div input[id=search]').value = "";
                    foundGifs++;
                    document.querySelector('#gif-h').innerHTML = "Found " + foundGifs + " gifs";
            } else {
                document.querySelector('.search-status').innerHTML = "found" + foundGifs + " gifs";
                searchStatus = 'NOT-FOUND';
            }
            })
            .catch(err => {
                console.error(err);
            });
        }
        if (searchStatus !== 'ALL-FOUND') {
            trend();
        } else {
            document.querySelector('.search-status').innerHTML = '';
        }
    }
});
}