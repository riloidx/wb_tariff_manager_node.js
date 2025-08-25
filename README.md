## WB Tariff Manager (Node.js)

Сервис для периодической загрузки тарифов WB, сохранения их в PostgreSQL и экспорта актуальных данных в Google Sheets. Работа выполняется по расписанию (cron) внутри процесса.

### Технологический стек
- Node.js 20, TypeScript 
- PostgreSQL 16, Knex 
- Google Sheets API 
- Docker/Docker Compose 
- Планировщик: node-cron

### Структура проекта (важное)
- `src/app.ts` — планировщик задач (cron).
- `src/services/box-tariff-service.ts` — загрузка тарифов WB и сохранение в БД.
- `src/services/google-sheets-service.ts` — экспорт тарифов в Google Sheets.
- `src/db` — подключение к БД и запросы, `src/db/migrations` — миграции.
- `src/config/env.ts` — загрузка и проверка переменных окружения из `.env`.

### Переменные окружения
Файл `.env` читается из корня проекта:

- БД:
  - `POSTGRES_USER`
  - `POSTGRES_PASSWORD`
  - `POSTGRES_DB`
  - `POSTGRES_HOST`
  - `POSTGRES_PORT`

- WB API:
  - `WB_API_URL` — URL эндпоинта WB 
  - `WB_API_TOKEN` — Bearer‑токен для WB 

- Google Sheets (сервисный аккаунт):
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL` — email сервисного аккаунта
  - `GOOGLE_PRIVATE_KEY` — приватный ключ.
  - `GOOGLE_SPREADSHEET_IDS` — список ID таблиц через запятую. Можно оставить пустым — экспорт отключится.

- Прочее:
  - `NODE_ENV` — `development`/`production`
  
Пример `.env`:
```env
NODE_ENV=development

# PostgreSQL
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres
POSTGRES_DB=postgres
POSTGRES_HOST=localhost
POSTGRES_PORT=5432

# WB API
WB_API_URL=https://example.wb/api/tariffs
WB_API_TOKEN=your_wb_bearer_token

# Google Sheets (Service Account)
GOOGLE_SERVICE_ACCOUNT_EMAIL=your_email
GOOGLE_PRIVATE_KEY=your_private_key
# Несколько таблиц через запятую
GOOGLE_SPREADSHEET_IDS=1AbCdEfGhIjKlMnOp,2ZyXwVuTsRqPoNmL
```

### Быстрый старт (через Docker Compose)
Требования: установлен Docker и Docker Compose.

1) Создайте `.env` в корне (см. пример выше).
2) Запустите сервисы:
```bash
docker compose up --build
```
Compose поднимет `postgres:16-alpine`, выполнит миграции и запустит приложение в режиме разработки. Cron‑задачи начнут выполняться автоматически.

Полезные команды:
```bash
# Остановить
docker compose down

# Перезапустить (с пересборкой)
docker compose up -d --build

# Посмотреть логи приложения
docker compose logs -f app
```

### Локальный запуск без Docker
Требования: Node.js 20+, PostgreSQL 14+.

1) Установите зависимости:
```bash
npm install
```

2) Поднимите PostgreSQL и создайте БД/пользователя при необходимости. Заполните `.env` для локального окружения (хост `localhost`).

3) Выполните миграции:
```bash
npm run migrate:latest
```

4) Запустите приложение:
```bash
npm run dev
```
Процесс запустит только cron‑задачи, HTTP‑эндпоинтов нет.

### Расписание задач (cron)
Определено в `src/app.ts`:
- Каждые 60 минут, в 00 минут часа — загрузка тарифов WB и запись в БД: `fetchAndSaveWbTariffs()`.
- Каждые 60 минут, в 05 минут часа — экспорт последних тарифов в Google Sheets: `exportTariffsToSheets()`.

Обе задачи используют сегодняшнюю дату в формате `YYYY-MM-DD`.

### Миграции БД
Миграции находятся в `src/db/migrations`. Основная таблица: `box_tariffs` с уникальным ключом по (`date`, `geo_name`, `warehouse_name`). Запись выполняется через upsert.

Команды:
```bash
# Создать новую миграцию (имя задастся автоматически)
npm run migrate:make -- create_new_migration_name

# Применить последние миграции
npm run migrate:latest

# Откатить последнюю «партию» миграций
npm run migrate:rollback
```

### Команды npm
```bash
npm run dev               # запуск cron-задач через ts-node
npm run migrate:make      # создание миграции (knex)
npm run migrate:latest    # применение миграций
npm run migrate:rollback  # откат миграций
```

### Доступы Google Sheets
1) Создайте сервисный аккаунт в Google Cloud и включите API Google Sheets.
2) Скачайте JSON ключ и возьмите из него `client_email` и `private_key`.
3) Приватный ключ поместите в `.env` одной строкой, заменив переводы строк на `\n`.
4) Поделитесь каждой целевой таблицей Google Sheets с `client_email` на права редактирования.
5) В `.env` укажите `GOOGLE_SPREADSHEET_IDS` — это ID файла из URL вида `https://docs.google.com/spreadsheets/d/<ID>/edit`.

### Траблшутинг
- Ошибка `Missing env variable: ...` — проверьте `.env`; все обязательные переменные должны быть заданы.
- Ошибка подключения к БД — проверьте, что PostgreSQL запущен и параметры подключения корректны; при Docker доступ к БД осуществляется по хосту `db` из контейнера.
- Приватный ключ Google: убедитесь, что в `.env` переводы строк экранированы как `\n`.
- Нет данных в таблице/Sheets — проверьте логи, корректность `WB_API_URL`/`WB_API_TOKEN` и права сервисного аккаунта к таблицам.


