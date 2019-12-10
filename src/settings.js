import { writable } from 'svelte/store';
import { navigate } from 'svelte-routing';

/** Current user's rights. */
let RIGHTS = [];

/** Application's data store. */
class Settings {
  clearData() {
    localStorage.clear();
    RIGHTS = [];
  }

  getValue(name = '') {
    if (!name) { throw new Error('No name provided. Please provide a valid string.'); }

    const value = localStorage.getItem(name);

    if (name === 'lang') {
      return value || 'en';
    }

    if (name === 'rights') {
      return JSON.parse(value);
    }

    return value;
  }

  getPrefLang(name = '') {
    if (!name) { throw new Error('No name provided. Please provide a valid string.'); }

    const _name = `${name}lang`;
    const value = localStorage.getItem(_name);
    return value || 'en';
  }

  setPrefLang(name = '', value = '') {
    if (!name) { throw new Error('No name provided. Please provide a valid string.'); }

    const _name = `${name}lang`;
    localStorage.setItem(_name, value);
  }

  setValue(name = '', value = '') {
    if (!name) { throw new Error('No name provided. Please provide a valid string.'); }

    if (Array.isArray(value)) {
      localStorage.setItem(name, JSON.stringify(value));
      return;
    }

    localStorage.setItem(name, value);
  }

  saveData(config = {}) {
    const { id, email, lang, name, rights, token } = config;

    localStorage.setItem('id', id);
    localStorage.setItem('email', email);
    localStorage.setItem('lang', lang);
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);

    RIGHTS.push(...rights);
    localStorage.setItem('rights', JSON.stringify(rights));
  }
}

/** Application's data store. */
export const settings = new Settings();

export const isUserAuthenticated = writable(false);
export const isAvatarUpdated = writable(0);

if (settings.getValue('name')) {
  isUserAuthenticated.set(true);
}

export const logout = ({ route = '/', delay = 0 } = {}) => {
  settings.clearData();
  isUserAuthenticated.set(false);

  setTimeout(() => {
    navigate(route);
  }, delay);
}

export function getUserAvatar({ size = 'small'} = {}) {
  const imgUrl = settings.getValue('imgUrl');

  if (imgUrl) { return imgUrl; }

  if (size === 'small') {
    return `https://api.adorable.io/avatars/90/${settings.getValue('email')}.png`;
  }

  return `https://api.adorable.io/avatars/200/${settings.getValue('email')}.png`;
}

/** Return true if the current user can perform the action. */
export function canI(action = '') {
  let matchRight = '';

  if (/editAuthor/ig.test(action) ||
    /deleteAuthor/ig.test(action)) {

    matchRight = 'user:manageauthor';

  } else if (/proposeQuote/ig.test(action) ||
    /addQuote/ig.test(action)) {
    matchRight = 'user:proposequote';

  } else if (/deleteQuote/ig.test(action) ||
    /validateQuote/ig.test(action) ||
    /manageQuote/ig.test(action)) {

    matchRight = 'user:managequote';

  } else if (/manageQuotidian/ig.test(action)) {

    matchRight = 'user:managequotidian';
  }

  if (RIGHTS.length < 1) {
    const savedRights = settings.getValue('rights');
    if (savedRights) { RIGHTS.push(...savedRights); }
  }

  return RIGHTS.some((right) => right === matchRight);
}

export const LANG_ITEMS = [
  { label: 'EN', value: 'en' },
  { label: 'FR', value: 'fr' },
];

export const PREF_KEY = {
  publishedquotes: 'publishedquotes',
  tempquotes: 'tempquotes',
};
