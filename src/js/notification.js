import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/BrightTheme.css';
import { error, defaultStack } from '@pnotify/core';

import getRefs from './refs.js';
const refs = getRefs();

function alertSearchError(message) {
  clearOutput();
  defaultStack.close();
  error({
    title: 'Search query error!',
    text: message,
    delay: 3000,
  });
}

export function alertNoMatches() {
  refs.output.classList.add('empty');
  alertSearchError('Nothing found');
}

export function alertTooManyMatches() {
  refs.output.classList.add('empty');
  alertSearchError('Too many matches, please clarify your request');
}

export function clearOutput() {
  refs.output.innerHTML = ''; //Please enter your query in the search field ...
}