export const registerServiceWorker = () => {
  if (!import.meta.env.PROD || typeof window === 'undefined' || !('serviceWorker' in navigator)) return;
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      // PWA support is progressive enhancement; a registration failure must not
      // prevent the library website from loading.
      if (import.meta.env.DEV) console.warn('Library service worker registration failed:', error);
    });
  }, { once: true });
};
