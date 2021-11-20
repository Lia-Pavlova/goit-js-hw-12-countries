//  import { alertSearchError } from './notification.js';

const RESOURCE_URL = "https://restcountries.com/v2/name/";

export default function fetchCountries(searchQuery) {
  return fetch(RESOURCE_URL + searchQuery).then(response => response.json());
}
