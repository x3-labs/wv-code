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
  
  // Функция для получения Yandex Client ID из cookie _ym_uid
  function getYandexClientId() {
    try {
      var cookie = document.cookie;
      var match = cookie.match(/_ym_uid=(\d+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Ошибка при извлечении Yandex Client ID:", error);
      return null;
    }
  }
  
  // Функция для получения Facebook Browser ID из cookie _fbp
  function getFacebookBrowserId() {
    try {
      var cookie = document.cookie;
      var match = cookie.match(/_fbp=([^;]+)/);
      return match ? match[1] : null;
    } catch (error) {
      console.error("Ошибка при извлечении Facebook Browser ID:", error);
      return null;
    }
  }
  
  // Получаем параметры из URL
  var searchParams = new URLSearchParams(window.location.search);
  
  // Список всех параметров для сквозной аналитики
  var utmParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  var clickIdParameters = ["gclid", "fbclid", "ttclid", "yclid"];
  var facebookParameters = ["fbp", "fbc"];
  var additionalParameters = [];
  var allParameters = utmParameters.concat(clickIdParameters, facebookParameters, additionalParameters);
  
  // Вычисляем URL без трекинговых параметров
  var urlObj = new URL(window.location.href);
  allParameters.forEach(param => urlObj.searchParams.delete(param));
  var pageUrl = urlObj.href;
  
  // Получаем Client ID из разных источников
  var googleClientId = getGoogleClientId();
  var yandexClientId = getYandexClientId();
  var facebookBrowserId = getFacebookBrowserId();
  
  // Функция для заполнения скрытых полей
  function fillHiddenFields(form) {
    // Заполняем UTM-параметры
    utmParameters.forEach(param => {
      var input = form.querySelector("." + param);
      if (input) {
        input.value = searchParams.get(param) || "";
      }
    });
    
    // Заполняем Click ID параметры
    clickIdParameters.forEach(param => {
      var input = form.querySelector("." + param);
      if (input) {
        input.value = searchParams.get(param) || "";
      }
    });
    
    // Заполняем Facebook параметры
    facebookParameters.forEach(param => {
      var input = form.querySelector("." + param);
      if (input) {
        input.value = searchParams.get(param) || "";
      }
    });
    
    // Заполняем URL страницы
    var pageUrlInput = form.querySelector(".page_url");
    if (pageUrlInput) {
      pageUrlInput.value = pageUrl;
    }
    
    // Заполняем имя формы
    var formNameInput = form.querySelector(".form_name");
    if (formNameInput) {
      var formName = form.getAttribute("data-name") || form.getAttribute("name") || form.id || "";
      formNameInput.value = formName;
    }
    
    // Заполняем Client ID из разных источников
    var googleClientIdInput = form.querySelector(".google_client_id");
    if (googleClientIdInput) {
      googleClientIdInput.value = googleClientId || "";
    }
    
    var yandexClientIdInput = form.querySelector(".yandex_client_id");
    if (yandexClientIdInput) {
      yandexClientIdInput.value = yandexClientId || "";
    }
    
    var facebookBrowserIdInput = form.querySelector(".facebook_browser_id");
    if (facebookBrowserIdInput) {
      facebookBrowserIdInput.value = facebookBrowserId || "";
    }
    
    // Заполняем дополнительные поля
    var refererInput = form.querySelector(".referer");
    if (refererInput) {
      refererInput.value = document.referrer || "";
    }
    
    var userAgentInput = form.querySelector(".user_agent");
    if (userAgentInput) {
      userAgentInput.value = navigator.userAgent || "";
    }
    
    var timestampInput = form.querySelector(".timestamp");
    if (timestampInput) {
      timestampInput.value = new Date().toISOString();
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
