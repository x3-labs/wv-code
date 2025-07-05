# Обработчик форм с UTM-метками и Google Client ID

Этот легковесный JavaScript-скрипт выполняет следующие задачи:
- Извлекает UTM-параметры из URL (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`, `utm_term`).
- Вычисляет адрес текущей страницы без UTM-параметров.
- Получает имя формы (из атрибута `name` или подставляет значение по умолчанию).
- Извлекает Google Client ID из cookie `_ga` с обработкой ошибок, если формат cookie отличается от ожидаемого.

Скрипт написан на чистом JavaScript и готов для использования в продакшене.

## Возможности

- **UTM-параметры:** Автоматически заполняет скрытые поля формы данными из URL.
- **Чистый URL:** Вычисляет адрес страницы без UTM-параметров и записывает его в скрытое поле.
- **Имя формы:** Извлекает имя формы для дальнейшей обработки.
- **Google Client ID:** Получает Client ID из cookie `_ga` с обработкой ошибок при неожиданном формате.
- **Отсутствие зависимостей:** Скрипт работает без использования сторонних библиотек.

## Установка

### 1. Добавьте скрытые поля в вашу форму

Вставьте следующие скрытые поля внутрь каждой формы, которую необходимо обработать:

```html
<!-- UTM параметры -->
<input type="hidden" class="utm_source" name="utm_source">
<input type="hidden" class="utm_medium" name="utm_medium">
<input type="hidden" class="utm_campaign" name="utm_campaign">
<input type="hidden" class="utm_content" name="utm_content">
<input type="hidden" class="utm_term" name="utm_term">

<!-- Click ID параметры -->
<input type="hidden" class="gclid" name="gclid">
<input type="hidden" class="fbclid" name="fbclid">
<input type="hidden" class="ttclid" name="ttclid">
<input type="hidden" class="yclid" name="yclid">

<!-- Facebook параметры -->
<input type="hidden" class="fbp" name="fbp">
<input type="hidden" class="fbc" name="fbc">

<!-- Системные параметры -->
<input type="hidden" class="page_url" name="page_url">
<input type="hidden" class="form_name" name="form_name">
<input type="hidden" class="referer" name="referer">
<input type="hidden" class="user_agent" name="user_agent">
<input type="hidden" class="timestamp" name="timestamp">

<!-- Client ID из разных источников -->
<input type="hidden" class="google_client_id" name="google_client_id">
<input type="hidden" class="yandex_client_id" name="yandex_client_id">
<input type="hidden" class="facebook_browser_id" name="facebook_browser_id">
```

### 2. Добавьте JavaScript-код
Разместите следующий скрипт в конце HTML-документа
```
<script src="https://cdn.jsdelivr.net/gh/x3-labs/wv-code/wv-utm/utm.min.js"></script>
```
