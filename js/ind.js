
// ↓Variables↓↓↓↓↓↓↓↓↓
let limit                               = 3;    /** Максимальное кол-во гиф картинок( увеличиваеться если надо показать больше)*/
const API                               = "eay92FzWBaLBIs7IWm14L2zy2fczrCAc";   /** АПИ ключ*/
let searchStatus                        = "Trending";   /** Статус показа гифок Трендовые или Поиск*/
let giphyNum                            = 0;    /** количество созданных блоков для гифок*/
let newGiphyNum                         = 0;    /** количество гифок на странице*/
let url                                 ='';    /** ссылка на гиф изображение*/
const notAvailableImg                   ='https://media1.tenor.com/images/d754ce7f085b77dc0c629724c43ca1f8/tenor.gif?itemid=11367234';  /** ссылка на гифку которая говорит: "Что-то пошло не так".*/
let toRepair                            =[];    /** все i, такие что fig+i( например fig1) имеет изображение недоступной гифки( выше)*/
// ↑Variables↑↑↑↑↑↑↑↑↑

// ------------------------------------------------------------------------------------------------------------- \\

// INIT function↓↓↓↓↓↓↓↓↓
document.querySelector('#gif-h').innerHTML = 'Wait';
document.addEventListener('DOMContentLoaded', init);

function init() {
    createFig();
    setTimeout(()=> callSearch('Trending'), 200);
    document.querySelector('#gif-h').innerHTML = 'Trending';
}
// INIT function↑↑↑↑↑↑↑↑↑

function createFig(){   //Функция которая создаёт для гифок: блок, текст и саму гифку. Также обьединяет их и добавляет на страницу.
    for (let i = giphyNum; i<limit ; i++){  /** Для того что-бы создать не больше и не меньше чем нам надо*/
        window['fig'+i]                 = document.createElement("figure");     /** создаём елементы*/
        window['fig'+i]                 .setAttribute('class','display:flex;');
        window['img'+i]                 = document.createElement("img");
        window['fc'+i]                  = document.createElement("p");
        window['a'+i]                   = document.createElement('a');
        window['a'+i]                   .setAttribute('target','_blank');
        giphyNum++;
        window['figStatus'+i]           = 'created';
        if (window['figStatus'+i]==='created') {
            (i) => {    /** функция построения елементов в единый блок и добавление блока на страницу*/
                fetch() 
                    .then(response => response.json())
                    .then(content => {
                        window['img'+i]             .src = notAvailableImg;
                        window['img'+i]             .alt = 'Gif which say us: "This content is not available, something went wrong!"';
                        window['fc'+i]              .textContent = 'This content is not available, something went wrong!';
                        window['fig'+i]             .appendChild(window['img'+i]);
                        window['fig'+i]             .appendChild(window['fc'+i]);
                        window['a'+i]               .appendChild(window['fig'+i]);
                        let out                     = document.querySelector("main .out");
                        out                         .insertAdjacentElement("afterbegin", window['a'+i]);
                        window['figStatus'+i]       = 'builded';
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }   
}   

function callSearch(status,param){  /** ОСНОВНАЯ ФУНКЦИЯ САЙТА( заменяет изображение на нужные учитывая переменную searchStatus)*/
    if (param) {} else { 
        param = newGiphyNum;
    }
    if (status !== searchStatus) {
        param = 0;
        newGiphyNum = 0;
        searchStatus = status;
    }
    if (status === "Trending") {
        url = 'https://api.giphy.com/v1/gifs/trending?api_key=' + API + '&limit=' + limit;
        for (let i = param; i<limit; i++){
            fetch(url)
            .then(response => response.json())
            .then(content => {
                //  data, pagination, meta
                if (content.data[i]){
                    if(i===param){
                        console.log(content.data);
                        console.log("META", content.meta);
                    }
                    window['img'+i].src             = content.data[i].images.downsized.url;
                    window['img'+i].alt             = content.data[i].title;
                    window['fc'+i]                  .textContent = content.data[i].title;
                    window['a'+i]                   .setAttribute('href',content.data[i].bitly_url);
                    window['fig'+i]                 .appendChild(window['img'+i]);
                    window['fig'+i]                 .appendChild(window['fc'+i]);  
                    window['a'+i]                   .appendChild(window['fig'+i]); 
                    let out                         = document.querySelector("main .out");
                    out                             .insertAdjacentElement("afterbegin", window['a'+i]);
                    window['figStatus'+i]           = 'changed';
                    if (window['img'+i].src===notAvailableImg){
                        toRepair.push(i);
                    }
                    newGiphyNum++;
                } 
            })
            .catch(err => {
                console.error(err);
            }); 
        }
        if (toRepair[0]){
            repairGif();
        }
    } else { 
        request = status;
        url = 'https://api.giphy.com/v1/gifs/search?api_key=' + API + '&limit=' + limit + "&q=" + request;
        for (let i = param; i<limit; i++){
            fetch(url)
            .then(response => response.json())
            .then(content => {
                //  data, pagination, meta
                if (content.data[i]){
                    if(i===param){
                        console.log(content.data);
                        console.log("META", content.meta);
                    }
                    window['img'+i].src             = content.data[i].images.downsized.url;
                    window['img'+i].alt             = content.data[i].title;
                    window['fc'+i]                  .textContent = content.data[i].title;
                    window['a'+i]                   .setAttribute('href',content.data[i].bitly_url);
                    window['fig'+i]                 .appendChild(window['img'+i]);
                    window['fig'+i]                 .appendChild(window['fc'+i]);  
                    window['a'+i]                   .appendChild(window['fig'+i]); 
                    let out                         = document.querySelector("main .out");
                    out                             .insertAdjacentElement("afterbegin", window['a'+i]);
                    window['figStatus'+i]           = 'changed';

                    newGiphyNum++;
                } 
            })
            .catch(err => {
                console.error(err);
            }); 
        }
    }
    giphyNum = limit;
}   


document.querySelector('.repair').addEventListener('click', function(){
    reCreateFig();
    setTimeout(()=> createFig(),200);
    callSearch(searchStatus, 0);
});


document.querySelector('.btnTrendDiv button').addEventListener('click', function(){
    reCreateFig();
    setTimeout(()=> createFig(),200);
    callSearch('Trending',0);
});

document.querySelector('.showMore').addEventListener('click', showMore);

function showMore() {
    giphyNum = limit;
    limit+=3;
    createFig();
    callSearch(searchStatus);
    document.querySelector('#gif-h').innerHTML = 'Trending';
}

document.querySelector('.search-form input[type=submit]').addEventListener('click', (elem)=>{
    elem.preventDefault();
    if (document.querySelector('.search-form #search').value === '') {
        callSearch(searchStatus, 0);
    } else {
        reCreateFig();
        setTimeout(()=> createFig(),200);
        callSearch(document.querySelector('.search-form #search').value);
    }
});

function reCreateFig() {
    for (let i = 0; i<newGiphyNum ; i++) {
        window['fc'+i].remove();
        window['img'+i].remove();
        window['fig'+i].remove();
        window['a'+i].remove();
    }
    limit = 3;
    newGiphyNum=0;
    for (let i = 0; i<limit ; i++){  /** Для того что-бы создать не больше и не меньше чем нам надо*/
        window['fig'+i]                 = document.createElement("figure");     /** создаём елементы*/
        window['fig'+i]                 .setAttribute('class','display:flex;');
        window['img'+i]                 = document.createElement("img");
        window['fc'+i]                  = document.createElement("p");
        window['a'+i]                   = document.createElement('a');
        window['a'+i]                   .setAttribute('target','_blank');
        window['figStatus'+i]           = 'created';
        giphyNum++;
        if (window['figStatus'+i]==='created') {
            (i) => {    /** функция построения елементов в единый блок и добавление блока на страницу*/
                fetch() 
                    .then(response => response.json())
                    .then(content => {
                        window['img'+i]             .src = notAvailableImg;
                        window['img'+i]             .alt = 'Gif which say us: "This content is not available, something went wrong!"';
                        window['fc'+i]              .textContent = 'This content is not available, something went wrong!';
                        window['fig'+i]             .appendChild(window['img'+i]);
                        window['fig'+i]             .appendChild(window['fc'+i]);
                        window['a'+i]               .appendChild(window['fig'+i]);
                        let out                     = document.querySelector("main .out");
                        out                         .insertAdjacentElement("afterbegin", window['a'+i]);
                        window['figStatus'+i]       = 'builded';
                    })
                    .catch(err => {
                        console.error(err);
                    });
            }
        }
    }   
}   