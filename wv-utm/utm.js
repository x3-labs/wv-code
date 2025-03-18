document.addEventListener("DOMContentLoaded", function() {
  // Функция для получения Client ID из cookie _ga с обработкой ошибок
  function getGoogleClientId() {
    try {
      var cookie = document.cookie;
      // Ищем cookie _ga в формате GAx.x.number.number
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
  utmParameters.forEach(function(param) {
    urlObj.searchParams.delete(param);
  });
  var pageUrl = urlObj.href;
  
  // Получаем Client ID
  var clientId = getGoogleClientId();
  
  // Обрабатываем все формы на странице
  var forms = document.querySelectorAll("form");
  forms.forEach(function(form) {
    // Заполняем UTM-параметры
    utmParameters.forEach(function(param) {
      if (searchParams.has(param)) {
        var input = form.querySelector("." + param);
        if (input) {
          input.value = searchParams.get(param);
        }
      }
    });
    
    // Заполняем URL страницы
    var pageUrlInput = form.querySelector(".page_url");
    if (pageUrlInput) {
      pageUrlInput.value = pageUrl;
    }
    
    // Заполняем имя формы, используя значение data-name
    var formNameInput = form.querySelector(".form_name");
    if (formNameInput) {
      var formName = form.getAttribute("data-name") || form.getAttribute("name") || form.id || "unnamed_form";
      formNameInput.value = formName;
    }
    
    // Заполняем Client ID, если он доступен
    var clientIdInput = form.querySelector(".google_client_id");
    if (clientIdInput && clientId) {
      clientIdInput.value = clientId;
    }
  });
});
