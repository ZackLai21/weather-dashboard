var APIkey = '1d36a785f35f19c2e19f2e610bb17dc8';
var inputEl = document.querySelector("#cityInput");
var searchBtn = document.querySelector("#searchBtn");
var todayWeatherEl = document.querySelector("#today-weather")
var todayWeatherIconEl = document.querySelector("#current-icon");
var cityNameEl = document.querySelector("#city-name");
var temperatureEl = document.querySelector("#temperature");
var humidityEl = document.querySelector("#humidity");
var windEl = document.querySelector("#wind-speed");
var UVindexEl = document.querySelector("#UV-index");
var forecastHeaderEl = document.querySelector("#fiveday-header");
var forecastEl = document.querySelectorAll(".forecast");
var historyListEl = document.getElementById("history");
var searchHistory =[];

searchHistory = localStorage.getItem("search");
if (searchHistory) {
  searchHistory = JSON.parse(searchHistory);
} else {
  searchHistory = [];
}

function getWeather(cityName){
    var apiUrl = "https://api.openweathermap.org/data/2.5/weather?q="+cityName+"&units=imperial&appid="+APIkey;

    fetch(apiUrl)
      .then(function(response){
          if(response.ok){
              response.json().then(function(data){
                  todayWeatherEl.classList.remove("d-none");
                  console.log(data);
                  var currentDate = new Date(data.dt*1000);
                  console.log(currentDate);
                  var day = currentDate.getDate();
                  var month = currentDate.getMonth()+1;
                  var year = currentDate.getFullYear();
                  console.log(month);
                  cityNameEl.textContent=data.name+" (" + month + "/" + day + "/" + year + ") ";
                  var weatherIcon = data.weather[0].icon;
                  todayWeatherIconEl.setAttribute("src","https://openweathermap.org/img/wn/" + weatherIcon + "@2x.png");
                  todayWeatherIconEl.setAttribute("alt",data.weather[0].description);
                  temperatureEl.textContent="Temperature:"+data.main.temp+"°F";
                  windEl.textContent="Wind:"+ data.wind.speed + "MPH";
                  humidityEl.textContent="Humidity:"+data.main.humidity+"%";
                  
                  var lat = data.coord.lat;
                  var lon = data.coord.lon;
                  var UVindexUrl = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&appid="+APIkey;
                  fetch(UVindexUrl).then(function(response){
                      response.json().then(function(data){
                          console.log(data);
                          console.log(data.current.uvi);
                          displayUV(data.current.uvi);
                          getForecast(data);
                      })
                  })


              });
          }else{
              alert("Error: "+response.statusText);
          }
      });
};

function displayUV(value){
    var UVIndex = document.createElement("span");
    if(value<4){
        UVIndex.setAttribute("class","badge badge-success");
    }else if(value<8){
        UVIndex.setAttribute("class","badge badge-warning");
    }else{
        UVIndex.setAttribute("class","badge badge-danger");
    }
    UVIndex.textContent=value;
    UVindexEl.textContent="UV index:";
    UVindexEl.append(UVIndex);
}

function getForecast(city){
    forecastHeaderEl.classList.remove("d-none");
    for(i=0;i<5;i++){
        forecastEl[i].textContent="";
        var forecastDate = new Date(city.daily[i+1].dt*1000);
        var forecastDay = forecastDate.getDate();
        var forecastMonth = forecastDate.getMonth()+1;
        var forecastYear = forecastDate.getFullYear();
        var forecastDateEl = document.createElement("p");
        forecastDateEl.setAttribute("class","mt-3 mb-0");
        forecastDateEl.textContent = forecastMonth + "/" + forecastDay + "/" + forecastYear;
        forecastEl[i].append(forecastDateEl);

        var forecastImgEl = document.createElement("img");
        forecastImgEl.setAttribute("src","https://openweathermap.org/img/wn/" + city.daily[i+1].weather[0].icon + "@2x.png");
        forecastImgEl.setAttribute("alt",city.daily[i+1].weather[0].description);
        forecastEl[i].append(forecastImgEl);

        var forecastTemp = document.createElement("p");
        forecastTemp.textContent="Temp:"+city.daily[i+1].temp.day;
        forecastEl[i].append(forecastTemp);

        var forecastWind = document.createElement("p");
        forecastWind.textContent="Wind:"+city.daily[i+1].wind_speed+"MPH";
        forecastEl[i].append(forecastWind);

        var forecastHumidity = document.createElement("p");
        forecastHumidity.textContent="Humidity:"+city.daily[i+1].humidity+"%";
        forecastEl[i].append(forecastHumidity);

    }
}

searchBtn.addEventListener("click",function(event){
    event.preventDefault();
    var searchTerm = inputEl.value;
    if (searchTerm) {
        getWeather(searchTerm);
        inputEl.value="";
        addSearchToHistory(searchTerm);
      }
});

function displayButtons(){
    historyListEl.innerHTML="";
    for(var i=0;i<searchHistory.length;i++){
        var button = document.createElement("button");
        button.setAttribute("type","click");
        button.setAttribute("class","btn btn-outline-secondary btn-block btn-search");
        button.textContent=searchHistory[i];
      historyListEl.append(button);
    }
}


function addSearchToHistory(query) {
    searchHistory.push(query);
    localStorage.setItem("search", JSON.stringify(searchHistory));
    displayButtons();
  }


var historyBtn = document.querySelectorAll(".btn-search");
for(var i=0; i<historyBtn.length;i++){
    historyBtn[i].addEventListener("click",getWeather);
}

displayButtons();
  
  

