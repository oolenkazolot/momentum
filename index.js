import playList from './playList.js';
import translation from './translation.js';
import selfEsteem from './selfEsteem.js';
import Links from './links.js';

console.log(selfEsteem);
//в init передаётся объект с настройками
Links.init({
  mainContainer: '.my-links', // селектор куда будет добавляться блок links
  mainClass: 'my-links',
});

// элемент, внутри которого выводится время

const timeElement = document.querySelector('.time');
// элемент, внутри которого выводится дата
const dateElement = document.querySelector('.date');

// элемент, внутри которого выводится текст приветствия
const greetingsElement = document.querySelector('.greeting');

// элемент, внутри которого вводится имя пользователя
const userName = document.querySelector('.name');

// находим элемент body

const body = document.querySelector('body');

// глобальная переменная, которая содержит рандомное число для слайдера

let randomNumSlide = getRandomNum(1, 20);

// глобальная переменная, которая содержит рандомное число для цитат

let randomNumQuote = getRandomNum(0, 9);

//(переменные, названия которых начинаются с is, называются флагами. Флаг может принимать только два значения: true или false)
// С помощью флагов проверяем наличие или отсутствие чего-либо. В данном случае проверяем проигрывание в данный момент звука.
//Когда мы только открываем страницу, звука нет. Поэтому переменную isPlay создаём с значением false:

let isPlay = false;

// глобальная переменная, значение 0, так как вначале проигрывания воспроизводится первый трек

let playNum = 0;

// нашли элемент для отображения города

const city = document.querySelector('.city');

// нашли элемент для отображения иконки погоды

const weatherIcon = document.querySelector('.weather-icon');

// нашли элемент для отображения температуры

const temperature = document.querySelector('.temperature');

// нашли элемент для описания погоды

const weatherDescription = document.querySelector('.weather-description');

// нашли элемент для отображения скорости ветра в м/с

const wind = document.querySelector('.wind');

// нашли элемент для отображения относительной влажности воздуха в %

const humidity = document.querySelector('.humidity');

// нашли элемент для отображения ошибки, если неправильно введен город

const weatherError = document.querySelector('.weather-error');

// нашли элемент для отображения цитаты

const quote = document.querySelector('.quote');

// нашли элемент для отображения автора цитаты

const author = document.querySelector('.author');

// нашли кнопку обновления цитаты

const changeQuote = document.querySelector('.change-quote');

// Перевод приложения на два языка (en/ru)

// объект в котором, хранятся настройки приложения
const state = {
  language: 'ru',
  sourceBackground: 'gitHub',
  tags: '',
  blocks: ['time', 'date', 'greeting', 'quote', 'weather', 'audio', 'todolist'],
};

// запись в state значения из localStrogane по ключам 'Language', 'SourceBackground', 'Tags'

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

// элемент выбора языка приложения
const selectLanguage = document.getElementById('language');
// при изменении состояния блока выбора языка (т.е. изменении языка) запускается функция
// changeLanguage
selectLanguage.addEventListener('change', changeLanguage);

// функция, которая при изменении языка в объекте state меняет значение language: на значение value элемента где произошло изменение
function changeLanguage() {
  state.language = selectLanguage.value;
  city.value = getCityValueLocalStorage();
  getTimeOfDay(); // запускаются функции для обновления языка
  showPlaceholders();
  showDate();
  getWeather();
  getQuote();
  setSettingsBlocksLocalStorage(); // сохраняет отмеченные чекбоксы в localstorage
  addHiddenBlocksItem();
  showApplicationSettings();
  addLanguageOptions();
}
// НАСТРОЙКИ ПРИЛОЖЕНИЯ
//находим элементы кнопка открытия настроек, блок настроек, кнопка закрытия блока настроек
const settingsOpenButton = document.querySelector('.settings__btn');
const settingsCloseButton = document.querySelector('.settings__close');

//функция, для открытия настроек приложения
function openSettings() {
  const settingsElement = document.querySelector('.settings');
  settingsElement.classList.toggle('settings--open');
}

//при клике на кнопку открытия настроек приложения добавляется класс для появления блока настроек
settingsOpenButton.addEventListener('click', openSettings);

//при клике на кнопку закрытия настроек приложения добавляется класс для скрытия блока настроек
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
  // создаём массив для списка отмеченных чекбоксов из localStorage
  let valueHiddenBlocks = [];
  //проверяем если такой ключ в localStorage, если есть,  значение ключа  переводим из строки в массив и записываем в массив
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
    //проверяем совпадает ли значение ключа из  localStorage с value каждого input, если совпадает то добавляем input атрибут 'checked' со значением true
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

//функция, которая получает значение value элементa из блока hidden-blocks, у которого есть атрибут checked (т.е. нажат чекбокс для скрытия блока). Значение value это и есть имя класса, которому мы добавляем ещё один класс hidden для скрытия блока

function hidesBlocks(e) {
  const value = e.target.value;
  const block = document.querySelector('.' + value);
  block.classList.toggle('hidden');
}

// функция для скрытия блоков, которые после перезагрузки страницы
function hidesBlockslist(valueHiddenBlocks) {
  //перебераем массив элементов списка отмеченных чекбоксов из localStorage
  for (let i = 0; i < valueHiddenBlocks.length; i++) {
    // создаём переменную, для хранения селектора по значению элемента localStorage
    const block = document.querySelector('.' + valueHiddenBlocks[i]);
    // данному элементу добавляем класс для скрытия блока
    block.classList.add('hidden');
  }
}

// перед перезагрузкой или закрытием страницы (событие beforeunload) данные нужно сохранить

function setSettingsBlocksLocalStorage() {
  //массив для хранения элементов с отмеченным чекбоксом
  const arr = [];
  //находим все элементы с классом custom-checkbox
  const checkboxList = document.querySelectorAll('.custom-checkbox');
  //перебераем все элементы checkboxList,если элемент имеет атрибут checked, мы его записываем в массив arr
  for (let i = 0; i < checkboxList.length; i++) {
    if (checkboxList[i].checked) {
      arr.push(checkboxList[i].value);
    }
  }
  //записываем в localStorage ключ hiddenBlocks со значением массива arr (элементы с отмеченным чекбоксом), при этом  arr зписываем в localStorage в виде строки (массив arr переделываем в строку с помощью JSON.stringify(arr))
  localStorage.setItem('hiddenBlocks', JSON.stringify(arr));
}
window.addEventListener('beforeunload', setSettingsBlocksLocalStorage);

//функция, которая добавляет класс .settings__tags--open блоку .settings__tags, если источником получения фонового изображения выбран API (для того, чтобы появилось поле для ввода тегов, для которых API будет присылать изображения)

function showSettingsTags(show) {
  const settingsTags = document.querySelector('.settings__tags');
  if (show) {
    settingsTags.classList.add('settings__tags--open');
  } else {
    settingsTags.classList.remove('settings__tags--open');
  }
}

// находим элемент input, где вводятся тег/теги для которых API будет присылать изображения
const settingsTagsInput = document.querySelector('.settings__tags-input');
// когда в input введут тег/теги для которых API будет присылать изображения, запустится функция
settingsTagsInput.addEventListener('change', switchSourceBackground);

// *****ФУНКЦИИ*****

//  функция, которая будет выводить текущее время внутри указанного элемента

const showTime = () => {
  const date = new Date();
  timeElement.textContent = date.toLocaleTimeString(translation[state.language].locale);

  //обновление времени каждую секунду (функция запускается заново через каждую секунду)
  showDate();
  getTimeOfDay();
  setTimeout(showTime, 1000);
};
showTime();

//  функция, которая будет показывать текущую дату внутри указанного элемента
function showDate() {
  // дата отображается в зависимости от локали (язык и формат даты, также в переменной options (которая передается как параметр) указано, что отображать в дате и в каком формате словами либо цифрами)
  const date = new Date();
  let options = { weekday: 'long', month: 'long', day: 'numeric' };
  const currentDate = date.toLocaleDateString(translation[state.language].locale, options);
  dateElement.textContent = currentDate;
}

//  функция, которая будет выводить текст приветствия в зависимости от времени суток
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

//функция, которая показывает placeholder
function showPlaceholders() {
  const placeholderName = document.querySelector('.name');
  const placeholderCity = document.querySelector('.city');
  placeholderName.placeholder = translation[state.language].placeholderName;
  placeholderCity.placeholder = translation[state.language].placeholderCity;
}
showPlaceholders();

// перед перезагрузкой или закрытием страницы (событие beforeunload) данные нужно сохранить
// перед перезагрузкой или закрытием страницы  сохраняет введенное имя по ключу 'Username' в LocalStorage

function setUserNameLocalStorage() {
  localStorage.setItem('Username', userName.value);
}
window.addEventListener('beforeunload', setUserNameLocalStorage);

// перед загрузкой страницы (событие load) данные нужно восстановить и отобразить
// перед загрузкой восстанавливает и отображает введенное имя, сохранённое в LocalStorage по ключу 'Username'

function getUserNameLocalStorage() {
  if (localStorage.getItem('Username')) {
    userName.value = localStorage.getItem('Username');
  }
}
window.addEventListener('load', getUserNameLocalStorage);

// перед перезагрузкой или закрытием страницы (событие beforeunload) данные нужно сохранить
// перед перезагрузкой или закрытием страницы  сохраняет введенное имя по ключaм 'Language', 'SourceBackground', 'Tags' в LocalStorage

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
//реализована плавная смена изображений (в js создаём изображение, указываем его адрес, дожидаемся загрузки изображения для чего используем событие load и только потом указываем ссылку на изображение в качестве фона страницы)
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

//объект, который сохраняет данные tag(параметр по которым ищем фото) и  массив полученных изображений на основании параметра tag:
const flickrApiData = {
  tag: null,
  photos: [],
};

//функция для получение фонового изображения от Flickr API
async function setBgFlickrApi(tag) {
  // если параметр по которому искали изображения не равен тому, что ранее записали, надо опять делать запрос в API и получать новые изображения по новому параметру.
  if (flickrApiData.tag != tag) {
    flickrApiData.tag = tag;
    const url = `https://www.flickr.com/services/rest/?method=flickr.photos.search&api_key=5b0051e20f6373afe3882819061d7b0f&tags=${flickrApiData.tag}&extras=url_l&format=json&nojsoncallback=1`;
    const res = await fetch(url);
    const data = await res.json();
    flickrApiData.photos = data.photos.photo;
  }
  // если параметр по которому искали изображения  равен тому, что ранее записали, НЕ НАДО  делать запрос в API, а просто использовать те изображения, которые были записаны первоначально в массив photos
  const img = new Image();
  img.src = `${flickrApiData.photos[getRandomNum(0, flickrApiData.photos.length)].url_l}`;
  img.onload = () => {
    body.style.backgroundImage = `url(${img.src})`;
  };
}

//  элемент хтил для выбора источника получения фонового изображения
const selectSourceBackground = document.getElementById('source');
// при изменении состояния блока выбора источника получения фонового изображения  (т.е. откуда будем получать изображения: GitHub, Unsplash API, Flickr API) запускается функция
// changeSourceBackground
selectSourceBackground.addEventListener('change', changeSourceBackground);

// функция, которая при изменении источника получения фонового изображения  в объекте state меняет значение sourceBackground: на значение value элемента где произошло изменение
function changeSourceBackground() {
  state.sourceBackground = selectSourceBackground.value;
  switchSourceBackground();
}
//функция, которая переключает источник получения изображения в зависимости от того, что указано в state.sourceBackground (gitHub,unsplash-api,flickr-api);
//При выборе источника получения изображения, учитывается значение переменной tag (в которой хранится тег/ теги введенные в input (settingsTagsInput) - для которых API будет присылает фото). Если пользователь не указал теги в input, то по умолчанию tag формируется с учётом времени суток(morning, afternoon, evening, night).
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

//функция, которая перелистывает следующий слайд при клике на правую стрелку
// (увеличивает рандомное число на 1 пока результат не станет равным 20. Если результат сложения равен 20, следующему за ним числу присваиваете значение 1. Вызывает функцию setBgGitHub(), обновляющую фоновое изображение)

function getSlideNext() {
  const slideNext = randomNumSlide != 20 ? randomNumSlide + 1 : 1;
  randomNumSlide = slideNext;

  switchSourceBackground();
}

const arrowRight = document.querySelector('.slide-next');
arrowRight.addEventListener('click', getSlideNext);

//функция, которая перелистывает следующий слайд при клике на левую стрелку
//(уменьшает рандомное число на единицу, пока оно больше 1. Если результат вычитания равен 1, следующему за ним числу присваиваете значение 20. Вызывает функцию setBgGitHub(), обновляющую фоновое изображение)

function getSlidePrev() {
  const slidePrev = randomNumSlide != 1 ? randomNumSlide - 1 : 20;
  randomNumSlide = slidePrev;

  switchSourceBackground();
}

const arrowLeft = document.querySelector('.slide-prev ');
arrowLeft.addEventListener('click', getSlidePrev);

// Виджет погоды

// изначальное значение city.value
city.value = getCityValueLocalStorage();

//функция, которая отображает иконку погоды, температуру, описание погоды

async function getWeather() {
  //По ссылке отображается объект с погодой. Некоторые свойства данного объекта:
  // .weather[0].id - id иконки погоды //.weather[0].description - описание погоды
  // .main.temp- температура, data.wind.speed - скорость ветра в м/с, data.main.humidity - относительная влажность воздуха

  // если city.value равно нулю вывести ошибку

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

  // если data.cod равно 404 вывести ошибку
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

// на input city вешаем обработчик события 'change' - изменение элемента, при наступлении события запускает функцию getWeather

city.addEventListener('change', getWeather);

// функция, которая очищает контент блока weather (используем когда введен неверный город или вообще ничего не введено в city)

function clearsValuesWeather() {
  weatherIcon.className = '';
  temperature.textContent = ``;
  weatherDescription.textContent = ``;
  wind.textContent = ``;
  humidity.textContent = ``;
}

// перед перезагрузкой или закрытием страницы (событие beforeunload) данные нужно сохранить
// перед перезагрузкой или закрытием страницы  сохраняет введенный  город по ключу 'City' в LocalStorage

function setCityValueLocalStorageCity() {
  localStorage.setItem('city', city.value);
}
window.addEventListener('beforeunload', setCityValueLocalStorageCity);

// перед загрузкой восстанавливает и отображает введенный город, сохранённый в LocalStorage по ключу 'city' если город не введен, то выводит Минск

function getCityValueLocalStorage() {
  const city = localStorage.getItem('city');
  return city ? city : translation[state.language].cityDefault;
}

// Виджет цитата дня

//функция, которая загружает цитату и её автора

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
//находим элемент - кнопку, которая должна отключать громкость
const volumeButton = document.querySelector('.volume__button');
// флаг включен звук или нет, если true включен, если false, то выключен
let isVolume = true;
// переменная, в которой будет хранится текущее значение текущее значение value (т.е какая была громкость до нажатия на отключить звук)
let presentValue = 0;
//вешаем обработчик события на кнопку, по клику устанавливает значение volumeSound.value равным нулю, что бы громкости не было (громкость от 0 до 1) и запускаем функцию handleInputChange(e)
volumeButton.addEventListener('click', () => {
  //если isVolume true, значит звук включен и его нужно отключить
  if (isVolume) {
    // добавляем класс элементу, чтобы при выключенном звуке, значок звука зачеркивался (прописано в СSS в этом классе, который добавляем)
    volumeButton.classList.add('volume__button--disable');
    // сохранили текущее значение громкости в переменную  presentValue
    presentValue = volumeSound.value;
    // установили значение  volumeSound.value = 0, чтобы когда начнет работать функция в конце, value  станет равным нулю, звук отключится (т.к. audio.volume = +val, а valye уже 0!!!;)
    volumeSound.value = 0;
    //меняем значение флага на false, т.к. звук уже отключили, значит  isVolume = false
    isVolume = false;
  } else {
    //если isVolume false, значит звук выключен и его нужно включить
    // добавляем класс элементу, чтобы при включенном звуке, значок звука уже не был зачеркнут
    volumeButton.classList.remove('volume__button--disable');
    // меняем значение value на текущее значение громкости, которое было до отключения звука (мы его сохранили перед отключением, выше, соотвественно звук появится, т.к. volumeSound.value уже не равно нулю, и когда функция   handleInputChange() запустится она уже будет знать, что value равно текущему значению)
    volumeSound.value = presentValue;
    //меняем значение флага на true, т.к. звук уже включен, значит  isVolume = true
    isVolume = true;
  }
  //функция, которая изменяет громкость и закрашивает input громкости
  handleInputChange();
});

volumeSound.addEventListener('input', handleInputChange);

// элемент отображения названия активной песни
const playerSongTitle = document.querySelector('.player-song-title');

function playAudio() {
  // если src не равно src следующей песне, тогда включи следующую песню. А если равны, то пусть остаётся тоже src играет та же песня, которая и играла

  // audio.src.replace(window.location.origin, '')// в audio.src. методом replace заменяем свойство origin на пустую строку, чтобы в audio.src осталось только то, что нам нужно для сравнения с playList[playNum].src (а именно в таком виде '/assets/sounds/HIM-The-Sacrament.mp3')

  if (audio.src.replace(window.location.origin + '/', '') != playList[playNum].src) {
    audio.src = playList[playNum].src;
  }

  progress.stopProgress();
  if (!isPlay) {
    isPlay = true;
    play.classList.add('pause');
    //задается класс для стилизации активного элемента
    playListContainer.children[playNum].classList.add('item-active');
    playListContainer.children[playNum].children[0].classList.add('pause');

    //задается класс для стилизации элемента отображения наименования песни
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

// объект для работы с прогресс-баром

const progress = {
  durationPlayerElement: document.querySelector('.duration-player'),
  //получаем хтмл элемент, отображающий текущее / общее время песни
  durationTimerElement: document.querySelector('.duration-timer'),
  //получаем хтмл элемент, отображающий прогресс проигрывания песни

  progressElement: document.querySelector('.duration-player__progress'),
  //переменная для хранения интервала
  interval: null,
  //функция, которая запускает интервал каждые 100ms вычисляется ширина progressElement
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
    // при клике на durationPlayerElement получаем ширину этого элемента
    const width = this.clientWidth;
    // при клике на durationPlayerElement получаем размер отступа курсора мыши по оси X
    const clickX = e.offsetX;
    // получаем длину песни в секундах (HTMLMediaElement.duration)
    const duration = audio.duration;
    // задаем текущее время песни
    audio.currentTime = (clickX / width) * duration;
  },
  //функция, которая запускает функцию при клике на durationPlayerElement
  init: function () {
    this.durationPlayerElement.addEventListener('click', this.setProgress);
  },
};
progress.init();
