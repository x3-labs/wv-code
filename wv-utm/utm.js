document.addEventListener("DOMContentLoaded", function() {
  // Функция для получения Client ID из cookie _ga с обработкой ошибок
  function getGoogleClientId() {
    try {
      var cookie = document.cookie;
      var match = cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Ошибка при извлечении Google Client ID:", error);
      return null;
    }
  }

  // Получаем параметры из URL
  var searchParams = new URLSearchParams(window.location.search);
  
  // Список UTM-параметров
  var utmParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  
  // Вычисляем URL без UTM-параметров
  var urlObj = new URL(window.location.href);
  utmParameters.forEach(param => urlObj.searchParams.delete(param));
  var pageUrl = urlObj.href;

  // Получаем Client ID
  var clientId = getGoogleClientId();

  // Функция для заполнения скрытых полей
  function fillHiddenFields(form) {
    utmParameters.forEach(param => {
      var input = form.querySelector("." + param);
      if (input) {
        input.value = searchParams.get(param) || "";
      }
    });

    var pageUrlInput = form.querySelector(".page_url");
    if (pageUrlInput) {
      pageUrlInput.value = pageUrl;
    }

    var formNameInput = form.querySelector(".form_name");
    if (formNameInput) {
      var formName = form.getAttribute("data-name") || form.getAttribute("name") || form.id || "";
      formNameInput.value = formName;
    }

    var clientIdInput = form.querySelector(".google_client_id");
    if (clientIdInput) {
      clientIdInput.value = clientId || "";
    }
  }

  // Заполняем скрытые поля при загрузке
  document.querySelectorAll("form").forEach(fillHiddenFields);

  // Дополнительно заполняем скрытые поля перед отправкой формы
  document.addEventListener("submit", function(event) {
    if (event.target.tagName === "FORM") {
      fillHiddenFields(event.target);
    }
  }, true);
});
