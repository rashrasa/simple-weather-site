var hostServer = "http://127.0.0.1/8080"
var loadCondition = 0;
const callAPI = true;

const apiKey = "347e7e88f30c4396acd160903241504";
const apiUrl = "http://api.weatherapi.com/v1";
var apiData = {}

var latitude = 40.7128; //default (NYC)
var longitude = -74.0060; //default (NYC)
var cityName = "New York City, NY";

var hourDataLength = 5;
var dayDataLength = 3;

//onLoad
function loadSite(){
    switch(loadCondition){
        case 0:
            requestLocationPermissions();
            break;
        case 1:
            requestAPIData();
            break;            
        case 2:
            loadData();
            break;
    }  
}

function requestLocationPermissions(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(loadLocation);
    }
    else{
        loadLocation();
    }
}

//will be used to change relevant elements to display location
function loadLocation(pos){
    try{
        latitude = pos.coords.latitude;
        longitude = pos.coords.longitude;
    }
    catch(error){
        latitude = "Error: Location not found."
    }
    loadCondition++;
    loadSite();
}

function requestAPIData(){
    if(callAPI){
        fetch(apiUrl+"/forecast.json?"+new URLSearchParams({
            key:apiKey,
            q:latitude+","+longitude,
            days:3
        }))
        .then(response  => response.json())
        .then(json => {apiData = json; console.log(json); loadCondition++; loadSite();})
    }
    else{
        const weatherReq = new XMLHttpRequest();
        weatherReq.addEventListener("load", function(){apiData = JSON.parse(this.responseText);
                                                    loadCondition++; loadSite();})
        weatherReq.open("GET", hostServer+"/data/sample_data.json");
        weatherReq.send()
    }
}

//loads data onto site
function loadData(){
    document.getElementById('current').innerHTML=apiData["location"]["localtime"];

    const today = apiData["forecast"]["forecastday"][0];
    const location = apiData["location"];
    const current = apiData["current"];
    

    //city name
    cityName = location["name"]+", "+location["country"];
    var cityFields = document.getElementsByClassName("cityNameField");
    for(i=0; i<cityFields.length;i++){
        cityFields.item(i).innerHTML = cityName;
    }

    //today data
    document.getElementById("windKPH").innerHTML= current["wind_kph"] + " km/h";
    document.getElementById("windDir").innerHTML= current["wind_degree"]+" deg "+current["wind_dir"];
    document.getElementById("precipMM").innerHTML= current["precip_mm"]+" mm";
    document.getElementById("humidity").innerHTML= current["humidity"]+"%";
    document.getElementById("cloudPerc").innerHTML= current["cloud"]+"%";
    document.getElementById("visKM").innerHTML= current["vis_km"]+ "km";
    document.getElementById("uv").innerHTML= current["uv"];
    document.getElementById("sunrise").innerHTML= today["astro"]["sunrise"];
    document.getElementById("sunset").innerHTML= today["astro"]["sunset"];
    document.getElementById("moonPhase").innerHTML= today["astro"]["moon_phase"];


    //hour data
    for(i = 0; i<hourDataLength;i++){
        var date = new Date(Date.now()+(i)*1000*60*60);
        var hour = date.getHours();
        var isAM = hour<12? "AM":"PM";
        var displayHour = hour<12?hour:hour-12;
        if(hour==0||hour==12)displayHour=12;
        var data = today["hour"][hour];
        var condition = data["condition"];

        document.getElementById("hourName0"+i).innerHTML = displayHour +" "+ isAM;
        document.getElementById("hourDesc0"+i).innerHTML = condition["text"];
        document.getElementById("hourIcon0"+i).src = condition["icon"];
        document.getElementById("hourHigh0"+i).innerHTML = data["temp_c"] +" \u00B0C";
        document.getElementById("hourFeels0"+i).innerHTML = data["feelslike_c"] +" \u00B0C";
    }

    //day data
    for(i = 0; i<dayDataLength;i++){
        var date = new Date(Date.now()+(i)*1000*60*60*24);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var displayDay = day+"/"+month;
        var data = apiData["forecast"]["forecastday"][i]["day"];
        var condition = data["condition"];

        document.getElementById("dayName0"+i).innerHTML = displayDay;
        document.getElementById("dayDesc0"+i).innerHTML = condition["text"];
        document.getElementById("dayIcon0"+i).src = condition["icon"];
        document.getElementById("dayHigh0"+i).innerHTML = data["maxtemp_c"] +" \u00B0C";
        document.getElementById("dayLow0"+i).innerHTML = data["mintemp_c"] +" \u00B0C";
    }
}

