import { writable } from 'svelte/store';
import { browser } from '$app/environment';

function getaccentColor() {
  let accentColor;
  if (browser) {
    accentColor = localStorage.getItem('accentColor') || 'light-blue';
  }

  const { subscribe, set } = writable(accentColor);

  return {
    subscribe,
    set: (accentColor) => {
      if (browser) {
        localStorage.setItem('accentColor', accentColor);
      }
      set(accentColor);
    }
  };
}

function getPageTitle() {
  let pageTitle;
  if (browser) {
    pageTitle = localStorage.getItem('pageTitle') || 'Loading...';
  }

  const { subscribe, set } = writable(pageTitle);

  return {
    subscribe,
    set: (pageTitle) => {
      if (browser) {
        localStorage.setItem('pageTitle', pageTitle);
      }
      set(pageTitle);
    }
  };
}

function getStoreInfo() {
  let storeInfo;
  if (browser) {
    storeInfo = JSON.parse(localStorage.getItem('storeInfo')) || [];
  }

  const { subscribe, set } = writable(storeInfo);

  return {
    subscribe,
    set: (storeInfo) => {
      if (browser) {
        localStorage.setItem('storeInfo', JSON.stringify(storeInfo));
      }
      set(JSON.stringify(storeInfo));
    }
  };
}

// Load initial value from localStorage or use empty array
const getInitialValue = () => {
    if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem("sqlLogs");
        try {
            return stored ? JSON.parse(stored) : [];
        } catch (e) {
            console.error('Error parsing localStorage:', e);
            return [];
        }
    }
    return []; // SSR fallback
};

function getSQLLogs() {
  const { subscribe, set, update } = writable(getInitialValue());

  return {
    subscribe,
    set: (arr) => {
      localStorage.setItem("sqlLogs", JSON.stringify(arr));
      set(arr);
    },
    get: () => {
      if (typeof localStorage !== 'undefined') {
        const stored = localStorage.getItem("sqlLogs");
        try {
          return stored ? JSON.parse(stored) : [];
        } catch {
          return [];
        }
      }
      return [];
    },
    update
  };
}

function getPrintableItems() {
  let printableItems;
  if (browser) {
    printableItems = JSON.parse(localStorage.getItem('printableItems')) || [];
  }

  const { subscribe, set } = writable(printableItems);

  return {
    subscribe,
    set: (printableItems) => {
      if (browser) {
        localStorage.setItem('printableItems', JSON.stringify(printableItems));
      }
      set(JSON.stringify(printableItems));
    }
  };
}

function getPrintList() {
  let printList;
  if (browser) {
    printList = JSON.parse(localStorage.getItem('printList')) || [];
  }

  const { subscribe, set } = writable(printList);

  return {
    subscribe,
    set: (printList) => {
      if (browser) {
        localStorage.setItem('printList', JSON.stringify([...printList]));
      }
      set(JSON.stringify(printList));
    }
  };
}

function getSelectedTab() {
  let selectedTab;
  if (browser) {
    selectedTab = localStorage.getItem('selectedTab') || 'dashboard';
  }

  const { subscribe, set } = writable(selectedTab);

  return {
    subscribe,
    set: (selectedTab) => {
      if (browser) {
        localStorage.setItem('selectedTab', selectedTab);
      }
      set(selectedTab);
    }
  };
}


export const accentColor = getaccentColor();
export const selectedTab = getSelectedTab();
export const storeInfo = getStoreInfo();
export const printSet = getPrintList();
export const printableItems = getPrintableItems();
export const pageTitle = getPageTitle();
export const sqlLogs = getSQLLogs();