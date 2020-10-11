class Calculator {
  constructor() {
    this.buttons = document.querySelectorAll(".button");
    this.calculatorScreen = document.querySelector(".calculator-screen");
    this.calculatorButtons = document.querySelector(".calculator-buttons");
    this.screenFigures = document.querySelector(".screen-figures");
    this.numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, ","];
    this.functions_array = ["*", "-", "+", "/"];
    //just to track whether i pressed + before
    //i know i could do it other way
    //but it works
    this.first_number_add = null;
    this.result = false;
  }
  screenDisplay(toDisplayNumber) {
    const toDisplay = "" + toDisplayNumber;
    if (toDisplay.length >= 10) {
      this.screenFigures.innerText = toDisplay.slice(0, 6) + "...";
      this.screenFigures.addEventListener("click", () => {
        this.calculatorScreen.classList.toggle("big");
        this.calculatorButtons.classList.toggle("hidden");
        this.calculatorScreen.style.cursor = "pointer";
        if (this.calculatorButtons.classList.contains("hidden")) {
          this.screenFigures.innerText = toDisplay;
        } else {
          this.screenFigures.innerText = toDisplay.slice(0, 6) + "...";
        }
      });
    } else {
      this.screenFigures.innerText = toDisplay;
    }
  }
  //fraction is to use , only once for floats
  fraction(key) {
    if (this.numbers.length == 11) {
      if (this.screenFigures.innerText.includes(",")) {
        this.numbers.pop();
      }
    } else {
      if (!this.numbers.includes(",")) {
        this.numbers.push(",");
      }
    }
  }

  processNumbers(number) {
    //doing stuff with numbers
    if (this.screenFigures.innerText == 0 || this.result == true) {
      if (number != ",") {
        this.screenFigures.innerText = number;
        this.result = false;
      } else {
        this.screenFigures.innerText += ",";
        this.fraction();
      }
    } else {
      this.screenFigures.innerText += number;
    }
  }

  //to turn String into float or int
  treatString(string_number) {
    if (string_number.includes(",")) {
      return parseFloat(string_number.replace(",", "."));
    } else {
      return parseInt(string_number);
    }
  }

  add(first, second, key) {
    const first_n = this.treatString(first);
    const second_n = this.treatString(second);
    if (key == "*") {
      this.screenDisplay(first_n * second_n);
    }
    if (key == "-") {
      this.screenDisplay(first_n - second_n);
    }
    if (key == "/") {
      this.screenDisplay(first_n / second_n);
    }
    if (key == "+") {
      this.screenDisplay(first_n + second_n);
    }
    this.first_number_add = null;
    this.result = true;
  }

  processFunctionKeys(key) {
    if (key != ",") {
      if (key == "AC") {
        this.screenFigures.innerText = 0;
        this.fraction();
        this.first_number_add = null;
        const allSelected = [...document.querySelectorAll(".selected")];
        allSelected.forEach((selection) => {
          selection.classList.remove("selected");
        });
      }
      if (key == "+/-") {
        if (this.screenFigures.innerText != 0) {
          this.screenDisplay(
            ("" + this.treatString(this.screenFigures.innerText) * -1).replace(
              ".",
              ","
            )
          );
        }
      }
      if (key == "+" || key == "-" || key == "*" || key == "/") {
        if (this.first_number_add == null) {
          this.first_number_add = this.screenFigures.innerText;
          this.screenFigures.innerText = 0;
        } else {
          this.second_number_add = this.screenFigures.innerText;
          this.add(this.first_number_add, this.second_number_add, key);
        }
      }
      if (key == "%") {
        const percentageNumber =
          this.treatString(this.screenFigures.innerText) / 100;
        const percentageString = "" + percentageNumber;
        if (percentageString.includes(".")) {
          this.screenDisplay(percentageString.replace(".", ","));
        } else {
          this.screenDisplay(percentageString);
        }
      }
      if (key == "=") {
        console.log("ass");
        const allSelected = [...document.querySelectorAll(".selected")];
        if (allSelected.length > 0) {
          const selection = allSelected[0].innerText;
          this.add(
            this.first_number_add,
            this.screenFigures.innerText,
            selection
          );
          allSelected.forEach((selection) => {
            selection.classList.remove("selected");
          });
        } else {
          this.screenDisplay(this.screenFigures.innerText);
          allSelected.forEach((selection) => {
            selection.classList.remove("selected");
          });
        }
      }
    }
  }

  treatClicks(target) {
    if (
      target.innerText in this.numbers ||
      target.innerText == this.numbers[10]
    ) {
      //if we press numbers, we have to concatenate them and display them as a string
      //and that's what process numbers does
      this.processNumbers(target.innerText);
    } else {
      this.processFunctionKeys(target.innerText);
      //to highlight active button - one at a time
      if (this.functions_array.includes(target.innerText)) {
        const allSelected = [...document.querySelectorAll(".selected")];
        const included = allSelected.includes(target);
        console.log(included);
        allSelected.forEach((button) => {
          button.classList.remove("selected");
          console.log(button);
        });
        if (!included) {
          target.classList.add("selected");
        } else {
          console.log("");
        }
      }
    }
  }
}

const c = new Calculator();

c.buttons.forEach((button) => {
  button.addEventListener("click", function () {
    c.treatClicks(button);
  });
});
