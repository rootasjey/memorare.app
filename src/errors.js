/** Errors handler. */

import { navigate } from 'svelte-routing';

import { settings } from './settings';

export const handle = (error = {}) => {
  if (!error || typeof error !== 'object') {
    console.warn(`The variable passed is not an object`);
    return;
  }

  const { message } = error;

  const reJwtExpired = /jwt expired/ig;
  const reJwtMalFormed = /jwt malformed/ig;

  if (reJwtExpired.test(message) || reJwtMalFormed.test(message)) {
    settings.clearData();
    navigate('/signin');
    return;
  }

  console.error(error);
}