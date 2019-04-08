const description = document.querySelector("#description");
const amount = document.querySelector("#amount");
const select = document.querySelector("select");
const income = document.querySelector("#income");
const expense = document.querySelector("#expense");
const add = document.querySelector(".add");
const form = document.querySelector("form");
const wrapper = document.querySelectorAll(".wrapper");
const incomeWrapper = document.querySelector(".income-wrapper");
const expenseWrapper = document.querySelector(".expense-wrapper");
const result = document.querySelector(".result");
const reset = document.querySelector(".reset");

const displayDateTime = () => {
  let now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth() + 1;
  let date = now.getDate();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes;
  }
  let dateMonthYear = date + "." + month + "." + year;
  let time = hours + ":" + minutes;
  let fullTime = dateMonthYear + " " + time;
  return fullTime;
};

const createList = (id, title, num, time, index) => {
  let listItem = `<li class="list-item">
      <span>${time}</span>
      <span>${title}</span>
      <span>${Number(num).toLocaleString()} €</span>
      <a><button class="delete" id="${index}">Delete</button></a>
    </li>
    `;
  if (id == "Income") {
    incomeWrapper.insertAdjacentHTML("beforeend", listItem);
  } else if (id == "Expense") {
    expenseWrapper.insertAdjacentHTML("beforeend", listItem);
  };
};

// Get data first time run
// check if there is data stored in localStorage or not, if not, return the empty array so the app still work.
function getData() {
  const data = JSON.parse(localStorage.getItem("storedData"));
  if (data) {
    return data;
  } else {
    return [];
  }
}

// UI - create the data stored from localStorage
function generateData() {
  incomeWrapper.innerHTML = "";
  expenseWrapper.innerHTML = "";
  const data = JSON.parse(localStorage.getItem("storedData"));
  if (data) {
    data.forEach((itemData, i) => {
      createList(itemData.id, itemData.title, itemData.num, itemData.time, i);
    });
  }
}
generateData();

form.addEventListener("submit", function (event) {
  event.preventDefault();
  // Capitalize the description input
  let formatTitle =
    description.value.charAt(0).toUpperCase() + description.value.slice(1);

  // create data object
  let data = {
    id: select.value,
    title: formatTitle,
    num: amount.value,
    time: displayDateTime(),
  };

  // Destructuring
  let {
    title,
    num,
    time
  } = data;

  // Store to localStorage
  let storedData = getData();
  // create UI after getData & add new data
  createList(data.id, title, num, time, storedData.length);
  storedData.push(data);
  const storedDataStringify = JSON.stringify(storedData);
  localStorage.setItem("storedData", storedDataStringify);

  // Update the balance
  balance();

  // UI - Reset input
  description.value = "";
  amount.value = "";
  description.focus();
});

function balance() {
  const storedData = getData(); // condition check.
  const getBalance = storedData.reduce((total, data) => {
    const number = parseFloat(data.num);
    if (data.id === "Income") {
      return total + number;
    } else {
      return total - number;
    }
  }, 0);
  result.innerHTML = `${Number(getBalance).toLocaleString()} €`;
  if (getBalance < 0) {
    result.style.color = "red";
  } else {
    result.style.color = "white";
  }
}
balance();

// clean all the data in localStorage & UI
reset.addEventListener("click", function () {
  localStorage.clear();
  generateData();
  result.innerHTML = `0 €`;
});

// CUSTOM FORM VALIDATION

// function showError(color, textContent) {
//   const error = document.querySelector('.error-message');
//   error.textContent = textContent;
//   descriptionInput.style.borderColor = color;
//   amountInput.style.borderColor = color;
// }
// showError('red', 'Please fill the required fields');

// setTimeout(function () {
//   const error = document.querySelector('.error-message');
//   error.textContent = '';
//   descriptionInput.style.borderColor = 'grey';
//   amountInput.style.borderColor = 'grey';
// }, 2500)

// delete specific data
wrapper.forEach(wrapp => {
  wrapp.addEventListener("click", function (e) {
    if (e.target.parentElement.parentElement.classList.contains("list-item")) {
      // remove List item UI
      e.target.parentElement.parentElement.remove();
      const storedData = getData();
      storedData.splice(e.target.id, 1);

      const storedDataStringify = JSON.stringify(storedData);
      localStorage.setItem("storedData", storedDataStringify);
      balance();
      // need to update the index by generate again with new localStorage
      generateData();
    }
  });
});

// if (description === "" || amount === "") {
// }