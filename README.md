# SwiftMatch1BD — Тестовая копия с локальной БД

Клон [основного репозитория](https://github.com/elips0675-web/swiftmatch-vite-react1-production1) для тестирования с **реальной MySQL-БД** через локальный API-сервер.

Отличается от оригинала:
- **Бэкенд:** Node.js/Express + MySQL (Laragon), а не Supabase
- **Данные:** демо-данные (3 пользователя, чаты, сообщения, группы, посты)
- **Порт API:** 3002 (чтобы не конфликтовать с оригиналом на 3001)
- **Порт фронта:** 8081

---

## Быстрый старт

### 1. MySQL (Laragon)

Убедитесь, что MySQL запущен. База `swiftmatch` уже создана со схемой и демо-данными.

Импортировать заново:
```bash
mysql -u root swiftmatch < database\mysql_schema.sql
mysql -u root swiftmatch < database\demo_data.sql
```

### 2. API сервер

```bash
cd server
npm install
node src/index.js
# → http://localhost:3002
```

### 3. Фронтенд

```bash
npm install
npx vite --port 8081 --host
# → http://localhost:8081
```

---

## Данные для входа

| Email | Пароль | Роль |
|-------|--------|------|
| `admin@mail.ru` | `admin123` | Админ |
| `demo@mail.ru` | `demo123` | Пользователь (Анна) |

---

## Функционал (готово)

### Фаза 1 — Core User Flow ✅
- Регистрация → анкета → лайки → мэтч → чат
- Загрузка фото через `/api/upload`
- Онбординг с сохранением в MySQL + fallback localStorage
- Bearer-токен авторизация

### Фаза 2 — Social Features ✅
- `/matches` — страница мэтчей
- `/premium` — тарифы, покупка подписки
- Группы: создание, вступление, категории
- Конкурс: голосование, лидерборд
- Онлайн-статус (зелёная точка) через WebSocket
- Typing indicator («печатает…»)

### Фаза 3 — Admin & Moderation ✅
- Email-рассылки (nodemailer/SMTP)
- Push-уведомления (VAPID + web-push)
- Бан + WS `user:banned` (разлогин)
- Запрещённые слова в чатах (REST + WS)
- История действий в карточке юзера
- Имперсонация (войти как пользователь)

### Фаза 4 — Monetization ✅
- **Платёжный шлюз:** Stripe Checkout + mock fallback, отмена подписки
- **Премиум-гейтинг:** лимит 10 лайков/день для free, просмотры скрыты без подписки
- **Рекламные баннеры:** фича-флаг `showAds`, сохранение конфига рекламы в БД
- **UI:** выбор тарифа (Plus/Gold/Platinum) + длительности (1/6/12 мес.)
- **Админка:** управление ценами, рекламными блоками (Google AdMob / Yandex)

### Фаза 5 — Polish & Advanced ✅
- Геопоиск по радиусу (Haversine)
- История просмотров (profile_view → activity_log)
- AI-рекомендации (compatibility_scores)
- Сохранение attachment-теста
- Удаление сообщений
- Системные уведомления (SW + Push)
- Боты (11 демо-ботов автолайкают + пишут в чат)
- i18n (RU/EN)

---

## Что ещё можно сделать

| # | Задача | Приоритет |
|---|--------|-----------|
| 1 | **Stripe live** — добавить `.env` с реальными ключами. Пакет `stripe` не установлен в `server/` | Высокий |
| 2 | **Реальная реклама** — AdMob / Yandex SDK вместо таймера | Высокий |
| 3 | **WebSocket-клиент** — `socket.io-client` не импортирован во фронтенде, чат не реалтайм | Высокий |
| 4 | **Сброс пароля** — API готов, SMTP закомментирован | Средний |
| 5 | **Подтверждение email** — API готов, SMTP закомментирован | Средний |
| 6 | **VAPID-ключи** не заданы — push-уведомления не работают | Средний |
| 7 | **Порт Vite** — дефолтный конфиг 8080, инструкции про 8081 | Низкий |

---

## Структура

| Папка | Назначение |
|-------|------------|
| `server/` | API на Express + MySQL (маршруты: auth, profile, social, chats, groups, contest, premium, reports, notifications, admin) |
| `server/src/routes/admin/` | Админка (dashboard, users, analytics, reports, content, features, messaging, monetization, media) |
| `server/src/ws.js` | Socket.IO (чат, уведомления, онлайн-статус) |
| `src/` | Фронтенд на React + Vite + Tailwind |
| `database/` | `mysql_schema.sql` + `demo_data.sql` |

## Настройка .env

`server/.env` уже настроен для локальной работы:
```
PORT=3002
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=swiftmatch
CORS_ORIGIN=http://localhost:8081
JWT_SECRET=swiftmatch-dev-secret-change-in-production
```
