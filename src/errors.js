import { navigate } from 'svelte-routing';

import { show }     from './components/Snackbar.svelte';
import { settings, isUserAuthenticated } from './settings';

/** Errors handler. */
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
    isUserAuthenticated.set(false);
    navigate('/signin');
    return;
  }

  if (error.graphQLErrors) {
    notifyGraphQLError(error);
    return;
  }

  console.error(error);
}

/** Show a notification about the error. */
function notifyGraphQLError(error = {}) {
  error.graphQLErrors.map((err) => {
    show({
      text: err.message,
      type: 'error',
      actions: [
        {
          text: 'Report',
          handler: () => console.log('redirect'),
        },
      ],
    });
  })
}
