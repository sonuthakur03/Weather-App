const wrapper = document.querySelector('.wrapper'),
inputPart = wrapper.querySelector('.input-part'),
infoTxt = inputPart.querySelector('.info-txt'),
inputField = inputPart.querySelector('input'),
locationBtn = inputPart.querySelector('button');
wIcon = wrapper.querySelector('.weather-part img');
arrowBack = wrapper.querySelector('header i');


let api;


/* adding evntlistner when user hits a value and enter and calling function requestApi with city name*/
inputField.addEventListener('keyup', e => {
    if (e.key == 'Enter' && inputField.value !== '') {
        requestApi(inputField.value);
    }
})


/* taking location details and and calling onsucces and onerror */
locationBtn.addEventListener('click', ()=>{
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    }else{
        alert('your browser doesnt support geolocation');
    }
})



function onSuccess(location){
    const {latitude, longitude} = location.coords;
    api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apikey}`;
    fetchData();
}



function onError(error){
    infoTxt.innerText = error.message;
    infoTxt.classList.add('error');
}


/* defining pending part and making a request to api after calling fetchData func */

function requestApi(city){
    infoTxt.innerText = 'Getting weather details......';
    infoTxt.classList.add('pending');
    api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apikey}`;
    fetchData();
}


/* for when error occured when fetching */

function errorFetch(){
    infoTxt.innerText = 'No internet connection..';
    infoTxt.classList.replace('pending','error');
}


/* fetching data from api and passing it to weatherDetails function  */

function fetchData(){
    fetch(api).then(response =>       response.json()).then(result => weatherDetails(result)).catch((error) =>{
         errorFetch();
         });
}


/* taking response as info 
checking if error occured from api side
destructring from info
checking for id of weather and applying image on them
changing values of result interface

*/
 

function weatherDetails(info){
    infoTxt.classList.replace('pending','error');
    if (info.cod == '404') {
        infoTxt.innerText = `${inputField.value} is not a valid city`;
    }else{
       let city = info.name; 
       let country = info.sys.country;
       const {main, description, id} = info.weather[0];
       const {temp, feels_like , humidity} = info.main;
       
       if(id == 800) {
           wIcon.src = 'weather-app-icons/clear.svg';
       }else if (id >= 200 && id <= 232 ){
           wIcon.src = 'weather-app-icons/storm.svg';
       }else if(id >= 600 && id <= 622){
           wIcon.src = 'weather-app-icons/snow.svg';
       }else if (id >= 701 && id <= 781) {
           wIcon.src = 'weather-app-icons/haze.svg';
       }else if (id >= 801 && id <= 804){
           wIcon.src = 'weather-app-icons/cloud.svg';
       }else{
           wIcon.src = 'weather-app-icons/rain.svg';
       }
       
       wrapper.querySelector('.temp .numb').innerText = temp;
       wrapper.querySelector('.weather').innerText = description;
       wrapper.querySelector(' .location .cntry').innerText = `${city},${country}`;
       wrapper.querySelector('.details .numb-2').innerText = feels_like;
       wrapper.querySelector('.humidity .numb').innerText = humidity;
       
       
       
       infoTxt.classList.remove('pending','error');
       wrapper.classList.add('active');
    }
    console.log(info);
};


/* making arrowback work */

arrowBack.addEventListener('click', ()=>{
    wrapper.classList.remove('active');
    inputField.value = '';
});
