document.addEventListener("DOMContentLoaded", function() {
  // Функция для получения Client ID из cookie _ga с обработкой ошибок
  function getGoogleClientId() {
    try {
      var cookie = document.cookie;
      var match = cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
      if (match && match[1]) {
        return match[1];
      } else {
        console.warn("Cookie _ga не найден или имеет неожиданный формат:", cookie);
        return null;
      }
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
  
  // Обрабатываем все формы на странице
  document.querySelectorAll("form").forEach(form => {
    utmParameters.forEach(param => {
      var input = form.querySelector("." + param);
      if (input && input.value === "") { // Заполняем, только если value пустое
        input.value = searchParams.get(param) || "";
      }
    });

    // Заполняем URL страницы, если поле пустое
    var pageUrlInput = form.querySelector(".page_url");
    if (pageUrlInput && pageUrlInput.value === "") {
      pageUrlInput.value = pageUrl;
    }

    // Заполняем имя формы из data-name, если поле пустое
    var formNameInput = form.querySelector(".form_name");
    if (formNameInput && formNameInput.value === "") {
      var formName = form.getAttribute("data-name") || form.getAttribute("name") || form.id || "";
      formNameInput.value = formName;
    }

    // Заполняем Client ID, если он доступен и поле пустое
    var clientIdInput = form.querySelector(".google_client_id");
    if (clientIdInput && clientIdInput.value === "" && clientId) {
      clientIdInput.value = clientId;
    }
  });
});
