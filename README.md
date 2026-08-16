# AI Lab

AI Lab — интерактивный двуязычный курс по искусственному интеллекту и большим языковым моделям: от первого нейрона до собственной GPT-подобной модели.

## Product principles

- **Русский по умолчанию**, полноценный переключатель RU / EN.
- **Learn by building:** каждый урок добавляет механизм в `MyAI`.
- **Predict → Explore → Code:** сначала гипотеза, затем интерактивная лаборатория, затем реализация.
- **Без AI-чат-слота:** обучение строится вокруг модели, эксперимента и кода, а не вокруг помощника.
- **Progressive depth:** одна продуктовая система должна поддерживать траектории Explorer → Builder → Engineer → Researcher.

## Current vertical slice

Первый рабочий экран: `Первый нейрон` / `First Neuron`.

- интерактивные параметры `x`, `w`, `b`;
- формула `y = wx + b`;
- график зависимости выхода;
- вычисление «вручную»;
- проверочный вопрос;
- учебная кодовая панель;
- прогресс `Build MyAI`;
- локализованные маршруты `/ru/...` и `/en/...`.

## Stack

- Next.js 16 Active LTS
- React 19.2
- TypeScript 5
- App Router
- next-intl 4
- Biome 2.5
- Vitest 5
- CSS design tokens, без тяжёлого UI-фреймворка

## Local development

```bash
npm install
npm run dev
```

Проверки:

```bash
npm run typecheck
npm run lint
npm run test
npm run build
```

## Architecture direction

Контент, интерактивные лаборатории, выполнение кода и прогресс пользователя будут развиваться как отдельные слои. Это позволит в дальнейшем подключить CMS, sandboxed Python runtime, аккаунты, teacher analytics и полноценный пайплайн `MyGPT`, не переписывая основу курса.
