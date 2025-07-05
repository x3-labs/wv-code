# Обработчик форм с UTM-метками и Google Client ID

Система автоматического сбора и передачи параметров трекинга для форм в Webflow. Скрипт автоматически извлекает UTM-параметры, Click ID, Client ID из различных источников аналитики и заполняет скрытые поля форм

## Отслеживаемые параметры

### UTM-параметры
utm_source - источник трафика
utm_medium - канал трафика
utm_campaign - название кампании
utm_content - контент рекламы
utm_term - ключевые слова

### Click ID параметры
gclid - Google Click ID
fbclid - Facebook Click ID
ttclid - TikTok Click ID
yclid - Yandex Click ID

### Facebook параметры
fbp - Facebook Browser ID
fbc - Facebook Click ID

### Системные параметры
page_url - URL страницы без трекинговых параметров
form_name - имя формы
referer - реферер
user_agent - User Agent браузера
timestamp - время отправки формы

### Client ID из аналитики
google_client_id - из Google Analytics cookie _ga
yandex_client_id - из Yandex Metrica cookie _ym_uid
facebook_browser_id - из Facebook Pixel cookie _fbp


## Принцип работы
### 1. Инициализация при загрузке страницы
Скрипт извлекает параметры из URL
Получает Client ID из cookies различных систем аналитики
Заполняет скрытые поля во всех формах на странице

### 2. Дополнительное заполнение при отправке
Перед отправкой формы поля заполняются повторно
Обновляется timestamp для точного времени отправки

### 3. Обработка ошибок
Все функции извлечения данных обернуты в try-catch
При ошибках в консоль выводятся информативные сообщения
Скрипт продолжает работу даже при частичных ошибках


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


## Особенности для Webflow
### Идентификация форм
Скрипт определяет имя формы в следующем порядке:
Атрибут data-name
Атрибут name
Атрибут id
Пустая строка, если ничего не найдено

### Очистка URL
Из page_url автоматически удаляются все трекинговые параметры для получения чистого URL страницы.

### Совместимость
Браузеры: IE11+, Chrome, Firefox, Safari, Edge
Webflow: Полная совместимость
Системы аналитики: Google Analytics, Yandex Metrica, Facebook Pixel
Рекламные платформы: Google Ads, Facebook Ads, TikTok Ads, Yandex.Direct


## Обновление скрипта в jsDelivr

Загрузите обновленный файл в GitHub репозиторий x3-labs/wv-code
Создайте новый релиз (тег) в GitHub для принудительного обновления кеша
Очистите кеш jsDelivr по URL: https://purge.jsdelivr.net/gh/x3-labs/wv-code/wv-utm/utm.min.js
Альтернативно используйте версионирование: https://cdn.jsdelivr.net/gh/x3-labs/wv-code@version/wv-utm/utm.min.js
