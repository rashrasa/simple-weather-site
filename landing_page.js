var lastUpdate = Date.now();
const intervalSeconds = 5;

var locationObject;
var geoLocation = "";
var latitude = 40.7128; //default (NYC)
var longitude = -74.0060; //default (NYC)
var cityName = "New York City, NY";

//temp in C, descriptor (sunny,partly cloudy, etc.), chance of precipitation
var threeDayForecast = [[-999,"",0.5],[-999,"",0.5],[-999,"",0.5]];

//this function is executed on page load
function loadAll(){
    requestLocationPermissions();
    loadLocation();
    loadDate();
    document.getElementById('the_button').innerHTML='Click to update time (once every '+intervalSeconds+' seconds)';
}

//will be used to change relevant elements to display location
function loadLocation(pos){
    latitude = pos.coords.latitude
    longitude = pos.coords.longitude
    document.getElementById("coords").innerHTML = latitude+" "+longitude;
    document.getElementById('tabName').innerHTML=cityName;
}

//allows one update every "interval" seconds
function loadDate(){
    if(Date.now()-lastUpdate>=(intervalSeconds*1000)){
        document.getElementById('current').innerHTML=Date();
        lastUpdate=Date.now();
    }
    else{
        document.getElementById('current').innerHTML=new Date(lastUpdate);
    }
}

function requestLocationPermissions(){
    if(navigator.geolocation){
        navigator.geolocation.getCurrentPosition(loadLocation)
    }
    else{

    }
}

function getIntervalSeconds(){
    return intervalSeconds;
}