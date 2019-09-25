// 1. Получить пользователей (users) от сервера https://jsonplaceholder.typicode.com. Получив ответ от сервера вывести имена пользователей на страницу. При клике на имя пользователя в произвольном месте должна появиться подробная информация о нем. Для визуальной части можно использовать bootstrap или другие фреймворки.

// 2. Создать форму добавления пользователя состоящая из полей name, email, username, phone, website при сабмите формы сделать POST запрос на сервер после ответа от сервера добавлять полученного пользователя на страницу.


// Создаем список и форму (основу для формы скоммуниздил с одного из предыдущих заданий)

function createList() {
    const list = `
    <div class="container w-50">
        <ul class="user-list list-group"></ul>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', list);
}

createList();

function createForm() {
    const form = `
    <div class="form-section mt-4 mb-4">
        <div class="container">
            <div class="row">
                <div class="col-6 mx-auto form-col">
                    <div class="card card-body">
                        <form>
                            <div class="form-group">
                                <label for="title">Name</label>
                                <input type="text" name="name" id="name" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="text">Email</label>
                                <input type="text" name="email" id="email" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="text">Username</label>
                                <input type="text" name="username" id="username" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="text">Phone</label>
                                <input type="text" name="phone" id="phone" class="form-control">
                            </div>
                            <div class="form-group">
                                <label for="text">Website</label>
                                <input type="text" name="website" id="website" class="form-control">
                            </div>
                            <button type="submit" class="btn btn-success mb-3">Add User</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    `;

    document.body.insertAdjacentHTML('afterbegin', form);
}

createForm();

const userList = document.querySelector('.user-list');
const formName = document.querySelector('#name');
const formEmail = document.querySelector('#email');
const formUsername = document.querySelector('#username');
const formPhone = document.querySelector('#phone');
const formWebsite = document.querySelector('#website');
const addBtn = document.querySelector('button');
const allInputs = document.querySelectorAll('input');
const formWrapper = document.querySelector('.card-body');

// Создаем функции для get и post запросов на сервер

function getUsers(callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://jsonplaceholder.typicode.com/users');
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        callback(response);
    });

    xhr.send();
}

function sendUsers(body, callback) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'https://jsonplaceholder.typicode.com/users');
    xhr.addEventListener('load', () => {
        const response = JSON.parse(xhr.responseText);
        callback(response);
    });

    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');

    xhr.send(JSON.stringify(body));
}

// Создаем список с именем и вложенным списком с детальной инфой о пользователях. Вложенный список скрываем по дефолту с помощью бутстраповского класса

function createListElement(response) {
    response.forEach(user => {
        const newLi = `
        <li class="list-group-item">${user.name}
            <ul class="d-none">
                <li>Phone: ${user.phone}</li>
                <li>Username: ${user.username}</li>
                <li>Website: ${user.website}</li>
                <li>Email: ${user.email}</li>
            </ul>
        </li>
        `;
        userList.insertAdjacentHTML('afterbegin', newLi);
    });
}

getUsers(createListElement);

// Тоглим этот класс по клику на имя юзера в списке

userList.addEventListener('click', (event) => {
    if (!event.target.classList.contains('list-group-item')) {
        return;
    };

    const nestedList = event.target.firstElementChild;
    nestedList.classList.toggle('d-none');
});

// Пишем функцию для добавления новой лишки, в которую мы будем вставлять результат ответа от сервера

function createNewLi(response) {
    const newLi = `
    <li class="list-group-item">${response.name}
        <ul class="d-none">
            <li>Phone: ${response.phone}</li>
            <li>Username: ${response.username}</li>
            <li>Website: ${response.website}</li>
            <li>Email: ${response.email}</li>
        </ul>
    </li>
    `;

    userList.insertAdjacentHTML('afterbegin', newLi);
}

// Вешаем ивент листенер на кнопку, которая отправляет текст из формы на сервер и присылает нам ответ, который мы передали в прошлую функцию

addBtn.addEventListener('click', event => {
    event.preventDefault();

    if (!formName.value || !formEmail.value || !formUsername.value || !formPhone.value || !formWebsite.value) {
        alert('You must fill out all the fields of the form!');
        return;
    }

    const newUser = {
        name: formName.value,
        email: formEmail.value,
        username: formUsername.value,
        phone: formPhone.value,
        website: formWebsite.value,
    };

    sendUsers(newUser, createNewLi);

    allInputs.forEach(item => item.value = ''); // Обнуляем содержание инпутов после отправки данных

    messageSuccess(); // Вызываем функцию, которая выводит и удаляет сообщение об успешном добавлении нового юзера
})


// Функции для вывода уведомления о добавлении нового юзера

function messageSuccess() {
    removeAlert();

    const msg = `
    <div class="bg-info alert-wrapper pt-3 rounded">
        <p class="text-center text-white">New user has been added!</p>
    </div>
    `;

    formWrapper.insertAdjacentHTML('beforeend', msg);

    setTimeout(removeAlert, 1500);
}

function removeAlert() {
    const currentAlert = document.querySelector('.alert-wrapper');
    if (currentAlert) {
        formWrapper.removeChild(currentAlert);
    }
}