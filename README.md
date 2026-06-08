# SwiftMatch — Dating App

Фронтенд приложения для знакомств, построенный на React 18, TypeScript 5, Vite 5, Tailwind CSS 3 и shadcn/ui. Готов к интеграции с бэкендом.

## Tech Stack

| Категория | Технологии |
|-----------|------------|
| Core | React 18, TypeScript 5, Vite 5 |
| Styling | Tailwind CSS 3, shadcn/ui (Radix UI) |
| Animations | Framer Motion 12 |
| State | TanStack React Query 5 |
| Routing | React Router DOM 6 |
| Charts | Recharts 3 |
| Forms | React Hook Form 7 + Zod 4 |
| CMS | Firebase (stubs, ready for integration) |
| Testing | Vitest 3, Testing Library |
| Code Quality | ESLint 9, TypeScript strict |

## Features

- **Свайпинг** — просмотр анкет с свайпом влево/вправо, супер-лайк
- **Автопоиск** — алгоритм скоринга совместимости (бусты, интересы, дистанция, циркадные ритмы, тип привязанности)
- **Чаты** — личные сообщения, AI-подсказки, inline-реакции, фильтр сообщений
- **Группы** — 20 категорий, 400+ виртуальных подгрупп
- **Профиль** — галерея фото, stories, visitors, тест привязанности, бусты, титулы
- **Конкурс** — рейтинги, голосование, ежедневные квесты
- **Онбординг** — 5-шаговый мастер заполнения профиля
- **Админ-панель** — дашборд, пользователи, жалобы, контент, фича-флаги, монетизация, рассылки
- **Активность** — лента like/visit/match с премиум-гейтингом
- **i18n** — поддержка русского и английского языков
- **Фильтр контента** — мат, политика, спам, скам, gibberish-детектор

## Production-ready improvements

По сравнению с исходным проектом добавлено:

| Изменение | Описание |
|-----------|----------|
| **Типизация** | 20+ интерфейсов, все `any` заменены |
| **API-клиент** | fetch-обёртка с Bearer auth, retry, timeout, обработка 401 |
| **Auth** | AuthContext, login/register/logout, защита роутов |
| **Environment** | `.env.development`, `.env.production`, валидация |
| **Error Boundary** | Глобальный перехват ошибок рендера |
| **Lazy loading** | Все 33 страницы грузятся по запросу |
| **Code splitting** | manualChunks: vendor, ui, animations, charts |
| **Тесты** | 16 unit-тестов (API client, utils) |

## Quick Start

```bash
# Установка
npm install

# Запуск dev-сервера
npm run dev
# → http://localhost:8080

# Сборка
npm run build

# Тесты
npm test

# Линтинг
npm run lint

# Превью собранного
npm run preview
```

## Environment Variables

Скопируйте `.env.example` в `.env.development` или `.env.production` и заполните значения:

```env
VITE_API_URL=/api                    # URL бэкенда
VITE_WS_URL=ws://localhost:8080      # WebSocket URL
VITE_APP_NAME=SwiftMatch             # Название приложения
VITE_IMAGE_BASE_URL=/demo/people     # Базовый URL изображений
VITE_PAGINATION_LIMIT=20             # Лимит пагинации
VITE_SENTRY_DSN=                     # Sentry DSN (опционально)
```

## Project Structure

```
src/
├── components/
│   ├── layout/        # AppContainer, AppHeader, AdminLayout, BottomNav
│   ├── shared/        # ErrorBoundary, LoadingScreen, CookieConsent, PWA
│   ├── ui/            # 40+ shadcn/ui компонентов
│   ├── dialogs/       # Match, Premium, Filter, Ad, Autosearch
│   ├── sections/      # TopOfWeek, Visitors, Gallery
│   └── navigation/    # AdminSidebar
├── context/           # Auth, Language, FeatureFlags
├── hooks/             # useApi, useToast, useMobile, useIdleTimer
├── lib/               # api, utils, env, constants, demo-data
├── pages/             # 33 страницы (Home, Search, Chats, Profile, Admin...)
├── shims/             # Firebase, Next.js stubs
├── types/             # TypeScript interfaces
├── test/              # Unit-тесты
└── locales/           # i18n JSON-файлы (ru, en)
```

## API Endpoints (ожидаемые)

При подключении бэкенда API-клиент ожидает следующие эндпоинты:

| Метод | Path | Описание |
|-------|------|----------|
| POST | `/auth/login` | Вход по email/пароль |
| POST | `/auth/google` | Вход через Google |
| POST | `/auth/register` | Регистрация |
| GET | `/auth/me` | Текущий пользователь |
| POST | `/upload/profile-photo` | Загрузка фото |

## Deployment

```bash
# Production сборка
npm run build

# Статика в папке dist/ готова к деплою на:
# - Vercel (vercel.json прилагается)
# - Netlify
# - Cloudflare Pages
# - Любой S3/CDN
```

## License

MIT
