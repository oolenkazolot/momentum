import playList from './playList.js';
import translation from './translation.js';

import Links from './links.js';

Links.init({
  mainContainer: '.my-links',
  mainClass: 'my-links',
});

const timeElement = document.querySelector('.time');

const dateElement = document.querySelector('.date');

const greetingsElement = document.querySelector('.greeting');

const userName = document.querySelector('.name');

const body = document.querySelector('body');

let randomNumSlide = getRandomNum(1, 20);

let randomNumQuote = getRandomNum(0, 9);
let isPlay = false;
let playNum = 0;

const city = document.querySelector('.city');
const weatherIcon = document.querySelector('.weather-icon');
const temperature = document.querySelector('.temperature');
const weatherDescription = document.querySelector('.weather-description');
const wind = document.querySelector('.wind');
const humidity = document.querySelector('.humidity');
const weatherError = document.querySelector('.weather-error');
const quote = document.querySelector('.quote');
const author = document.querySelector('.author');
const changeQuote = document.querySelector('.change-quote');

const state = {
  language: 'ru',
  sourceBackground: 'gitHub',
  tags: '',
  blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist'],
};

function getSettingsLocalStorage() {
  if (localStorage.getItem('language')) {
    state.language = localStorage.getItem('language');
  }
  if (localStorage.getItem('sourceBackground')) {
    state.sourceBackground = localStorage.getItem('sourceBackground');
  }
  if (localStorage.getItem('tags')) {
    state.tags = localStorage.getItem('tags');
  }
}
getSettingsLocalStorage();

const selectLanguage = document.getElementById('language');

selectLanguage.addEventListener('change', changeLanguage);

function changeLanguage() {
  state.language = selectLanguage.value;
  city.value = getCityValueLocalStorage();
  getTimeOfDay();
  showPlaceholders();
  showDate();
  getWeather();
  getQuote();
  setSettingsBlocksLocalStorage();
  addHiddenBlocksItem();
  showApplicationSettings();
  addLanguageOptions();
}
// НАСТРОЙКИ ПРИЛОЖЕНИЯ

const settingsOpenButton = document.querySelector('.settings__btn');
const settingsCloseButton = document.querySelector('.settings__close');

//функция, для открытия настроек приложения
function openSettings() {
  const settingsElement = document.querySelector('.settings');
  settingsElement.classList.toggle('settings--open');
}

settingsOpenButton.addEventListener('click', openSettings);
settingsCloseButton.addEventListener('click', openSettings);

//функция, которая добавляет элементы option (доступные параметры в раскрывающемся списке) в select (языки приложения для выбора) -- с переводами

function addLanguageOptions() {
  const selectLanguage = document.getElementById('language');
  selectLanguage.textContent = '';

  for (let key in translation) {
    let option = document.createElement('option');
    option.setAttribute('value', key);
    option.textContent = `${translation[state.language].language[key]}`;
    if (option.value === state.language) {
      option.setAttribute('selected', true);
    }
    selectLanguage.append(option);
  }
}

addLanguageOptions();

//функция, которая добавляет элементы option (доступные параметры в раскрывающемся списке) в select (источники получения фонового изображения)
function addSourceBackgroundOptions() {
  const selectSourseBackground = document.getElementById('source');
  const sourceBackground = translation[state.language].sourceBackground;
  for (let key in sourceBackground) {
    let option = document.createElement('option');
    option.setAttribute('value', key);
    option.textContent = sourceBackground[key];
    if (option.value === state.sourceBackground) {
      option.setAttribute('selected', true);
    }
    selectSourseBackground.append(option);
  }
  const settingsTagsInput = document.querySelector('.settings__tags-input');
  if (settingsTagsInput.value != state.tags) {
    settingsTagsInput.value = state.tags;
  }
}
addSourceBackgroundOptions();

// функция, которая показывает настройки приложения на выбранном языке (state.language)

function showApplicationSettings() {
  const labelLanguage = document.getElementById('label-language');
  labelLanguage.textContent = `${translation[state.language].applicationLanguage}`;
  const labelSourceBackground = document.getElementById('label-source-background');
  labelSourceBackground.textContent = `${translation[state.language].labelSourceBackground}`;
  const labelSettingsTags = document.querySelector('.settings__tags-label');
  labelSettingsTags.textContent = `${translation[state.language].labelSettingsTags}`;
}
showApplicationSettings();

//функция, которая создаёт в блокe hidden-blocks элемент p, и элементы hidden-blocks__item
// есть взаимосвязь с объектом translation для перевода

function addHiddenBlocksItem() {
  const valueInputCustomCheckbox = ['time', 'date', 'greeting-container', 'quotes', 'weather', 'player', 'my-links'];
  const hiddenBlocks = document.querySelector('.hidden-blocks');
  hiddenBlocks.textContent = '';
  const p = document.createElement('p');
  p.classList.add('hidden-blocks__title');
  p.textContent = `${translation[state.language].hiddenBlocksTitle}`;
  hiddenBlocks.append(p);
  let valueHiddenBlocks = [];
  if (localStorage.getItem('hiddenBlocks')) {
    valueHiddenBlocks = JSON.parse(localStorage.getItem('hiddenBlocks'));
  }

  for (let i = 0; i < valueInputCustomCheckbox.length; i++) {
    const div = document.createElement('div');
    div.classList.add('hidden-blocks__item');
    const input = document.createElement('input');
    input.classList.add('custom-checkbox');
    input.setAttribute('type', 'checkbox');
    input.setAttribute('value', valueInputCustomCheckbox[i]);
    input.setAttribute('id', valueInputCustomCheckbox[i]);
    input.addEventListener('change', hidesBlocks);

    if (valueHiddenBlocks.includes(valueInputCustomCheckbox[i])) {
      input.setAttribute('checked', true);
    }
    const label = document.createElement('label');
    const index = valueInputCustomCheckbox.indexOf(valueInputCustomCheckbox[i]);
    label.setAttribute('for', valueInputCustomCheckbox[i]);
    label.textContent = `${translation[state.language].settingHiddenBlocks[index]}`;
    div.append(input);
    div.append(label);
    hiddenBlocks.append(div);
  }
  hidesBlockslist(valueHiddenBlocks);
}

addHiddenBlocksItem();

function hidesBlocks(e) {
  const value = e.target.value;
  const block = document.querySelector('.' + value);
  block.classList.toggle('hidden');
}

function hidesBlockslist(valueHiddenBlocks) {
  for (let i = 0; i < valueHiddenBlocks.length; i++) {
    const block = document.querySelector('.' + valueHiddenBlocks[i]);

    block.classList.add('hidden');
  }
}

function setSettingsBlocksLocalStorage() {
  const arr = [];

  const checkboxList = document.querySelectorAll('.custom-checkbox');

  for (let i = 0; i < checkboxList.length; i++) {
    if (checkboxList[i].checked) {
      arr.push(checkboxList[i].value);
    }
  }

  localStorage.setItem('hiddenBlocks', JSON.stringify(arr));
}
window.addEventListener('beforeunload', setSettingsBlocksLocalStorage);

function showSettingsTags(show) {
  const settingsTags = document.querySelector('.settings__tags');
  if (show) {
    settingsTags.classList.add('settings__tags--open');
  } else {
    settingsTags.classList.remove('settings__tags--open');
  }
}

const settingsTagsInput = document.querySelector('.settings__tags-input');
settingsTagsInput.addEventListener('change', switchSourceBackground);

//  функция, которая будет выводить текущее время внутри указанного элемента

const showTime = () => {
  const date = new Date();
  timeElement.textContent = date.toLocaleTimeString(translation[state.language].locale);

  showDate();
  getTimeOfDay();
  setTimeout(showTime, 1000);
};
showTime();

function showDate() {
  const date = new Date();
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = date.toLocaleDateString(translation[state.language].locale, options);
  dateElement.textContent = currentDate;
}

function getTimeOfDay() {
  const greetingsText2 = ['morning', 'afternoon', 'evening', 'night'];
  const date = new Date();
  let hours = date.getHours();
  if (!hours) {
    hours = 24;
  }
  const index = Math.trunc(hours / 6) - 1;
  greetingsElement.textContent = translation[state.language].greeting[index];
  return greetingsText2[index];
}

function showPlaceholders() {
  const placeholderName = document.querySelector('.name');
  const placeholderCity = document.querySelector('.city');
  placeholderName.placeholder = translation[state.language].placeholderName;
  placeholderCity.placeholder = translation[state.language].placeholderCity;
}
showPlaceholders();

function setUserNameLocalStorage() {
  localStorage.setItem('Username', userName.value);
}
window.addEventListener('beforeunload', setUserNameLocalStorage);

function getUserNameLocalStorage() {
  if (localStorage.getItem('Username')) {
    userName.value = localStorage.getItem('Username');
  }
}
window.addEventListener('load', getUserNameLocalStorage);

function setSettingsLocalStorage() {
  localStorage.setItem('language', selectLanguage.value);
  localStorage.setItem('sourceBackground', selectSourceBackground.value);
  localStorage.setItem('tags', settingsTagsInput.value);
}
window.addEventListener('beforeunload', setSettingsLocalStorage);

// ***СЛАЙДЕР ИЗОБРАЖЕНИЙ***

// функция, которая возвращает рандомное число в указанном диапазоне, min и max включаются

function getRandomNum(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// функция, которая формирует ссылку для фонового изображения с учётом времени суток и случайного номера изображения (от 01 до 20). Изображения получаем из GitHub.

function setBgGitHub() {
  let timeOfDay = getTimeOfDay();
  let bgNum = (randomNumSlide + '').padStart(2, '0');
  const img = new Image();
  img.src = `https://raw.githubusercontent.com/oolenkazolot/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

//Получение фонового изображения от Unsplash API
async function setBgUnsplashApi(tag) {
  const url = `https://api.unsplash.com/photos/random?query=${tag}&client_id=2bQssv_L_1vMvUls1UkaiWGTPzvJQ90FhBiMWPK5l3o`;
  const res = await fetch(url);
  const data = await res.json();
  const img = new Image();
  img.src = `${data.urls.regular}`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

const flickrApiData = {
  tag: null,
  photos: [],
};

async function setBgFlickrApi(tag) {
  if (flickrApiData.tag != tag) {
    flickrApiData.tag = tag;
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=5b0051e20f6373afe3882819061d7b0f&tags=${flickrApiData.tag}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    flickrApiData.photos = data.photos.photo;
  }

  const img = new Image();
  img.src = `${flickrApiData.photos[getRandomNum(0, flickrApiData.photos.length)].url_l}`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

const selectSourceBackground = document.getElementById('source');

selectSourceBackground.addEventListener('change', changeSourceBackground);

function changeSourceBackground() {
  state.sourceBackground = selectSourceBackground.value;
  switchSourceBackground();
}

function switchSourceBackground() {
  let tag = getTimeOfDay();
  switch (state.sourceBackground) {
    case 'gitHub':
      setBgGitHub(tag);
      showSettingsTags(false);
      break;
    case 'unsplashApi':
      if (settingsTagsInput.value) {
        tag = settingsTagsInput.value;
      }
      setBgUnsplashApi(tag);
      showSettingsTags(true);
      break;
    case 'flickrApi':
      if (settingsTagsInput.value) {
        tag = settingsTagsInput.value;
      }
      setBgFlickrApi(tag);
      showSettingsTags(true);
      break;
  }
}
switchSourceBackground();

function getSlideNext() {
  const slideNext = randomNumSlide != 20 ? randomNumSlide + 1 : 1;
  randomNumSlide = slideNext;

  switchSourceBackground();
}

const arrowRight = document.querySelector('.slide-next');
arrowRight.addEventListener('click', getSlideNext);

function getSlidePrev() {
  const slidePrev = randomNumSlide != 1 ? randomNumSlide - 1 : 20;
  randomNumSlide = slidePrev;

  switchSourceBackground();
}

const arrowLeft = document.querySelector('.slide-prev ');
arrowLeft.addEventListener('click', getSlidePrev);

// Виджет погоды

city.value = getCityValueLocalStorage();

async function getWeather() {
  if (!city.value) {
    weatherError.textContent = `${translation[state.language].errorCityNotSpecified} '${city.value}'!`;
    clearsValuesWeather();
    return;
  }

  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city.value}&lang=${[state.language]}&appid=4132724d519183ea758aef3aaa95b169&units=metric`;

  let data;
  try {
    const res = await fetch(url);
    data = await res.json();
    weatherError.textContent = ``;
  } catch (e) {
    weatherError.textContent = `${translation[state.language].errorCityNotFound} '${city.value}'!`;
    return;
  }

  if (data.cod === '404') {
    weatherError.textContent = `${translation[state.language].errorCityNotFound} '${city.value}'!`;
    clearsValuesWeather();
    return;
  }
  weatherIcon.className = 'weather-icon owf';
  weatherIcon.classList.add(`owf-${data.weather[0].id}`);
  temperature.textContent = `${Math.round(data.main.temp)}°C`;
  weatherDescription.textContent = `${data.weather[0].description}`;
  wind.textContent = `${translation[state.language].characteristicWind} ${Math.round(data.wind.speed)} ${translation[state.language].speedMeasurement}`;
  humidity.textContent = `${translation[state.language].characteristicHumidity} ${Math.round(data.main.humidity)}%`;
}

getWeather();

city.addEventListener('change', getWeather);

function clearsValuesWeather() {
  weatherIcon.className = '';
  temperature.textContent = ``;
  weatherDescription.textContent = ``;
  wind.textContent = ``;
  humidity.textContent = ``;
}

function setCityValueLocalStorageCity() {
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setCityValueLocalStorageCity);

function getCityValueLocalStorage() {
  const city = localStorage.getItem('city');
  return city ? city : translation[state.language].cityDefault;
}

// Виджет цитата дня

async function getQuote() {
  const url = `quote.json`;
  let dataQuotes;
  try {
    const res = await fetch(url);
    dataQuotes = await res.json();
  } catch (e) {
    console.log(e);
    return;
  }
  randomNumQuote;
  const quoteObject = dataQuotes.quotes[state.language][randomNumQuote];
  quote.textContent = `${quoteObject.quote}`;
  author.textContent = `${quoteObject.author}`;
}

getQuote();

//функция, которая при клике на кнопку changeQuote переключает следующую цитату

function getQuoteNext() {
  randomNumQuote = getRandomNum(0, 9);
  getQuote();
}

// при клике на кнопку changeQuote запускается функция, которая переключает следующую цитату

changeQuote.addEventListener('click', getQuoteNext);

// Аудиоплеер

const audio = new Audio();
audio.volume = 0.5;
const play = document.querySelector('.play');
const playListContainer = document.querySelector('.play-list');
const volumeSound = document.querySelector('.volume__sound');

for (let i = 0; i < playList.length; i++) {
  const li = document.createElement('li');
  li.classList.add('play-item');
  const button = document.createElement('button');
  button.classList.add('play-song');
  button.addEventListener('click', () => {
    playSong(i);
  });
  li.append(button);
  li.append(playList[i].name);
  playListContainer.append(li);
}

// функция показывает наименования активной песни
function showNameActiveSong() {
  let activeSong = '';
  let activeSongElement = document.querySelector('.player-song-title');
  activeSong = document.querySelectorAll('.item-active');
  activeSongElement.textContent = activeSong[0].innerText;
}

function handleInputChange(e) {
  const min = volumeSound.min;
  const max = volumeSound.max;
  const val = volumeSound.value;
  volumeSound.style.backgroundSize = ((val - min) * 100) / (max - min) + '% 100%';
  audio.volume = +val;
}

const volumeButton = document.querySelector('.volume__button');

let isVolume = true;
let presentValue = 0;
volumeButton.addEventListener('click', () => {
  if (isVolume) {
    volumeButton.classList.add('volume__button--disable');
    presentValue = volumeSound.value;
    volumeSound.value = 0;
    isVolume = false;
  } else {
    volumeButton.classList.remove('volume__button--disable');
    volumeSound.value = presentValue;
    isVolume = true;
  }
  handleInputChange();
});

volumeSound.addEventListener('input', handleInputChange);

const playerSongTitle = document.querySelector('.player-song-title');

function playAudio() {
  if (audio.src.replace(window.location.origin + '/', '') != playList[playNum].src) {
    audio.src = playList[playNum].src;
  }

  progress.stopProgress();
  if (!isPlay) {
    isPlay = true;
    play.classList.add('pause');

    playListContainer.children[playNum].classList.add('item-active');
    playListContainer.children[playNum].children[0].classList.add('pause');

    playerSongTitle.classList.add('player-song-title--active');
    audio.play();
    progress.startProgress();
    showNameActiveSong();
  } else {
    playListContainer.children[playNum].children[0].classList.remove('pause');
    isPlay = false;
    play.classList.remove('pause');
    audio.pause();
  }
}

play.addEventListener('click', playAudio);

function playNext() {
  playListContainer.children[playNum].classList.remove('item-active');
  playListContainer.children[playNum].children[0].classList.remove('pause');
  playerSongTitle.classList.remove('player-song-title--active');
  playNum = playNum < playList.length - 1 ? playNum + 1 : 0;
  isPlay = false;
  playAudio();
}

const nextSong = document.querySelector('.play-next');
nextSong.addEventListener('click', playNext);

function playPrev() {
  playListContainer.children[playNum].classList.remove('item-active');
  playListContainer.children[playNum].children[0].classList.remove('pause');
  playerSongTitle.classList.remove('player-song-title--active');
  playNum = playNum > 0 ? playNum - 1 : playList.length - 1;
  isPlay = false;
  playAudio();
}

const prevSong = document.querySelector('.play-prev');
prevSong.addEventListener('click', playPrev);
audio.addEventListener('ended', playNext);

function playSong(i) {
  playListContainer.children[playNum].children[0].classList.remove('pause');
  if (i != playNum) {
    playListContainer.children[playNum].classList.remove('item-active');
    playerSongTitle.classList.remove('player-song-title--active');
  }
  if (playNum != i) {
    isPlay = false;
  }
  playNum = i;
  playAudio();
}

//включение песни при нажатии на пробел

document.body.onkeyup = function (e) {
  if (e.keyCode == 32) {
    playAudio();
  }
};

//прогресс бар

const progress = {
  durationPlayerElement: document.querySelector('.duration-player'),

  durationTimerElement: document.querySelector('.duration-timer'),

  progressElement: document.querySelector('.duration-player__progress'),

  interval: null,
  startProgress: function () {
    this.interval = setInterval(() => {
      this.progressElement.style.width = (audio.currentTime * 100) / audio.duration + '%';
      this.setTime();
    }, 100);
  },
  //функция записывает текущее / общее время песни
  setTime: function () {
    const allTimeSong = Math.floor(audio.duration / 60) + ':' + Math.floor(audio.duration % 60);
    let minutes = Math.floor(audio.currentTime / 60);
    let seconds = Math.floor(audio.currentTime % 60);
    if (seconds < 10) {
      seconds = '0' + seconds;
    }
    const currentTimeSong = minutes + ':' + seconds;
    this.durationTimerElement.textContent = currentTimeSong + ' / ' + allTimeSong;
  },
  //функция, которая останавливает интервал
  stopProgress: function () {
    if (this.interval) {
      clearInterval(this.interval);
    }
  },
  //функция, при клике на durationPlayerElement меняет текущее время воспроизведения трека
  setProgress: function (e) {
    const width = this.clientWidth;

    const clickX = e.offsetX;

    const duration = audio.duration;

    audio.currentTime = (clickX / width) * duration;
  },
  //функция, которая запускает функцию при клике на durationPlayerElement
  init: function () {
    this.durationPlayerElement.addEventListener('click', this.setProgress);
  },
};
progress.init();
