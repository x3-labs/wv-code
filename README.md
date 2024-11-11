# wv-code

## wv-webhook
Скрипт блокирует стандартную отправку данных из форм Webflow

- В поле Action указываем URL Webhook, куда будут отправляться данные
- Устанавливаем метод POST для корректной передачи данных на Webhook
- Добавляем скрипт перед закрывающем тегом </body>

<script src="https://cdn.jsdelivr.net/gh/ix3-labs/wv-webhook@ac52263951116299659415dd8b21fad77a95b7bc/wv-webhook.js
"></script>
