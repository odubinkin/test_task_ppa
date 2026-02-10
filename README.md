# PPA Real Estate Catalog

## О проекте
Мини-приложение-каталог недвижимости, выполненное как тестовое задание для Ассоциации Недвижимости Пхукета (PPA).

Проект демонстрирует:
- SSR-рендеринг страницы каталога;
- переключение валюты с сохранением выбора в cookie;
- отображение карточек недвижимости из локального JSON-источника;
- покрытие критичной логики тестами.

## Спецификация
- [spec.md](./spec.md)

## Технологии
- Next.js 16 (App Router)
- TypeScript (strict mode)
- React 19
- Tailwind CSS 4
- shadcn-style UI components
- Vitest
- Testing Library

## Установка зависимостей
```bash
npm install
```

## Сборка проекта
```bash
npm run build
```

## Запуск тестов
Однократный запуск:
```bash
npm test
```

Режим наблюдения:
```bash
npm run test:watch
```

## Запуск приложения
Режим разработки:
```bash
npm run dev
```

После запуска откройте:
- http://localhost:3000

Запуск production-версии локально:
```bash
npm run build
npm start
```
