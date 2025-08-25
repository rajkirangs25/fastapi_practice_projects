`use strict`;

const convert_btn = document.querySelector(".convert_btn");
const ip_textbox = document.querySelector(".ip_currency");
const op_text = document.querySelector(".op_currency");
const currency_button = document.querySelector(".currency_btn");
const cur_btn_items = document.querySelectorAll(
  ".currency_dropdown .dropdown-item"
);

fetch("/static/currency_codes.json")
  .then((response) => response.json())
  .then((data) => {
    let dropdown = document.querySelector(".currency_dropdown");

    Object.keys(data).forEach((code) => {
      let li = document.createElement("li");
      let a = document.createElement("a");

      a.href = "#";
      a.className = "dropdown-item";
      a.textContent = code;

      // Add click event to update button
      a.addEventListener("click", function (e) {
        e.preventDefault();
        currency_button.textContent = code;
        console.log(code.toLowerCase());
      });

      li.appendChild(a);
      dropdown.appendChild(li);
    });
  })
  .catch((error) => console.error("error loading JSON:", error));

convert_btn.addEventListener("click", async () => {
  const ip_text = ip_textbox.value;

  const convert_res = await fetch(`http://127.0.0.1:8000/convert/usd/inr`);
  const convert_data = await convert_res.json();

  const rate_res = await fetch(`http://127.0.0.1:8000/rates/usd`);
  const rate_data = await rate_res.json();

  let converted_currency = ip_text * convert_data.rate;
  op_text.innerHTML = `<b>INR rate against USD:</b> ${converted_currency.toFixed(
    2
  )}`;
});
