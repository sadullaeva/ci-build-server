# CI build server

Проект использует Node.js v12.16.1.

Создайте файл `server-conf.json`, скопировав его с файла `server-conf.template.json`.
В созданном файле необходимо заполнить поле `apiToken`, токен можно получить на [hw.shri.yandex](https://hw.shri.yandex/).

Команда для установки зависимостей:
```
npm ci
```

Команда для запуска билд-сервера:
```
npm run start
```

Урл для просмотра swagger документации: http://localhost:8081/swagger/
