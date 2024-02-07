const weather = document.querySelector(".weather-report");
const news = document.querySelector(".news-articles");
const img = document.querySelectorAll("img");
const spr = document.querySelectorAll(".swiper-slide")
const fullNews = document.querySelector(".related-news");
async function getweather(){
    let data = await fetch("https://api.openweathermap.org/data/2.5/weather?q=London,uk&APPID=a64bc1cd0aee1aeeda6f831e942c371f",{
        method:"GET"
    }).then((res)=>res.json()).then((json)=>{return json});
    console.log(data);
    
    let temp = document.createElement("h2")
    let city = document.createElement("h2");
    let wtr = document.createElement("h2");
    let icon = document.createElement("img")
    
    wtr.innerText = data.weather[0].description;
    city.innerText = data.name;
    temp.innerText = data.main.temp;
   
    weather.appendChild(temp);
    weather.appendChild(city);
    weather.appendChild(wtr);
   

  
}
async function getNews(){
    let data =await  fetch("http://127.0.0.1:3000/getNews",{
        method:"GET"
    }).then((res)=>
        res.json()
    ).then((json)=>json);
    
    const articles = news.querySelectorAll('article');
    console.log(data);
    fullNews.querySelector('p').innerHTML=data[0].Discription;
    console.log(articles);
    console.log(img);
    console.log(spr);
// Loop through each article and do something
        for (let i = 0; i < articles.length; i++) {

            const ankor = spr[i].querySelector("a");
            ankor.href = data[i].url;
      const article = articles[i];
    // Access elements within each article
             const a = article.querySelector('a');
             a.href = data[i].url;
             const title = a.querySelector('h3');
             
           
            
            img[i].src=data[i].urlToImage;
            console.log(title);
            title.innerText = data[i].title;
            
      
}
    console.log(data);
}
getweather();
getNews();
