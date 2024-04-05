const intervalSeconds = 5;
const sunsetTime = 20
const sunriseTime = 7

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

const weatherIDDict={
    sunny:        {name:"Sunny",         imageRef:"images/sunny.png"},
    partlyCloudy: {name:"Partly Cloudy", imageRef:"images/partlyCloudy.png"}, 
    overcast:     {name:"Overcast",      imageRef:"images/overcast.png"},
    raining:      {name:"Rain",          imageRef:"images/raining.png"}, 
    thunderstorm: {name:"Thunderstorm",  imageRef:"images/thunderstorm.png"}, 
    snowing:      {name:"Snowing",       imageRef:"images/snowing.png"},
    night:        {name:"Night",         imageRef:"images/night.png"}
}


//this function is executed on page load
function loadAll(){
    //requestLocationPermissions();
    loadLocation();
    loadDate();
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
    for(i = 0; i<hourData.length;i++){
        var date = new Date(Date.now()+(i)*1000*60*60);
        var hour = date.getHours();
        var isAM = hour<12? "AM":"PM";
        var displayHour = hour<12?hour:hour-12;
        if(hour==0)displayHour=12;
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
    var cityFields = document.getElementsByClassName("cityNameField")
    for(i=0; i<cityFields.length;i++){
        cityFields.item(i).innerHTML = cityName
    }
    
}

//file will contain information on when to fetch weather data from API, how often, last fetch time, results of last fetch,
//hard limits, etc.
function loadWeatherData(fileLocation){
    //weatherData = new Weather(fileLocation);
}