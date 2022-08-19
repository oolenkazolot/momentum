const Links = {
  //задание начальных настроек
  init: function (setting) {
    //ключ для localStorge
    this.keyLocalStorage = 'links';
    //переменная, для хранения списка
    this.list = null;
    this.activeIndex = null;
    this.deleteBtn = null;
    //контейнер, куда будет добавляться блок links
    this.container = document.querySelector(setting.mainContainer);
    // переменная для хранения основного класса
    this.mainClass = setting.mainClass;
    //получаем form
    this.form = this.createForm();
    this.listBlock = null;
    // получаем wrapper из функции
    this.wrapper = this.addLinksBlock();
    //добавляем wrapper в container
    this.container.append(this.wrapper);

    //добавляем form во wrapper
    this.wrapper.append(this.form);
    this.addButton();
  },
  // функция, которая будет создавать кнопку, добавлять ей контент, класс и добавлять все это в хтмл
  addButton: function () {
    // кнопка для открытия  блока links
    const button = document.createElement('button');
    button.textContent = 'Links';
    button.classList.add(`${this.mainClass}__button`);
    button.addEventListener('click', this.toggleWrapper.bind(this));
    this.container.append(button);
  },

  // создаём блок для настроек ссылок (удаления и изменения)
  createSettingWrap: function (index) {
    //основной блок
    const settingWrap = document.createElement('div');
    settingWrap.classList.add(`${this.mainClass}__setting-wrap`);
    //кнопка для открытия настроек
    const btnSetting = document.createElement('span');
    btnSetting.classList.add(`${this.mainClass}__btn-setting`);
    const linksSetting = document.createElement('div');
    btnSetting.addEventListener('click', () => {
      this.switchSetting(linksSetting);
    });
    const iconDots = document.createElement('img');
    iconDots.classList.add(`${this.mainClass}__icon-dots`);
    iconDots.setAttribute('src', 'assets/svg/dots-icon.svg');
    iconDots.setAttribute('alt', 'dots-svg');
    btnSetting.append(iconDots);
    settingWrap.append(btnSetting);
    //блок с кнопками для удаления и изменения ссылок

    linksSetting.classList.add(`${this.mainClass}__setting`);
    // кнопки для удаления и изменения ссылок
    const settingBtnEdit = document.createElement('button');
    settingBtnEdit.classList.add(`${this.mainClass}__setting-btn-edit`);
    settingBtnEdit.classList.add('btn');
    settingBtnEdit.textContent = 'Edit';
    settingBtnEdit.addEventListener('click', this.editLink.bind(this, index));
    const settingBtnDelete = document.createElement('button');
    settingBtnDelete.classList.add(`${this.mainClass}__setting-btn-delete`);
    settingBtnDelete.classList.add('btn');
    settingBtnDelete.textContent = 'Delete';
    settingBtnDelete.addEventListener('click', this.deleteLink.bind(this, index));
    linksSetting.append(settingBtnEdit);
    linksSetting.append(settingBtnDelete);
    settingWrap.append(linksSetting);
    return settingWrap;
  },
  // создаётся элемент списка li и ссылка a
  createLi: function (element, index) {
    const li = document.createElement('li');
    li.classList.add(`${this.mainClass}__list-item`);
    const urlTitle = document.createElement('div');
    urlTitle.classList.add(`${this.mainClass}__url-title`);
    const img = document.createElement('img');
    img.classList.add(`${this.mainClass}__icon-favicon`);
    img.setAttribute('src', `https://www.google.com/s2/favicons?domain=${element.url}`);
    urlTitle.append(img);
    urlTitle.append(element.name);
    const a = document.createElement('a');
    a.classList.add(`${this.mainClass}__link`);
    a.setAttribute('href', element.url);
    a.setAttribute('title', element.url);
    a.setAttribute('target', '_blank');
    const settingWrap = this.createSettingWrap(index);
    a.append(urlTitle);
    li.append(a);
    li.append(settingWrap);
    return li;
  },

  // создаётся cписок (обновление списка)
  createList: function () {
    let links = [];
    if (localStorage.getItem(this.keyLocalStorage)) {
      //получаемый актуальный список ссылок из localStorage
      links = JSON.parse(localStorage.getItem(this.keyLocalStorage));
    }
    if (this.list) {
      //проверяем создан ли список, если да, то очищаем список , чтобы записать актуальный список ссылок из localStorage
      this.list.innerHTML = '';
    } else {
      // если списка не существует, то создаём заново список
      this.list = document.createElement('ul');
      this.list.classList.add(`${this.mainClass}__list`);
    }
    links.forEach((element, index) => {
      //перебираем список ссылок
      const li = this.createLi(element, index); // получаем элемент li и ссылка a из функции createLi
      this.list.append(li);
    });
    return this.list;
  },
  // создаётся блок со списком ссылок
  addLinksBlock: function () {
    const wrapper = document.createElement('div');
    wrapper.classList.add(`${this.mainClass}__wrap`);
    const listWrapper = document.createElement('div');
    listWrapper.classList.add(`${this.mainClass}__list-wrap`);

    const list = this.createList(); //получаем список ul из функции createList
    listWrapper.append(list);
    const newLink = document.createElement('div');
    newLink.classList.add(`${this.mainClass}__new-link`);
    newLink.textContent = 'New Link';
    newLink.addEventListener('click', this.switchForm.bind(this));
    listWrapper.append(newLink);
    wrapper.append(listWrapper);
    document.addEventListener('click', (e) => {
      // скрывать wrapper, если клик был вне container
      const withinBoundaries = e.composedPath().includes(this.container);
      if (!withinBoundaries) {
        this.wrapper.style.maxHeight = '90vh';
        wrapper.classList.remove(`${this.mainClass}__wrap--form`);
        wrapper.classList.remove(`${this.mainClass}__wrap--active`);
      }
    });
    return wrapper;
  },
  // показывает/скрывает wrapper
  toggleWrapper: function () {
    if (this.wrapper.classList.contains(`${this.mainClass}__wrap--active`)) {
      this.wrapper.style.maxHeight = '90vh';
      this.wrapper.classList.remove(`${this.mainClass}__wrap--form`);
      this.wrapper.classList.remove(`${this.mainClass}__wrap--active`);
    } else {
      this.wrapper.classList.add(`${this.mainClass}__wrap--active`);
    }
  },
  createForm: function () {
    const form = document.createElement('form');
    form.classList.add(`${this.mainClass}__form`);
    const btnArrow = this.createBtnArrow();
    form.append(btnArrow);
    const label1 = this.createLabel('new-title', 'Name');
    const label2 = this.createLabel('new-url', 'Links');
    const input1 = this.createInput('text', 'new-title', 'new-title', '');
    const input2 = this.createInput('text', 'new-url', 'new-url', 'example.com');
    form.append(label1);
    form.append(input1);
    form.append(label2);
    form.append(input2);
    const btnCreate = this.createBtnCreate('Create');
    form.append(btnCreate);
    form.addEventListener('submit', this.saveDataForm.bind(this));
    return form;
  },
  createBtnArrow: function () {
    const btnArrow = document.createElement('button');
    btnArrow.setAttribute('type', 'button');
    btnArrow.classList.add(`${this.mainClass}__btn-arrow`);
    btnArrow.addEventListener('click', this.switchForm.bind(this));
    const btnImg = document.createElement('img');
    btnImg.classList.add(`${this.mainClass}__btn-img`);
    btnImg.setAttribute('src', 'assets/svg/arrow-left.svg');
    btnImg.setAttribute('alt', 'arrow-svg');
    btnArrow.append(btnImg);
    return btnArrow;
  },
  createLabel: function (id, text) {
    const label = document.createElement('label');
    label.classList.add(`${this.mainClass}__label`);
    label.setAttribute('for', id);
    label.textContent = text;
    return label;
  },
  createInput: function (type, name, id, placeholder) {
    const input = document.createElement('input');
    input.setAttribute('type', type);
    input.setAttribute('name', name);
    input.setAttribute('id', id);
    input.setAttribute('placeholder', placeholder);
    input.setAttribute('autocomplete', 'off');
    input.setAttribute('required', true);
    input.classList.add(`${this.mainClass}__input`);
    return input;
  },
  createBtnCreate: function (text) {
    const btnCreate = document.createElement('button');
    btnCreate.textContent = text;
    btnCreate.classList.add(`${this.mainClass}__btn-create`);
    return btnCreate;
  },
  //добавление/удаление класса
  toggleClasslist: function (element, classToggle) {
    element.classList.toggle(classToggle);
  },
  switchForm: function () {
    const active = document.querySelector(`.${this.mainClass}__setting--active`);
    if (active) {
      active.classList.remove(`${this.mainClass}__setting--active`);
    }

    if (this.wrapper.classList.contains(`${this.mainClass}__wrap--form`)) {
      this.wrapper.classList.remove(`${this.mainClass}__wrap--form`);
      this.wrapper.style.maxHeight = '90vh';
      this.activeIndex = null;
      const btnCreate = this.form.querySelector(`.${this.mainClass}__btn-create`);
      btnCreate.textContent = 'Create';
      if (this.deleteBtn) {
        this.deleteBtn.remove();
      }
    } else {
      this.wrapper.classList.add(`${this.mainClass}__wrap--form`);
      const height = this.form.clientHeight;
      this.wrapper.style.maxHeight = height + 'px';
    }
  },
  // сохранение данных из формы (введенные в input) в LocalStorage
  saveDataForm: function (e) {
    e.preventDefault(); // отменяет отправку формы на сервер
    const newTitle = this.form['new-title'].value; //получаю,что введено в input1 по атрибуту name: new-title
    const newUrl = this.form['new-url'].value; //получаю,что введено в input2 по атрибуту name: new-url
    let arr = []; // массив для хранения данных для localstorage
    if (localStorage.getItem(this.keyLocalStorage)) {
      // если в localstorage по ключу уже что-то записано, перезаписываю arr
      arr = JSON.parse(localStorage.getItem(this.keyLocalStorage));
    }
    if (this.activeIndex != null) {
      arr = this.updateLinksLocalStorage(this.activeIndex, arr, newTitle, newUrl);
    } else {
      arr.push({ name: newTitle, url: newUrl }); // добавляю в массив, что введено в input
    }

    localStorage.setItem(this.keyLocalStorage, JSON.stringify(arr)); // добавляю в localstorage обновленный аrr
    this.switchForm();
    this.createList();
    this.form['new-title'].value = '';
    this.form['new-url'].value = '';
  },
  //открываются настройки ссылок
  switchSetting: function (element) {
    const active = document.querySelector(`.${this.mainClass}__setting--active`);
    if (active && active != element) {
      active.classList.remove(`${this.mainClass}__setting--active`);
    }
    element.classList.toggle(`${this.mainClass}__setting--active`);
  },
  deleteLink: function (index) {
    let arr = []; // массив для хранения данных для localstorage
    arr = JSON.parse(localStorage.getItem(this.keyLocalStorage));
    arr.splice(index, 1);
    localStorage.setItem(this.keyLocalStorage, JSON.stringify(arr)); // добавляю в localstorage обновленный аrr
    this.createList();
  },
  editLink: function (index) {
    this.activeIndex = index;
    this.switchForm(); // чтобы появилась форма для редактирования
    const btnCreate = this.form.querySelector(`.${this.mainClass}__btn-create`);
    btnCreate.textContent = 'Save';
    const arr = JSON.parse(localStorage.getItem(this.keyLocalStorage));
    const name = arr[index].name;
    const url = arr[index].url;
    this.form['new-title'].value = name;
    this.form['new-url'].value = url;
    this.createDeliteBtn();
  },
  createDeliteBtn: function () {
    this.deleteBtn = document.createElement('div');
    this.deleteBtn.classList.add(`${this.mainClass}__delete-btn`);
    this.deleteBtn.addEventListener('click', this.toggleDelBtn.bind(this));
    const iconDots = document.createElement('img');
    iconDots.classList.add(`${this.mainClass}__icon-dots`);
    iconDots.setAttribute('src', 'assets/svg/dots-icon.svg');
    iconDots.setAttribute('alt', 'dots-svg');
    this.deleteBtn.append(iconDots);
    const div = document.createElement('div');
    div.classList.add(`${this.mainClass}__delete-wrap`);
    const settingBtnDelete = document.createElement('button');
    settingBtnDelete.classList.add(`${this.mainClass}__setting-btn-delete`);
    settingBtnDelete.classList.add('btn');
    settingBtnDelete.textContent = 'Delete';
    settingBtnDelete.addEventListener('click', this.removeElement.bind(this));
    div.append(settingBtnDelete);
    this.deleteBtn.append(div);
    this.form.append(this.deleteBtn);
  },
  toggleDelBtn: function () {
    this.deleteBtn.classList.toggle(`${this.mainClass}__delete-btn--active`);
  },
  removeElement: function () {
    this.deleteLink(this.activeIndex);
    this.switchForm();
  },
  updateLinksLocalStorage: function (index, arr, newTitle, newUrl) {
    arr[index].name = newTitle;
    arr[index].url = newUrl;
    return arr;
  },
};
export default Links;
