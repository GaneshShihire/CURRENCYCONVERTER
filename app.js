const BASE_URL = "https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies";

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button"); // Corrected selector
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");

// // Assuming countryList is an object with country codes as keys and country names as values
// const countryList = {
//     "USD": "US", // United States
//     "INR": "IN", // India
//     "EUR": "EU", // European Union
//     "GBP": "GB", // United Kingdom
//     // Add more countries as needed
// };

for (let select of dropdown) {
    for (let country in countryList) {
        let newOption = document.createElement("option");
        newOption.innerText = country;
        if (select.name === "from" && country === "USD") {
            newOption.selected = "selected";
        } else if (select.name === "to" && country === "INR") {
            newOption.selected = "selected";
        }

        select.append(newOption);
    }

    select.addEventListener("change", (evt) => {
        updateFlag(evt.target);
    });
}

const updateFlag = (element) => {
    console.log(element);
    let country = element.value;
    let countrycode = countryList[country];
    let newsrc = `https://flagsapi.com/${countrycode}/flat/64.png`; // Corrected template literal
    let img = element.parentElement.querySelector("img");
    img.src = newsrc;
};

btn.addEventListener("click", async (evt) => {
    evt.preventDefault();
    let amount = document.querySelector(".amount input");
    let amtVal = parseFloat(amount.value); // Convert to number
    if (isNaN(amtVal) || amtVal < 1) {
        amtVal = 1;
        amount.value = "1"; // Update the input field
    }

    const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}/${toCurr.value.toLowerCase()}.json`; // Corrected template literal
    try {
        let response = await fetch(URL);
        if (!response.ok) {
            throw new Error("Failed to fetch exchange rate data");
        }
        let data = await response.json();
        let rate = data[toCurr.value.toLowerCase()]; // Ensure the key is in lowercase

        let finalAmount = (amtVal * rate).toFixed(2); // Round to 2 decimal places
        msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`; // Corrected template literal
    } catch (error) {
        console.error("Error fetching exchange rate:", error);
        msg.innerText = "Failed to fetch exchange rate. Please try again later.";
    }
});