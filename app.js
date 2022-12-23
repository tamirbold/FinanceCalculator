//Display controller
var uiController = (function () {})();

//Finance Controller
var financeController = (function () {})();

//Connect Controller
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {};

  document.querySelector(".add__btn").addEventListener("click", function () {
    ctrlAddItem();
  });

  document.addEventListener("keypress", function (event) {
    ctrlAddItem();
  });
})(uiController, financeController);
