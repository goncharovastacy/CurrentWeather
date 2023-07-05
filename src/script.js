'use strict';

const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const weatherContainer = document.querySelector('.weather-container');
const divError = document.querySelector('.error');
const weatherError = document.querySelector('.error__message');
const buttonDelete = document.getElementById('delete');
divError.hidden = true;
weatherContainer.hidden = true;
buttonDelete.hidden = true;
searchInput.value = '';

function getWeatherInfo(city) {
  let key = 'f62d1df9160e470ab1992002232506';
  fetch(`https://api.weatherapi.com/v1/current.json?key=${key}&q=${city}&aqi=no`)
    .then(res => {
      if (!res.ok) {
        throw new Error('Sorry, something went wrong. Please try again.');
      }
      return res.json()
    })
    .then(obj => {
      addDescription(obj);
      saveData(city);
      weatherError.innerText = '';
      weatherContainer.hidden = false;
      buttonDelete.hidden = false;
    })
    // вывод ошибки
    .catch(error => {
      divError.hidden = false;
      weatherError.innerText = error.message;
    })
}

function saveData(city) {
  localStorage.setItem(city, true);
}

for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  getWeatherInfo(key);
}

function addDescription(object) {
  const newDiv = document.createElement('div');
  newDiv.classList.add('weather');
  newDiv.innerHTML = `<h4>${object.location.name}</h4>
  <p>${object.current.condition.text}</p>
  <img src="${object.current.condition.icon}" alt="Weather icon" />
  <p class="weather__temperature">${Math.round(object.current.temp_c)} °C</p>
  <div class="weather__description">
      <div class="weather__text">
      <p>UV Index: ${object.current.uv}</p>
      <p>Humidity: ${object.current.humidity}%</p>
      </div>
      <div class="weather__text">
      <p>Wind: ${Math.round(object.current.wind_kph / 3.6)} m/s</p>
      <p>Feels like: ${Math.round(object.current.feelslike_c)} °C</p>
      </div>
  </div>`;
  weatherContainer.prepend(newDiv);
}

function clearInput() {
  searchInput.value = '';
}

searchButton.addEventListener('click', () => {
  getWeatherInfo(searchInput.value)
  clearInput();
});

buttonDelete.addEventListener('click', () => {
  localStorage.clear();
  weatherContainer.innerHTML = '';
  weatherContainer.hidden = true;
  buttonDelete.hidden = true;});