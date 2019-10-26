import { writable } from 'svelte/store';
import { navigate } from 'svelte-routing';

/** Application's data store. */
class Settings {
  clearData() {
    localStorage.clear();
  }

  getValue(name = '') {
    return localStorage.getItem(name);
  }

  setValue(name = '', value = '') {
    if (!name) { return; }
    localStorage.setItem(name, value);
  }

  saveData({ id, email, lang, name, token }) {
    localStorage.setItem('id', id);
    localStorage.setItem('email', email);
    localStorage.setItem('lang', lang);
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

export const logout = ({ route = '/', delay = 0 }) => {
  settings.clearData();
  isUserAuthenticated.set(false);

  setTimeout(() => {
    navigate(route);
  }, delay);
}
