import './css/styles.css';
import { fetchCountries } from './fetchCounrties.js';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const information = document.querySelector('.country-info');
const form = document.querySelector('.country-list');
const inputForm = document.querySelector('#search-box');

const DEBOUNCE_DELAY = 300;
const clearElements = el => (el.innerHTML = '');

const renderHtml = data => {
    if (data.length === 1) {
      clearElements(form);
      const markupOneCountry = createCountry(data);
      information.innerHTML = markupOneCountry;
    } else {
      clearElements(information);
      const markupManyCountry = createCountrys(data);
      form.innerHTML = markupManyCountry;
    }
  };

const listInput = e => {
  const text = e.target.value.trim();
  if (!text) {
    clearElements(form);
    clearElements(information);
    return;
  }
  fetchCountries(text)
    .then(data => {
      if (data.length > 10) {
        Notify.info('Too many matches found. Please enter a more specific name.');
        return;
      }
      renderHtml(data);
    })
    .catch(error => {
      clearElements(form);
      clearElements(information);
      Notify.failure('Oops, there is no country with that name');
    });
};



const createCountrys = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`,
    )
    .join('');
};

const createCountry = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) => `<h1><img src="${flags.png}" alt="${
      name.official
    }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`,
  );
};

inputForm.addEventListener('input', debounce(listInput, DEBOUNCE_DELAY));



// commentary