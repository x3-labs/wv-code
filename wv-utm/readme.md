# UTM Analytics Script

## Описание

UTM Analytics Script - это JavaScript-скрипт для автоматического отслеживания и сохранения UTM-параметров, Click ID и других данных аналитики в веб-формах. Скрипт обеспечивает сквозную аналитику, сохраняя данные о первом и последнем визите пользователя.

## Основные возможности

- **Автоматическое извлечение UTM-параметров** из URL
- **Сохранение Click ID** от различных рекламных платформ (Google, Facebook, TikTok, Yandex)
- **Извлечение Client ID** из куки аналитических систем
- **Сквозное отслеживание** с сохранением данных между сессиями
- **Автоматическое заполнение скрытых полей** в формах
- **Безопасная работа** с обработкой ошибок
- **Поддержка отладки** через консоль браузера

## Установка

```html
<script src="https://cdn.jsdelivr.net/gh/x3-labs/wv-code/wv-utm/utm.min.js"></script>
```

## Конфигурация

### Основные параметры

```javascript
const STORAGE_KEY = "analytics_data";           // Ключ для localStorage
const STORAGE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 дней хранения
const DEBUG_MODE = false;                       // Режим отладки
```

### Отслеживаемые параметры

Скрипт автоматически отслеживает и сохраняет следующие типы данных:

#### UTM-параметры
- `utm_source` - источник трафика
- `utm_medium` - канал трафика
- `utm_campaign` - название кампании
- `utm_content` - содержание объявления
- `utm_term` - ключевые слова

#### Click ID параметры
- `gclid` - Google Ads Click ID
- `fbclid` - Facebook Click ID
- `ttclid` - TikTok Click ID
- `yclid` - Yandex Click ID

#### Facebook параметры
- `fbp` - Facebook Browser ID
- `fbc` - Facebook Click ID

#### Client ID аналитических систем
- `google_client_id` - из куки Google Analytics (_ga)
- `yandex_client_id` - из куки Яндекс.Метрики (_ym_uid)
- `facebook_browser_id` - из куки Facebook Pixel (_fbp)

#### Системные данные
- `page_url` - URL страницы без UTM-параметров
- `form_name` - имя/идентификатор формы
- `referer` - реферер (откуда пришел пользователь)
- `user_agent` - информация о браузере
- `timestamp` - время заполнения формы

#### Данные о визитах
- `first_visit_timestamp` - время первого визита
- `last_visit_timestamp` - время последнего визита
- `first_visit_page` - страница первого визита
- `last_visit_page` - страница последнего визита

## Использование

### Подготовка HTML-форм

Добавьте скрытые поля в ваши формы с соответствующими CSS-классами:

```html
<!-- UTM параметры -->
<input type="hidden" class="utm_source" name="utm_source" />
<input type="hidden" class="utm_medium" name="utm_medium" />
<input type="hidden" class="utm_campaign" name="utm_campaign" />
<input type="hidden" class="utm_content" name="utm_content" />
<input type="hidden" class="utm_term" name="utm_term" />

<!-- Click ID параметры -->
<input type="hidden" class="gclid" name="gclid" />
<input type="hidden" class="fbclid" name="fbclid" />
<input type="hidden" class="ttclid" name="ttclid" />
<input type="hidden" class="yclid" name="yclid" />

<!-- Facebook параметры -->
<input type="hidden" class="fbp" name="fbp" />
<input type="hidden" class="fbc" name="fbc" />

<!-- Client ID -->
<input type="hidden" class="google_client_id" name="google_client_id" />
<input type="hidden" class="yandex_client_id" name="yandex_client_id" />
<input type="hidden" class="facebook_browser_id" name="facebook_browser_id" />

<!-- Дополнительные поля -->
<input type="hidden" class="page_url" name="page_url" />
<input type="hidden" class="form_name" name="form_name" />
<input type="hidden" class="referer" name="referer" />
<input type="hidden" class="user_agent" name="user_agent" />
<input type="hidden" class="timestamp" name="timestamp" />

<!-- Информация о визитах -->
<input type="hidden" class="first_visit_timestamp" name="first_visit_timestamp" />
<input type="hidden" class="last_visit_timestamp" name="last_visit_timestamp" />
<input type="hidden" class="first_visit_page" name="first_visit_page" />
<input type="hidden" class="last_visit_page" name="last_visit_page" />

<!-- Видимые поля формы -->
<input type="text" name="name" placeholder="Имя" required />
<input type="email" name="email" placeholder="Email" required />
<button type="submit">Отправить</button>
```

### Работа с динамическими формами

Для форм, добавляемых динамически после загрузки страницы:

```javascript
// Инициализация для конкретной формы
const form = document.querySelector('#my-dynamic-form');
window.initAnalyticsForForm(form);
```

## API

### Глобальные функции

#### `window.getAnalyticsData()`

Возвращает объект с текущими данными аналитики:

```javascript
const data = window.getAnalyticsData();
console.log(data);
```

**Возвращаемые данные:**
```javascript
{
  current_url_params: {...},      // Текущие параметры URL
  saved_data: {...},              // Сохраненные данные
  final_data: {...},              // Итоговые данные
  google_client_id: "...",        // Google Client ID
  yandex_client_id: "...",        // Yandex Client ID
  facebook_browser_id: "...",     // Facebook Browser ID
  localStorage_supported: true,    // Поддержка localStorage
  page_url: "..."                 // Чистый URL страницы
}
```

#### `window.initAnalyticsForForm(form)`

Инициализирует аналитику для конкретной формы:

```javascript
const success = window.initAnalyticsForForm(formElement);
```

**Параметры:**
- `form` - DOM-элемент формы

**Возвращает:**
- `true` - успешная инициализация
- `false` - ошибка инициализации

## Логика работы

### Сохранение данных

1. **Первый визит**: Все UTM-параметры и Click ID сохраняются в localStorage
2. **Последующие визиты**: Новые параметры дополняют/перезаписывают существующие
3. **Приоритет**: Параметры из текущего URL имеют приоритет над сохраненными

### Извлечение Client ID

- **Google Analytics**: из куки `_ga` (формат: `GA1.2.xxxxxxxx.xxxxxxxx`)
- **Yandex Metrica**: из куки `_ym_uid`
- **Facebook**: из куки `_fbp`

### Заполнение форм

- **При загрузке**: Автоматически заполняются все найденные формы
- **При отправке**: Дополнительное заполнение перед submit
- **Динамические формы**: Через `initAnalyticsForForm()`

## Особенности

### Безопасность

- Все функции обернуты в try-catch блоки
- Проверка существования объектов перед использованием
- Автоматическая очистка поврежденных данных в localStorage
- Обработка переполнения localStorage

### Совместимость

- Поддержка всех современных браузеров
- Graceful degradation для старых браузеров
- Проверка доступности localStorage
- Работа без внешних зависимостей

### Производительность

- Минимальное воздействие на загрузку страницы
- Кеширование данных в localStorage
- Автоматическая очистка устаревших данных
- Оптимизированные регулярные выражения

## Отладка

### Включение режима отладки

```javascript
const DEBUG_MODE = true;
```

### Консольные команды

```javascript
// Получить все данные аналитики
window.getAnalyticsData();

// Проверить localStorage
localStorage.getItem('analytics_data');

// Проверить куки
document.cookie;
```

### Типичные проблемы

1. **Не заполняются поля**: Проверьте CSS-классы скрытых полей
2. **Не сохраняются данные**: Проверьте поддержку localStorage
3. **Не извлекается Client ID**: Проверьте наличие соответствующих куки

## Примеры использования

### Интеграция с WordPress Contact Form 7

```html
<!-- UTM параметры -->
[hidden utm_source class:utm_source]
[hidden utm_medium class:utm_medium]
[hidden utm_campaign class:utm_campaign]
[hidden utm_content class:utm_content]
[hidden utm_term class:utm_term]

<!-- Click ID параметры -->
[hidden gclid class:gclid]
[hidden fbclid class:fbclid]
[hidden ttclid class:ttclid]
[hidden yclid class:yclid]

<!-- Facebook параметры -->
[hidden fbp class:fbp]
[hidden fbc class:fbc]

<!-- Client ID -->
[hidden google_client_id class:google_client_id]
[hidden yandex_client_id class:yandex_client_id]
[hidden facebook_browser_id class:facebook_browser_id]

<!-- Системные данные -->
[hidden page_url class:page_url]
[hidden form_name class:form_name]
[hidden referer class:referer]
[hidden user_agent class:user_agent]
[hidden timestamp class:timestamp]

<!-- Данные о визитах -->
[hidden first_visit_timestamp class:first_visit_timestamp]
[hidden last_visit_timestamp class:last_visit_timestamp]
[hidden first_visit_page class:first_visit_page]
[hidden last_visit_page class:last_visit_page]
```

### Поддерживаемые браузеры
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Internet Explorer 11

### Зависимости
- Нет внешних зависимостей
- Использует только нативные Web APIs

## Changelog

### v1.0.0
- Первоначальная версия
- Поддержка UTM-параметров и Click ID
- Автоматическое заполнение форм
- Сквозная аналитика с localStorage

---

## Обновление скрипта в jsDelivr

1. **Загрузите обновленный файл** в GitHub репозиторий `x3-labs/wv-code`
2. **Создайте новый релиз (тег)** в GitHub для принудительного обновления кеша
3. **Очистите кеш jsDelivr** по URL: https://purge.jsdelivr.net/gh/x3-labs/wv-code/wv-utm/utm.min.js
4. **Альтернативно используйте версионирование**: https://cdn.jsdelivr.net/gh/x3-labs/wv-code@version/wv-utm/utm.min.js
