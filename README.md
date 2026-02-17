## Сущности данных

### 1. Лекарства 
Файл: `medicines.json`
Сущность описывает товары, доступные в аптеке.
Поля:
- `id` String: Уникальный идентификатор.
- `name` String: Название лекарства.
- `price` Number: Цена за упаковку.
- `requiresPrescription` Boolean: Требуется ли рецепт для покупки.
- `expiryDate` Date String: Срок годности.
- `activeIngredients` Array of Strings: Список активных действующих веществ.

### 2. Фармацевты
Файл: `pharmacists.json`
Сущность описывает сотрудников аптеки.
Поля:
- `id` String: Уникальный идентификатор.
- `fullName` String: ФИО сотрудника.
- `age` Number: Возраст.
- `isOnShift` Boolean: Находится ли сотрудник сейчас на смене.
- `hireDate` Date String: Дата приема на работу.
- `scheduleDays` Array of Strings: Рабочие дни недели.

### Лекарства (Medicines)
- `GET /medicines` — Получить список всех лекарств.
- `GET /medicines/:id` — Получить лекарство по ID.
- `POST /medicines` — Добавить новое лекарство (требует JSON body).
- `PUT /medicines/:id` — Полностью заменить данные лекарства.
- `PATCH /medicines/:id` — Частично обновить данные (например, только цену).
- `DELETE /medicines/:id` — Удалить лекарство.

### Фармацевты (Pharmacists)
- `GET /pharmacists` — Получить список всех сотрудников.
- `GET /pharmacists/:id` — Получить данные сотрудника по ID.
- `POST /pharmacists` — Зарегистрировать нового сотрудника.
- `PUT /pharmacists/:id` — Обновить профиль сотрудника (полная замена).
- `PATCH /pharmacists/:id` — Частичное обновление (например, изменить статус `isOnShift`).
- `DELETE /pharmacists/:id` — Удалить сотрудника из системы.