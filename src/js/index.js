import "../sass/main.scss";

import debounce from "lodash.debounce";
import { defaultStack } from "@pnotify/core";

import countryListTemplate from "../templates/country-list.hbs";
import countryInfoTemplate from "../templates/country-info.hbs";

import getRefs from "./refs.js";
import fetchCountries from "./fetchCountries.js";
import {
  alertNoMatches,
  alertTooManyMatches,
  clearOutput,
} from "./notification.js";
import { addSeparatorySpaces } from "./utils.js";

const handleCountryData = data => {
  refs.outputLabel.classList.add("preloader-hidden");
  const queryFromCountryList = refs.output.querySelector("[data-query]");

  if (queryFromCountryList) {
    const countryListRef = [...refs.output.querySelectorAll(".country")];
    const index = countryListRef.findIndex(ref =>
      ref.hasAttribute("data-query"),
    );

    refs.input.value = countryListRef[index].textContent;

    renderCountryInfo([data[index]]);
    return;
  }

  if (data.length === 0) {
    refs.output.innerHTML = "No countries found. Please try a proper query!";
    refs.output.classList.add("empty");
    return;
  }

  if (data.length > 10) {
    alertTooManyMatches();
    return;
  }

  refs.output.classList.remove("empty");

  if (data.length > 1) {
    renderCountryList(data);
    return;
  }

  renderCountryInfo(data);
  return;
};

const renderCountryInfo = data => {
  defaultStack.close();

  refs.output.innerHTML = countryInfoTemplate(...data);

  const populationDataRef = refs.output.querySelector(".js-population");
  populationDataRef.textContent = addSeparatorySpaces(
    populationDataRef.textContent,
  );
};

const renderCountryList = data => {
  defaultStack.close();

  refs.output.innerHTML = countryListTemplate(data);

  const countryInfoRef = refs.output.querySelector(".country-list");
  countryInfoRef.addEventListener("click", onCountryClick);
};

const onSearch = e => {
  const searchValue = e.target.value.trim();

  if (!searchValue) return;

  refs.outputLabel.classList.remove("preloader-hidden");

  fetchCountries(searchValue).then(handleCountryData).catch(alertNoMatches);
};

const onCountryClick = e => {
  const targetCountry = e.target;
  // const currentName = targetCountry.querySelector(".country");
  refs.input.value = targetCountry.textContent;

  refs.input.dispatchEvent(new Event("input"));
  // refs.input.value = currentName.textContent;
};

const refs = getRefs();

refs.reset.addEventListener("click", onResetClick);
function onResetClick(event) {
  event.preventDefault();
  clearOutput();
  refs.input.value = "";
  refs.output.classList.add("empty");
}

refs.input.addEventListener("input", debounce(onSearch, 500));
refs.input.addEventListener("focus", e => e.target.select());

clearOutput();
