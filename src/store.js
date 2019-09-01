/** Application's data store. */
class Store {
  clearData() {
    localStorage.clear();
  }

  saveData({ _id, email, name, token }) {
    localStorage.setItem('id', _id);
    localStorage.setItem('email', email);
    localStorage.setItem('name', name);
    localStorage.setItem('token', token);
  }
}

/** Application's data store. */
export const store = new Store();
