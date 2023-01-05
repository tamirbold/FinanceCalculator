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
    containerDiv: ".container",
    expensePercentageLabel: ".item__percentage",
    dateLabel: ".budget__title--month",
  };

  var NodeListForeach = function (list, callback) {
    for (var i = 0; i < list.length; i++) {
      callback(list[i], i);
    }
  };

  var formatAmount = function (number, type) {
    number = "" + number;
    var x = number.split("").reverse().join("");

    var y = "";
    var count = 1;

    for (var i = 0; i < x.length; i++) {
      y = y + x[i];

      if (count % 3 === 0) {
        y = y + ",";
      }

      count++;
    }
    var z = y.split("").reverse().join("");

    if (z[0] === ",") {
      z = z.substring(1, z.length - 1);
    }

    if (type === "inc") {
      z = "+ " + z;
    } else {
      z = "- " + z;
    }

    return z;
  };

  return {
    displayDate: function () {
      var today = new Date();

      document.querySelector(DOMstrings.dateLabel).textContent =
        today.getMonth() + today.getFullYear();
    },

    changeType: function () {
      var fields = document.querySelectorAll(
        DOMstrings.inputType +
          ", " +
          DOMstrings.inputDescription +
          ", " +
          DOMstrings.inputValue
      );

      NodeListForeach(fields, function (el) {
        el.classList.toggle("red-focus");
      });

      document.querySelector(DOMstrings.addBtn).classList.toggle("red");
    },

    getInput: function () {
      return {
        type: document.querySelector(DOMstrings.inputType).value,
        description: document.querySelector(DOMstrings.inputDescription).value,
        value: parseInt(document.querySelector(DOMstrings.inputValue).value),
      };
    },

    displayPercentages: function (allPersentages) {
      //Zarlagiin NodeList-g oloh.
      var elements = document.querySelectorAll(
        DOMstrings.expensePercentageLabel
      );

      //Element bolgonii huvid zarlagiin huviig array-s avch oruulna.
      NodeListForeach(elements, function (el, index) {
        el.textContent = allPersentages[index];
      });
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
      var type;
      if (budget.budget > 0) {
        type = "inc";
      } else {
        type = "exp";
      }

      document.querySelector(DOMstrings.budgetLabel).textContent = formatAmount(
        budget.budget,
        type
      );
      document.querySelector(DOMstrings.incomeLabel).textContent = formatAmount(
        budget.totalInc,
        "inc"
      );
      document.querySelector(DOMstrings.expenseLabel).textContent =
        formatAmount(budget.totalExp, "exp");
      if (budget.percent !== 0) {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          budget.percent + "%";
      } else {
        document.querySelector(DOMstrings.percentageLabel).textContent =
          budget.percent;
      }
    },

    deleteListItem: function (id) {
      var el = document.getElementById(id);
      el.parentNode.removeChild(el);
    },

    addListItem: function (item, type) {
      //Orlogog zarlagagiin elementiig aguulsan html-g beltgene.
      var html, list;
      if (type === "inc") {
        list = DOMstrings.incomeList;
        html =
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">$$DESCRIPTION$$</div><div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__delete">            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div> </div></div>';
      } else {
        list = DOMstrings.expenseList;
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">$$DESCRIPTION$$</div>          <div class="right clearfix"><div class="item__value">$$VALUE$$</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn">                <i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      //Ter html dotroo orlogo zarlagiin utguudiig Replace ashiglaj uurchilnu.
      html = html.replace("%id%", item.id);
      html = html.replace("$$DESCRIPTION$$", item.description);
      html = html.replace("$$VALUE$$", formatAmount(item.value, type));

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
    this.percentage = -1;
  };

  Expesnse.prototype.calcPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100) + "%";
    } else {
      this.percentage = 0;
    }
  };

  Expesnse.prototype.getPercentage = function () {
    return this.percentage;
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
      //Orlogo zarlagiin huviig bodno.
      if (data.totals.inc) {
        data.percent = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percent = 0;
      }
    },

    calculatePercentages: function () {
      data.items.exp.forEach(function (el) {
        el.calcPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      var allPersentages = data.items.exp.map(function (el) {
        return el.getPercentage();
      });
      return allPersentages;
    },

    getBudget: function () {
      return {
        budget: data.budget,
        percent: data.percent,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
      };
    },

    deleteItem: function (type, id) {
      var ids = data.items[type].map(function (el) {
        return el.id;
      });

      var index = ids.indexOf(id);
      if (index !== -1) {
        data.items[type].splice(index, 1);
      }
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

      //Tusviig shineer tootsooleed delgetsend uzuulne.
      updateBudget();
    }
  };
  var updateBudget = function () {
    //4. Tusviig tootsooloh
    financeController.calculateBudget();

    //5.Tusviin uldegdel
    var budget = financeController.getBudget();

    //6. Tusviin tootsoog delgetsend gargana
    uiController.showBudget(budget);

    //7. Elementuudiin huviig tootsoolno.
    financeController.calculatePercentages();

    //8. Elementuudiin huviig huleej avna.
    var allPersentages = financeController.getPercentages();

    //9. Edgeer huviig delgetsend gargana.
    uiController.displayPercentages(allPersentages);
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

    document
      .querySelector(DOM.inputType)
      .addEventListener("change", uiController.changeType);
    document
      .querySelector(DOM.containerDiv)
      .addEventListener("click", function (event) {
        var id = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (id) {
          //inc-2
          var arr = id.split("-");
          var type = arr[0];
          var itemId = parseInt(arr[1]);

          //1.Sankhuugiin module-s type, id ashiglaad ustgana
          financeController.deleteItem(type, itemId);

          //2. Delgets deerees ene element-g ustgana
          uiController.deleteListItem(id);

          //3.Uldegdel tootsoog shinechilj haruulna.
          //Tusviig shineer tootsooleed delgetsend uzuulne.
          updateBudget();
        }
      });
  };
  return {
    init: function () {
      console.log("Application started");
      uiController.displayDate();
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
