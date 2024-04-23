const intervalSeconds = 5;
const sunsetTime = 20
const sunriseTime = 7

var hostServer = "http://127.0.0.1:8080"
var loadCondition = 0;

var lastUpdate = Date.now();
var latitude = 40.7128; //default (NYC)
var longitude = -74.0060; //default (NYC)
var cityName = "New York City, NY";
var hourData = {
    length:5,
    hour0:{desc:"partlyCloudy", high:2, feels:-99},
    hour1:{desc:"sunny", high:19, feels:-29},
    hour2:{desc:"snowing", high:19, feels:-39},
    hour3:{desc:"overcast", high:71, feels:-49},
    hour4:{desc:"thunderstorm", high:500, feels:-59}
};

var dayData = {
    length:3,
    day0:{desc:"sunny", high:9, low:-9},
    day1:{desc:"raining", high:12, low:-900},
    day2:{desc:"thunderstorm", high:2, low:-5}
}
var cityList = [];

const weatherIDDict={
    sunny:        {name:"Sunny",         imageRef:"images/sunny.png"},
    partlyCloudy: {name:"Partly Cloudy", imageRef:"images/partlyCloudy.png"}, 
    overcast:     {name:"Overcast",      imageRef:"images/overcast.png"},
    raining:      {name:"Rain",          imageRef:"images/raining.png"}, 
    thunderstorm: {name:"Thunderstorm",  imageRef:"images/thunderstorm.png"}, 
    snowing:      {name:"Snowing",       imageRef:"images/snowing.png"},
    night:        {name:"Night",         imageRef:"images/night.png"}
}

//onLoad
function loadSite(){
    requestLocationPermissions();
    getSavedData();
}

//request data from host
function getSavedData(){
    switch(loadCondition){
        case 0:
            const cityDataRequest = new XMLHttpRequest();
            cityDataRequest.addEventListener("load", saveCityData);
            cityDataRequest.open("GET", hostServer+"/data/worldcities.json");
            cityDataRequest.send();
            
            break;
        case 1:
            const weatherDataRequest = new XMLHttpRequest();
            weatherDataRequest.addEventListener("load", saveWeatherData);
            weatherDataRequest.open("GET", hostServer+"/data/weather_data.json");
            weatherDataRequest.send();
            break;
        case 2:
            loadAll();
            break;
    }
    

    
    
}

function saveCityData(){
    cityList = JSON.parse(this.responseText);

    loadCondition++;
    getSavedData();
}

function saveWeatherData(){
    var response = JSON.parse(this.responseText);

    dayData = response["dayData"];
    hourData = response["hourData"];

    loadCondition++;
    getSavedData();
}

//this function is executed after data fetch
function loadAll(){
    loadLocation();
    loadDate();
    loadData();
    document.getElementById('title').innerHTML = cityList.keys["country"];
}

//allows one update every "interval" seconds
//TODO: Limit updates based on time data from a file
function loadDate(){
    if(Date.now()-lastUpdate>=(intervalSeconds*1000)){
        
        document.getElementById('current').innerHTML=Date().substring(0,21);
        lastUpdate=Date.now();
    }
    else{
        document.getElementById('current').innerHTML=Date(lastUpdate).substring(0,21);
    }
    
}
function loadData(){
    for(i = 0; i<hourData.length;i++){
        var date = new Date(Date.now()+(i)*1000*60*60);
        var hour = date.getHours();
        var isAM = hour<12? "AM":"PM";
        var displayHour = hour<12?hour:hour-12;
        if(hour==0||hour==12)displayHour=12;
        var data = hourData["hour"+i];
        var condObj = (hour<sunsetTime && hour>sunriseTime)?weatherIDDict[data.desc]:weatherIDDict["night"];

        document.getElementById("hourName0"+i).innerHTML = displayHour +" "+ isAM;
        document.getElementById("hourDesc0"+i).innerHTML = condObj.name;
        document.getElementById("hourIcon0"+i).src = condObj.imageRef;
        document.getElementById("hourHigh0"+i).innerHTML = data.high +" \u00B0C";
        document.getElementById("hourFeels0"+i).innerHTML = data.feels +" \u00B0C";
    }
    for(i = 0; i<dayData.length;i++){
        var date = new Date(Date.now()+(i)*1000*60*60*24);
        var day = date.getDate();
        var month = date.getMonth()+1;
        var displayDay = day+"/"+month;
        var data = dayData["day"+i];
        var condObj = weatherIDDict[data.desc];

        document.getElementById("dayName0"+i).innerHTML = displayDay;
        document.getElementById("dayDesc0"+i).innerHTML = condObj.name;
        document.getElementById("dayIcon0"+i).src = condObj.imageRef;
        document.getElementById("dayHigh0"+i).innerHTML = data.high +" \u00B0C";
        document.getElementById("dayLow0"+i).innerHTML = data.low +" \u00B0C";
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
        
    }
    
    document.getElementById("coords").innerHTML=latitude+" "+longitude;
    idx = closestIndex(cityList, "lat", "lng", latitude, longitude)
    cityName = cityList[idx]["city_ascii"] + ", " + cityList[idx]["country"]
    var cityFields = document.getElementsByClassName("cityNameField");
    for(i=0; i<cityFields.length;i++){
        cityFields.item(i).innerHTML = cityName;
    }
    
}

function setHour(index, descID, high, feels){
    hourData["hour"+index] = {desc:descID, high:high, feels:feels};
    loadData();
}
function setDay(index, descID, high, low){
    dayData["day"+index] = {desc:descID, high:high, low:low};
    loadData();
}

//Returns the index of dataList entry closest to (v0,v1)
//based on properties elmnt0 and elmnt1 (json key in dataList)

//O(n) and used on a large list, improve if possible
function closestIndex(dataList, elmnt0, elmnt1, v0, v1){
    var index = -1;
    var minDist = Infinity
    for(i=0; i<dataList.length; i++){
        dist = getDistance(v0,v1,dataList[i][elmnt0],dataList[i][elmnt1]);
        if(dist<minDist){
            minDist=dist;
            index=i;
        }
    }
    return index;
}
function getDistance(x0,y0,x1,y1){
    return Math.sqrt(Math.pow(x1-x0,2)+Math.pow(y1-y0,2));
}