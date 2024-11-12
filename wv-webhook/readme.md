# wv-webhook
Скрипт блокирует стандартную отправку данных из форм Webflow

- В поле Action указываем URL Webhook, куда будут отправляться данные
- Устанавливаем метод POST для корректной передачи данных на Webhook
- Добавляем скрипт перед закрывающем тегом </body>


```
<script src="https://cdn.jsdelivr.net/gh/ix3-labs/wv-code@v1.0/wv-webhook/webhook.min.js"></script>
```
