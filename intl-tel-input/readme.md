# Маска номера телефона

[intl-tel-input](https://intl-tel-input.com/)
[GitHub](https://github.com/jackocnr/intl-tel-input)
[Docs](https://intl-tel-input.com/storybook/)

```css
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/css/intlTelInput.css">
<style>
.iti__country-name {
  color: #000000; /* Замените #your-color на нужный цвет */
}
.intl-tel-input .country-list .search-box input[type="text"] {
    color: #000000;
}
.iti__selected-flag {
border-radius: 100px 0px 0px 100px;
}
</style>
```
```
<script src="https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/intlTelInput.min.js"></script>
<script>
  $(document).ready(function() {
    $('input[type="tel"]').each(function() {
      var input = this;
      var iti = window.intlTelInput(input, {
        nationalMode: false,
        showSelectedDialCode: true,
        separateDialCode: true,
        countrySearch: false,
        // initialCountry: "ua",
        utilsScript: "https://cdn.jsdelivr.net/npm/intl-tel-input@19.5.4/build/js/utils.js"
      });

      $.get("https://ipinfo.io", function(response) {
        var countryCode = response.country;
        iti.setCountry(countryCode);
      }, "jsonp");

      input.addEventListener('change', formatPhoneNumber);
      input.addEventListener('keyup', formatPhoneNumber);

      function formatPhoneNumber() {
        var formattedNumber = iti.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);
        input.value = formattedNumber;
      }

      var form = $(input).closest('form');
      form.submit(function() {
        var formattedNumber = iti.getNumber(intlTelInputUtils.numberFormat.INTERNATIONAL);
        input.value = formattedNumber;
      });
    });
  });
</script>
```
