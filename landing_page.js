const intervalSeconds = 5;
const sunsetTime = 20
const sunriseTime = 7

var lastUpdate = Date.now();
var latitude = 40.7128; //default (NYC)
var longitude = -74.0060; //default (NYC)
var cityName = "New York City, NY";
var weatherData = ["sunny","sunny","sunny","sunny","sunny"];

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
    document.getElementById("test").innerHTML=weatherIDDict[weatherData[0]].name;
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
    for(i = 0; i<5;i++){
        var hour = new Date(Date.now()+(i)*1000*60*60).getHours();
        var isAM = hour<12? "AM":"PM";
        var displayHour = hour<12?hour:hour-12;
        if(hour==0)displayHour=12;

        var hourObj = (hour<sunsetTime && hour>sunriseTime)?weatherIDDict[weatherData[i]]:weatherIDDict["night"]

        document.getElementById("name0"+i).innerHTML = displayHour +" "+ isAM;
        document.getElementById("desc0"+i).innerHTML = hourObj.name;
        document.getElementById("icon0"+i).src = hourObj.imageRef;
        document.getElementById("high0"+i).innerHTML = 99 +" \u00B0C";
        document.getElementById("low0"+i).innerHTML = -99 +" \u00B0C";
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

class Weather{
    days=[];
    constructor(dataLocation){
        //parse JSON object from datalocation
        data=[];
        for(let i=0;i<data.length;i++){
            this.days.push(new WeatherDay(data[i]));
        }
    }
}

class WeatherDay{
    hourData=[];
    constructor(dayData){
        this.dayData = dayData;
        for(let i=0; i<this.dayData.length; i++){
            this.hourData.push(new WeatherHour(this.dayData[i]));
        }
    }
}

//holds the actual weather data
class WeatherHour{ 
    constructor(desk){ 
        this.weatherConditionID= "sunny";
        this.currentTemp= -99;
        this.highTemp= -99;
        this.lowTemp= -99;
        this._desc=desk;
        //desc= weatherIDDict.get(weatherConditionID).displayName;
    }
    desc(){
        return this._desc;
    }
}
