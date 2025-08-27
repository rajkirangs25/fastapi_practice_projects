"use strict";

const convert_btn = document.querySelector(".convert_btn");
const ip_textbox = document.querySelector(".ip_currency");
const op_text = document.querySelector(".op_currency");
const from_currency_button = document.querySelector(".from_currency_btn");
const to_currency_button = document.querySelector(".to_currency_btn");

function currency_dropdown_populate(button, dropdown_class) {
  fetch("/static/currency_codes.json")
    .then((response) => response.json())
    .then((data) => {
      let dropdown = document.querySelector(dropdown_class);

      Object.keys(data).forEach((code) => {
        let li = document.createElement("li");
        let a = document.createElement("a");

        a.href = "#";
        a.className = "dropdown-item";
        a.textContent = code;

        a.addEventListener("click", function (e) {
          e.preventDefault();
          button.textContent = code;
        });

        li.appendChild(a);
        dropdown.appendChild(li);
      });
    })
    .catch((error) => console.error("error loading JSON:", error));
}

currency_dropdown_populate(from_currency_button, ".from_currency_dropdown");

currency_dropdown_populate(to_currency_button, ".to_currency_dropdown");

convert_btn.addEventListener("click", async () => {
  const ip_text = ip_textbox.value;

  const from_selected_currency = from_currency_button.textContent;
  const to_selected_currency = to_currency_button.textContent;

  const convert_res = await fetch(
    `http://127.0.0.1:8000/convert/${from_selected_currency.toLowerCase()}/${to_selected_currency.toLowerCase()}`
  );
  const convert_data = await convert_res.json();

  let converted_currency = ip_text * convert_data.rate;
  op_text.innerHTML = `<b>${ip_text} ${from_selected_currency} in ${to_selected_currency} is</b> ${converted_currency.toFixed(
    2
  )}`;
});
