# WB Box Tariffs Service

Сервис выполняет две задачи:
- регулярное получение тарифов WB (короба) и сохранение их в БД на каждый день (ежечасно, в течение дня обновляет данные текущей даты);
- регулярное обновление информации о тарифах в Google-таблицах (лист `stocks_coefs`).

## Стек
- Node.js + TypeScript (ESM)
- PostgreSQL + Knex
- node-cron
- Google Sheets API
- Docker, Docker Compose

## Структура проекта (основное)
- `src/services/box-tariff-service.ts` — получение тарифов WB и сохранение в БД.
- `src/services/google-sheets-service.ts` — экспорт данных в Google Sheets (`stocks_coefs`).
- `src/db/box-tariffs-db.ts` — upsert по `(date, geo_name, warehouse_name)` и чтение данных за дату.
- `src/db/migrations/*` — миграции БД (`box_tariffs`).
- `src/config/env.ts` — конфигурация окружения.
- `src/app.ts` — cron-задачи:
  - `0 * * * *` — получение тарифов WB за текущую дату;
  - `5 * * * *` — экспорт в Google Sheets.
- `docker-compose.yml`, `Dockerfile` — контейнеризация.

## Схема хранения данных
Таблица `box_tariffs` (PostgreSQL). Числовые поля допускают `NULL`, так как WB может возвращать `"-"`:
- `id` (pk), `geo_name`, `warehouse_name`
- `box_delivery_base`, `box_delivery_coef_expr`, `box_delivery_liter`
- `box_delivery_marketplace_base`, `box_delivery_marketplace_coef_expr`, `box_delivery_marketplace_liter`
- `box_storage_base`, `box_storage_coef_expr`, `box_storage_liter`
- `date` (дата тарифа)

Уникальный ключ: `(date, geo_name, warehouse_name)` — для upsert при многократных запросах в течение дня.

## Конфигурация окружения
Создайте файл `.env` в корне репозитория (чувствительные данные не коммитьте). Для БД используйте значения по заданию:

- База данных:
  - `POSTGRES_USER=postgres`
  - `POSTGRES_PASSWORD=postgres`
  - `POSTGRES_DB=postgres`
  - `POSTGRES_HOST=db`
  - `POSTGRES_PORT=5432`
- WB API:
  - `WB_API_URL=https://common-api.wildberries.ru/api/v1/tariffs/box`
  - `WB_API_TOKEN=...` (будет выдан на HH)
- Google API:
  - `GOOGLE_SERVICE_ACCOUNT_EMAIL=...`
  - `GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"` (экранируйте переносы как `\n`)
  - `GOOGLE_SPREADSHEET_IDS=spreadsheetId1,spreadsheetId2` (через запятую; количество таблиц N)

Требования к Google-таблицам:
- сервисному аккаунту выдать доступ на редактирование для каждого `spreadsheetId`;
- в каждой таблице должен существовать лист `stocks_coefs` (данные перезаписываются с `A1`).

## Запуск
Приложение запускается одной командой и работает в контейнерах.

1) Подготовьте `.env` как описано выше.
2) Выполните:

```
docker compose up
```

Compose выполнит:
- запуск PostgreSQL c пользователем/паролем/БД `postgres`;
- миграции (`knex migrate:latest`);
- старт приложения с cron-задачами (ежечасное получение WB и экспорт в Sheets).

## Проверка функционирования
- После старта подождите ближайшего запуска cron (или временно измените расписание в `src/app.ts`).
- В БД таблице `box_tariffs` появятся записи за текущую дату. Повторные часовые запросы в этот день обновляют соответствующие записи.
- В указанных Google-таблицах на листе `stocks_coefs` появятся заголовки и строки, отсортированные по возрастанию коэффициента (при наличии — по marketplace, иначе — по delivery).

## Примечания
- Приложение работает как фоновые cron-задачи (HTTP-сервер не поднимается).
- В репозитории отсутствуют секреты; используйте локальный `.env`.
- Подключение к БД — через Knex (PostgreSQL).
