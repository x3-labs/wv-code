document.addEventListener("DOMContentLoaded", function() {
  // Конфигурация
  const STORAGE_KEY = "analytics_data";
  const STORAGE_EXPIRY = 30 * 24 * 60 * 60 * 1000; // 30 дней в миллисекундах
  const DEBUG_MODE = false; // Установите true для отладки
  
  // Функция для безопасного логирования
  function safeLog(message, data = null) {
    if (DEBUG_MODE && typeof console !== 'undefined') {
      try {
        if (data) {
          console.log(message, data);
        } else {
          console.log(message);
        }
      } catch (e) {
        // Игнорируем ошибки логирования
      }
    }
  }
  
  // Функция для получения Client ID из cookie _ga с обработкой ошибок
  function getGoogleClientId() {
    try {
      if (!document.cookie) return null;
      
      const cookie = document.cookie;
      const match = cookie.match(/_ga=GA\d\.\d\.(\d+\.\d+)/);
      return match ? match[1] : null;
    } catch (error) {
      safeLog("Ошибка при извлечении Google Client ID:", error);
      return null;
    }
  }
  
  // Функция для получения Yandex Client ID из cookie _ym_uid
  function getYandexClientId() {
    try {
      if (!document.cookie) return null;
      
      const cookie = document.cookie;
      const match = cookie.match(/_ym_uid=(\d+)/);
      return match ? match[1] : null;
    } catch (error) {
      safeLog("Ошибка при извлечении Yandex Client ID:", error);
      return null;
    }
  }
  
  // Функция для получения Facebook Browser ID из cookie _fbp
  function getFacebookBrowserId() {
    try {
      if (!document.cookie) return null;
      
      const cookie = document.cookie;
      const match = cookie.match(/_fbp=([^;]+)/);
      return match ? match[1] : null;
    } catch (error) {
      safeLog("Ошибка при извлечении Facebook Browser ID:", error);
      return null;
    }
  }
  
  // Функция для проверки поддержки localStorage
  function isLocalStorageSupported() {
    try {
      if (typeof Storage === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }
      
      const test = '__localStorage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      safeLog("localStorage не поддерживается:", e);
      return false;
    }
  }
  
  // Функция для сохранения данных в localStorage с expiry
  function saveToLocalStorage(key, data) {
    if (!isLocalStorageSupported()) return false;
    
    try {
      const item = {
        data: data,
        timestamp: Date.now(),
        expiry: Date.now() + STORAGE_EXPIRY
      };
      localStorage.setItem(key, JSON.stringify(item));
      return true;
    } catch (error) {
      safeLog("Ошибка при сохранении в localStorage:", error);
      // Попытка очистки localStorage при переполнении
      try {
        localStorage.clear();
        localStorage.setItem(key, JSON.stringify(item));
        return true;
      } catch (secondError) {
        safeLog("Критическая ошибка localStorage:", secondError);
        return false;
      }
    }
  }
  
  // Функция для получения данных из localStorage с проверкой expiry
  function getFromLocalStorage(key) {
    if (!isLocalStorageSupported()) return null;
    
    try {
      const item = localStorage.getItem(key);
      if (!item) return null;
      
      const parsedItem = JSON.parse(item);
      
      // Проверяем структуру данных
      if (!parsedItem || typeof parsedItem !== 'object' || !parsedItem.data) {
        localStorage.removeItem(key);
        return null;
      }
      
      // Проверяем, не истек ли срок действия
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        localStorage.removeItem(key);
        return null;
      }
      
      return parsedItem.data;
    } catch (error) {
      safeLog("Ошибка при получении из localStorage:", error);
      try {
        localStorage.removeItem(key);
      } catch (removeError) {
        safeLog("Ошибка при удалении поврежденного ключа:", removeError);
      }
      return null;
    }
  }
  
  // Функция для очистки устаревших данных из localStorage
  function cleanupLocalStorage() {
    if (!isLocalStorageSupported()) return;
    
    try {
      const item = localStorage.getItem(STORAGE_KEY);
      if (item) {
        const parsedItem = JSON.parse(item);
        if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
          localStorage.removeItem(STORAGE_KEY);
        }
      }
    } catch (error) {
      safeLog("Ошибка при очистке localStorage:", error);
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch (removeError) {
        safeLog("Ошибка при удалении поврежденного ключа:", removeError);
      }
    }
  }
  
  // Функция для безопасного получения URL параметров
  function getUrlParameters() {
    try {
      if (!window.location || !window.location.search) {
        return new URLSearchParams();
      }
      return new URLSearchParams(window.location.search);
    } catch (error) {
      safeLog("Ошибка при получении URL параметров:", error);
      return new URLSearchParams();
    }
  }
  
  // Функция для безопасного получения URL без параметров
  function getCleanPageUrl() {
    try {
      if (!window.location) return '';
      
      const urlObj = new URL(window.location.href);
      allParameters.forEach(param => {
        if (urlObj.searchParams.has(param)) {
          urlObj.searchParams.delete(param);
        }
      });
      return urlObj.href;
    } catch (error) {
      safeLog("Ошибка при получении чистого URL:", error);
      return window.location ? (window.location.origin + window.location.pathname) : '';
    }
  }
  
  // Получаем параметры из URL
  const searchParams = getUrlParameters();
  
  // Список всех параметров для сквозной аналитики
  const utmParameters = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_term"];
  const clickIdParameters = ["gclid", "fbclid", "ttclid", "yclid"];
  const facebookParameters = ["fbp", "fbc"];
  const additionalParameters = []; // Можно добавить дополнительные параметры
  const allParameters = [...utmParameters, ...clickIdParameters, ...facebookParameters, ...additionalParameters];
  
  // Вычисляем URL без трекинговых параметров
  const pageUrl = getCleanPageUrl();
  
  // Получаем Client ID из разных источников
  const googleClientId = getGoogleClientId();
  const yandexClientId = getYandexClientId();
  const facebookBrowserId = getFacebookBrowserId();
  
  // Очищаем устаревшие данные
  cleanupLocalStorage();
  
  // Получаем сохраненные данные из localStorage
  let savedData = getFromLocalStorage(STORAGE_KEY) || {};
  
  // Проверяем валидность savedData
  if (typeof savedData !== 'object' || savedData === null) {
    savedData = {};
  }
  
  // Собираем текущие параметры из URL
  const currentParams = {};
  let hasNewParams = false;
  
  allParameters.forEach(param => {
    try {
      const value = searchParams.get(param);
      if (value && value.trim() !== '') {
        currentParams[param] = value.trim();
        hasNewParams = true;
      }
    } catch (error) {
      safeLog(`Ошибка при получении параметра ${param}:`, error);
    }
  });
  
  // Если есть новые параметры, обновляем сохраненные данные
  if (hasNewParams) {
    try {
      // Обновляем только те параметры, которые пришли с новым визитом
      Object.assign(savedData, currentParams);
      
      // Обновляем информацию о первом визите
      if (!savedData.first_visit_timestamp) {
        savedData.first_visit_timestamp = new Date().toISOString();
        savedData.first_visit_page = pageUrl;
      }
      
      // Обновляем информацию о последнем визите
      savedData.last_visit_timestamp = new Date().toISOString();
      savedData.last_visit_page = pageUrl;
      
      // Сохраняем обновленные данные
      const saveResult = saveToLocalStorage(STORAGE_KEY, savedData);
      
      safeLog("Новые параметры сохранены:", {
        success: saveResult,
        params: currentParams
      });
    } catch (error) {
      safeLog("Ошибка при обработке новых параметров:", error);
    }
  }
  
  // Функция для получения итоговых данных (URL параметры приоритетнее localStorage)
  function getFinalData() {
    try {
      const finalData = Object.assign({}, savedData);
      
      // Параметры из URL имеют приоритет над сохраненными
      allParameters.forEach(param => {
        try {
          const urlValue = searchParams.get(param);
          if (urlValue && urlValue.trim() !== '') {
            finalData[param] = urlValue.trim();
          }
        } catch (error) {
          safeLog(`Ошибка при получении параметра ${param} из URL:`, error);
        }
      });
      
      return finalData;
    } catch (error) {
      safeLog("Ошибка при получении итоговых данных:", error);
      return {};
    }
  }
  
  // Функция для безопасного заполнения поля
  function fillField(form, selector, value) {
    try {
      const input = form.querySelector(selector);
      if (input) {
        input.value = value || "";
        return true;
      }
      return false;
    } catch (error) {
      safeLog(`Ошибка при заполнении поля ${selector}:`, error);
      return false;
    }
  }
  
  // Функция для заполнения скрытых полей
  function fillHiddenFields(form) {
    if (!form || typeof form.querySelector !== 'function') {
      safeLog("Неверный объект формы");
      return;
    }
    
    try {
      const finalData = getFinalData();
      
      // Заполняем UTM-параметры
      utmParameters.forEach(param => {
        fillField(form, `.${param}`, finalData[param]);
      });
      
      // Заполняем Click ID параметры
      clickIdParameters.forEach(param => {
        fillField(form, `.${param}`, finalData[param]);
      });
      
      // Заполняем Facebook параметры
      facebookParameters.forEach(param => {
        fillField(form, `.${param}`, finalData[param]);
      });
      
      // Заполняем URL страницы
      fillField(form, ".page_url", pageUrl);
      
      // Заполняем имя формы
      const formName = form.getAttribute("data-name") || 
                      form.getAttribute("name") || 
                      form.id || 
                      form.className || 
                      "";
      fillField(form, ".form_name", formName);
      
      // Заполняем Client ID из разных источников
      fillField(form, ".google_client_id", googleClientId);
      fillField(form, ".yandex_client_id", yandexClientId);
      fillField(form, ".facebook_browser_id", facebookBrowserId);
      
      // Заполняем дополнительные поля
      fillField(form, ".referer", document.referrer);
      fillField(form, ".user_agent", navigator.userAgent);
      fillField(form, ".timestamp", new Date().toISOString());
      
      // Дополнительные поля с информацией о визитах
      fillField(form, ".first_visit_timestamp", finalData.first_visit_timestamp);
      fillField(form, ".last_visit_timestamp", finalData.last_visit_timestamp);
      fillField(form, ".first_visit_page", finalData.first_visit_page);
      fillField(form, ".last_visit_page", finalData.last_visit_page);
      
    } catch (error) {
      safeLog("Ошибка при заполнении скрытых полей:", error);
    }
  }
  
  // Функция для безопасного получения всех форм
  function getAllForms() {
    try {
      if (!document.querySelectorAll) {
        return [];
      }
      return Array.from(document.querySelectorAll("form"));
    } catch (error) {
      safeLog("Ошибка при получении форм:", error);
      return [];
    }
  }
  
  // Заполняем скрытые поля при загрузке
  try {
    const forms = getAllForms();
    forms.forEach(form => {
      try {
        fillHiddenFields(form);
      } catch (error) {
        safeLog("Ошибка при заполнении формы:", error);
      }
    });
  } catch (error) {
    safeLog("Ошибка при инициализации форм:", error);
  }
  
  // Дополнительно заполняем скрытые поля перед отправкой формы
  try {
    document.addEventListener("submit", function(event) {
      try {
        if (event.target && event.target.tagName === "FORM") {
          fillHiddenFields(event.target);
        }
      } catch (error) {
        safeLog("Ошибка при обработке отправки формы:", error);
      }
    }, true);
  } catch (error) {
    safeLog("Ошибка при добавлении обработчика submit:", error);
  }
  
  // Функция для отладки (можно вызвать в консоли браузера)
  if (typeof window !== 'undefined') {
    window.getAnalyticsData = function() {
      try {
        return {
          current_url_params: Object.fromEntries(searchParams.entries()),
          saved_data: savedData,
          final_data: getFinalData(),
          google_client_id: googleClientId,
          yandex_client_id: yandexClientId,
          facebook_browser_id: facebookBrowserId,
          localStorage_supported: isLocalStorageSupported(),
          page_url: pageUrl
        };
      } catch (error) {
        safeLog("Ошибка в функции отладки:", error);
        return { error: "Ошибка получения данных" };
      }
    };
  }
  
  // Логирование для отладки
  safeLog("Analytics tracking initialized:", {
    hasNewParams: hasNewParams,
    savedData: savedData,
    localStorage_supported: isLocalStorageSupported(),
    page_url: pageUrl
  });
  
  // Дополнительная инициализация для динамически добавляемых форм
  if (typeof window !== 'undefined') {
    window.initAnalyticsForForm = function(form) {
      try {
        if (form && typeof form.querySelector === 'function') {
          fillHiddenFields(form);
          return true;
        }
        return false;
      } catch (error) {
        safeLog("Ошибка при инициализации формы:", error);
        return false;
      }
    };
  }
  
});
