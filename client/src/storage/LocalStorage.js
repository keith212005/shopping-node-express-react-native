export const setStorageItem = (key, data) => {
  if (typeof data === 'object') {
    localStorage.setItem(key, JSON.stringify(data));
  } else if (typeof data === 'string') {
    localStorage.setItem(key, data);
  }
};

export const getStorageItem = (key) => {
  return localStorage.getItem(key);
};

export const setSessionItem = (key, data) => {
  if (typeof data === 'object') {
    window.sessionStorage.setItem(key, JSON.stringify(data));
  } else if (typeof data === 'string') {
    window.sessionStorage.setItem(key, data);
  }
};

export const getSessionItem = (key) => window.sessionStorage.getItem(key);
