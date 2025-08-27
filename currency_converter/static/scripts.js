"use strict";

const convert_btn = document.querySelector(".convert_btn");
const ip_textbox = document.querySelector(".ip_currency");
const op_text = document.querySelector(".op_currency");
const from_currency_button = document.querySelector(".from_currency_btn");
const to_currency_button = document.querySelector(".to_currency_btn");
let currencyData = null;

async function loadCurrencyData() {
  if (!currencyData) {
    const res = await fetch("/static/currency_codes.json");
    currencyData = await res.json();
  }
  return currencyData;
}

async function currency_dropdown_populate(button, dropdown_class) {
  const data = await loadCurrencyData();
  let dropdown = document.querySelector(dropdown_class);
  dropdown.innerHTML = "";

  Object.entries(data).forEach(([code, val]) => {
    let li = document.createElement("li");
    let a = document.createElement("a");

    a.href = "#";
    a.className = "dropdown-item";
    a.textContent = code;

    a.addEventListener("click", function (e) {
      e.preventDefault();
      button.textContent = code;
      button.dataset.currency = code;
      button.dataset.currency_name = val;
    });

    li.appendChild(a);
    dropdown.appendChild(li);
  });
}

currency_dropdown_populate(from_currency_button, ".from_currency_dropdown");

currency_dropdown_populate(to_currency_button, ".to_currency_dropdown");

convert_btn.addEventListener("click", async () => {
  const ip_text = ip_textbox.value;
  const from_selected_currency = from_currency_button.dataset.currency;
  const to_selected_currency = to_currency_button.dataset.currency;

  if (!ip_text || !from_selected_currency || !to_selected_currency) {
    op_text.innerHTML = "Please enter amount and select currencies.";
    return;
  }

  try {
    const convert_res = await fetch(
      `/convert/${from_selected_currency.toLowerCase()}/${to_selected_currency.toLowerCase()}`
    );
    if (!convert_res.ok) throw new Error("Conversion API failed");

    const convert_data = await convert_res.json();
    let converted_currency = ip_text * convert_data.rate;

    op_text.innerHTML = `<b>${ip_text} ${
      from_currency_button.dataset.currency_name
    }</b> in <b>${
      to_currency_button.dataset.currency_name
    }</b> is <b>${converted_currency.toFixed(2)}</b>`;
  } catch (err) {
    op_text.innerHTML = "Error fetching conversion rate.";
    console.error(err);
  }
});
