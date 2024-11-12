# wv-webhook
Скрипт блокирует стандартную отправку данных из форм Webflow

- В поле Action указываем URL Webhook, куда будут отправляться данные
- Устанавливаем метод POST для корректной передачи данных на Webhook
- Добавляем скрипт перед закрывающем тегом </body>


```
<script src="https://cdn.jsdelivr.net/gh/ix3-labs/wv-code@f8a7513a79aa35b6c8ba5112a79466f2da705cb1/wv-webhook/webhook.js"></script>
```
