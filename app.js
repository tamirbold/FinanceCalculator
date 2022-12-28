//Display controller
var uiController = (function () {
  var DOMstrings = {
    inputType: ".add__type",
    inputDescription: ".add__description",
    inputValue: ".add__value",
    addBtn: ".add__btn",
    incomeList: ".income__list",
    expenseList: ".expenses__list",
    budgetLabel: ".budget__value",
    incomeLabel: ".budget__income--value",
    expenseLabel: ".budget__expenses--value",
    percentageLabel: ".budget__expenses--percentage",
  };
  return {
    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    getDOMstrings: function () {
      return DOMstrings;
    },

    clearFields: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputDescription + ", " + DOMstrings.inputValue
      );

      //Convert List to Array.
      var fieldsArr = Array.prototype.slice.call(fields);

      fieldsArr.forEach(function (el, index, array) {
        el.value = "";
      });

      // for (var i = 0; i < fieldsArr.length; i++) {
      //   fieldsArr[i].value = "";
      // }

      //Utga oruulsanii daraa cursor-g description deer bairluulah.
      fieldsArr[0].focus();
    },

    showBudget: function (budget) {
      document.querySelector(DOMstrings.budgetLabel).textContent =
        budget.budget;
      document.querySelector(DOMstrings.incomeLabel).textContent =
        budget.totalInc;
      document.querySelector(DOMstrings.expenseLabel).textContent =
        budget.totalExp;
      if (budget.percent !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          budget.percent + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          budget.percent;
      }
    },

    addListItem: function (item, type) {
      //Orlogog zarlagagiin elementiig aguulsan html-g beltgene.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Ter html dotroo orlogo zarlagiin utguudiig Replace ashiglaj uurchilnu.
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", item.value);

      //Beltgesen html-ee DOM ruu hiij ugnu.
      document.querySelector(list).insertAdjacentHTML("beforeend", html);
    },
  };
})();

//Finance Controller
var financeController = (function () {
  //private
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };
  //private
  var Expesnse = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  var calculateTotal = function (type) {
    var sum = 0;
    data.items[type].forEach(function (el) {
      sum = sum + el.value;
    });

    data.totals[type] = sum;
  };
  //private data
  var data = {
    items: {
      inc: [],
      exp: [],
    },
    totals: {
      inc: 0,
      exp: 0,
    },

    butget: 0,

    percent: 0,
  };
  return {
    calculateBudget: function () {
      //Niit orlogiin niilberoog bodno
      calculateTotal("inc");
      //Niit zarlagiin niilberoog bodno
      calculateTotal("exp");
      //Tusviig shineer tootsoolno
      data.budget = data.totals.inc - data.totals.exp;
      //Orlogo zarlagiin huviig bodno
      data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
    },

    getBudget: function () {
      return {
        budget: data.budget,
        percent: data.percent,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    addItem: function (type, desc, val) {
      var item, id;

      if (data.items[type].length === 0) {
        id = 1;
      } else {
        id = data.items[type][data.items[type].length - 1].id + 1;
      }

      if (type === "inc") {
        item = new Income(id, desc, val);
      } else {
        item = new Expesnse(id, desc, val);
      }

      data.items[type].push(item);

      return item;
    },
    seeData: function () {
      return data;
    },
  };
})();

//Connect Controller
var appController = (function (uiController, financeController) {
  var ctrlAddItem = function () {
    //1. Oruulah ugugdliig delgetsees olj avna
    var input = uiController.getInput();

    if (input.description !== "" && input.inputValue !== "") {
      //2. Olj avsan ugugdluudee sanhuugiin controllert damjuulj tend hadgalna
      var item = financeController.addItem(
        input.type,
        input.description,
        input.value
      );

      //3. Olj avsan ugugdluudee web deeree tohiroh hesegt ni gargana.
      uiController.addListItem(item, input.type);
      uiController.clearFields();

      //4. Tusviig tootsooloh
      financeController.calculateBudget();

      //5.Tusviin uldegdel
      var budget = financeController.getBudget();

      //6. Tusviin tootsoog delgetsend gargana
      uiController.showBudget(budget);
    }
  };

  var setupEventListener = function () {
    var DOM = uiController.getDOMstrings();

    document.querySelector(DOM.addBtn).addEventListener("click", function () {
      ctrlAddItem();
    });

    document.addEventListener("keypress", function (event) {
      if (KeyboardEvent.keyCode === 13 || UIEvent.which === 13) {
        ctrlAddItem();
      }
    });
  };
  return {
    init: function () {
      console.log("Application started");
      uiController.showBudget({
        budget: 0,
        percent: 0,
        totalInc: 0,
        totalExp: 0,
      });
      setupEventListener();
    },
  };
})(uiController, financeController);

appController.init();
