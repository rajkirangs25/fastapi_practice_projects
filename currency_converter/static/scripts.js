`use strict`;

const convert_btn = document.querySelector(".convert_btn");
const ip_textbox = document.querySelector(".ip_currency");
const op_text = document.querySelector(".op_currency");
const from_currency_button = document.querySelector(".from_currency_btn");
const to_currency_button = document.querySelector(".to_currency_btn");
let selected_input_currency;
let selected_output_currency;

function currency_dropdown_populate(button, selected_currency, dropdown_class) {
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
          `${selected_currency}`.textContent = code;
        });

        li.appendChild(a);
        dropdown.appendChild(li);
      });
    })
    .catch((error) => console.error("error loading JSON:", error));
}

currency_dropdown_populate(
  from_currency_button,
  selected_input_currency,
  ".from_currency_dropdown"
);

currency_dropdown_populate(
  to_currency_button,
  selected_output_currency,
  ".to_currency_dropdown"
);

convert_btn.addEventListener("click", async () => {
  const ip_text = ip_textbox.value;

  const convert_res = await fetch(`http://127.0.0.1:8000/convert/usd/inr`);
  const convert_data = await convert_res.json();

  const rate_res = await fetch(`http://127.0.0.1:8000/rates/usd`);
  const rate_data = await rate_res.json();

  let converted_currency = ip_text * convert_data.rate;
  op_text.innerHTML = `<b>INR rate against USD is</b> ${converted_currency.toFixed(
    2
  )}`;

  // console.log(selected_input_currency);
});
