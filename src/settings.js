import { writable } from 'svelte/store';

/** Application's data store. */
class Settings {
  clearData() {
    localStorage.clear();
  }

  getValue(name = '') {
    if (name === 'lang') return 'en'; // TODO: delete
    return localStorage.getItem(name);
  }

  saveData({ _id, email, name, token }) {
    localStorage.setItem('id', _id);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);
  }
}

/** Application's data store. */
export const settings = new Settings();

export const isUserAuthenticated = writable(false);

if (settings.getValue('name')) {
  isUserAuthenticated.set(true);
}
