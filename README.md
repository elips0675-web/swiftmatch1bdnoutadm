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
| `demo@mail.ru` | `admin123` | Анна (пользователь) |
| `user4@demo.ru` … `user23@demo.ru` | `admin123` | 18 демо-пользователей |

> После `git pull` запустить `node seed-users.cjs` в `server/` если добавились новые demo-пользователи.

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

### Фаза 6 — Infrastructure & Real-time ✅
- WebSocket-клиент (`socket.io-client`) подключён к серверу
- Real-time доставка сообщений через `chat:message` event
- VAPID-ключи сгенерированы, push-уведомления рабочие
- Stripe пакет установлен
- Порт Vite унифицирован (8081)
- UTF-8 кодировка на всех уровнях (БД, сервер, HTML)
- Очистка мусорных данных (чаты, participants)

---

## Что ещё можно сделать

| # | Задача | Приоритет |
|---|--------|-----------|
| 1 | **Stripe live** — добавить в `.env` реальные ключи Stripe (сейчас mock) | Высокий |
| 2 | **Реальная реклама** — AdMob / Yandex SDK вместо таймера | Высокий |
| 3 | **SMTP** — заполнить SMTP_USER/PASS в `.env` (хосты раскомментированы) | Низкий |
| 4 | **Stripe webhook** — проверка подписи через `express.raw()` ✅ | Готово |
| 5 | **Stripe success/cancel** — страницы `/premium/success`, `/premium/cancel` ✅ | Готово |
| 6 | **Admin users — premium статус** — реальный `tier` из `subscriptions` вместо `'free'` ✅ | Готово |
| 7 | **Upload security** — `optionalAuth` middleware + userId из JWT (с fallback для demo) ✅ | Готово |
| 8 | **helmet** — security headers (CSP, X-Frame-Options, и т.д.) ✅ | Готово |

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
VAPID_PUBLIC_KEY=BEygaffoNfy9XaaH0QqILW1Kzuf-7WoVL4oAvQpC1ebFkZ8X828d8Fv8TXcqBuykDK4IWJdZMA6TOkQfSBP8N8o
VAPID_PRIVATE_KEY=b370faewrsuKX2yUXBZ-2-axZiScdesTmpXHPq0yJN4
```
