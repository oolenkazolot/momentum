const translation = {
  ru: {
    greeting: ['Доброе утро', 'Добрый день', 'Добрый вечер', 'Спокойной ночи'],
    placeholderCity: '[Введите город]',
    placeholderName: '[Введите имя]',
    characteristicWind: ['Скорость ветра:'],
    speedMeasurement: ['м/с'],
    characteristicHumidity: ['Влажность:'],
    cityDefault: ['Минск'],
    errorCityNotSpecified: ['Ошибка! Город не указан'],
    errorCityNotFound: ['Ошибка! Не найден город'],
    timeFormat: ['ru-Ru'],
    locale: ['ru-Ru'],
    language: { en: 'Английский', ru: 'Русский' },
    sourceBackground: { gitHub: 'GitHub', unsplashApi: 'Unsplash API', flickrApi: 'Flickr API' },
    applicationLanguage: ['Язык приложения:'],
    labelSourceBackground: ['Источник получения фонового изображения:'],
    labelSettingsTags: ['Укажите тег/теги, для которых API будет присылать изображения:'],
    hiddenBlocksTitle: ['Скрыть блоки:'],
    settingHiddenBlocks: ['Время', 'Дата', 'Приветствие', 'Цитата дня', 'Прогноз погоды', 'Аудиоплеер', 'Ссылки'],
  },

  en: {
    greeting: ['Good morning', 'Good afternoon', 'Good evening', 'Good nigh'],
    placeholderCity: '[Enter city]',
    placeholderName: '[Enter name]',
    characteristicWind: ['Wind speed:'],
    speedMeasurement: ['m/s'],
    characteristicHumidity: ['Humidity:'],
    cityDefault: ['Minsk'],
    errorCityNotSpecified: ['Error! Nothing to geocode for'],
    errorCityNotFound: ['Error! city not found for'],
    timeFormat: ['en-GB'],
    locale: ['en-GB'],
    applicationLanguage: ['Application language:'],
    language: { en: 'English', ru: 'Russian' },
    sourceBackground: { gitHub: 'GitHub', unsplashApi: 'Unsplash API', flickrApi: 'Flickr API' },
    labelSourceBackground: ['Background image source:'],
    labelSettingsTags: ['Specify the tag/tags for which the API will send images:'],
    hiddenBlocksTitle: ['Hide blocks:'],
    settingHiddenBlocks: ['Time', 'Date', 'Greeting', 'Quote of the Day', 'Weather', 'Audio Player', 'Links'],
  },
};
export default translation;
