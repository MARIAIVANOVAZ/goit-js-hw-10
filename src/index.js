import './css/styles.css';
import countryCard from './templates/card.hbs';
import countryList from './templates/list.hbs'
import {fetchCountries} from './fetchCountries';
import Notiflix from 'notiflix';

const debounce = require('lodash.debounce');
const DEBOUNCE_DELAY = 300;
 
const countriesListEl = document.querySelector('.country-list');
const inputEl = document.querySelector('#search-box');
const cardContainer = document.querySelector('.country-info');

inputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function onSearch(event) {
    event.preventDefault();

    const searchForm = event.target.value.trim();
    console.log(searchForm);
    if (searchForm === "") {
        onRemoveMarkup();
        return;
    }

    fetchCountries(searchForm)
    .then(onCheckCountries)
    .catch(onFetchError); 
    

}

function onFetchError(error) {
    onRemoveMarkup();
    Notiflix.Notify.failure('Oops, there is no country with that name!!!');
  }


function onCardMarkup (...countries){
    const markup = countryCard(...countries);
    console.log(markup);
    cardContainer.innerHTML = markup;

}


function onCheckCountries(countries) {
    if (countries.length > 10) {
        onRemoveMarkup();
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
      } else if (countries.length <= 10 && countries.length >= 2) {
        onRemoveMarkup();
        addCountriesList(countries);
      } else if (countries.length <= 1) {
        onRemoveMarkup();
        onCardMarkup(countries);
      } 
} 

function addCountriesList(countries) {
    countriesListEl.insertAdjacentHTML('afterbegin', countryList({...countries}));
    }

function  onRemoveMarkup() {
    countriesListEl.innerHTML = "";
    cardContainer.innerHTML = "";
}