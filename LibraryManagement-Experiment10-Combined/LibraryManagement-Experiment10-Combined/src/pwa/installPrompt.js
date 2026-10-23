// Capture the browser event at module load so React effects cannot miss an early prompt.
let deferredPrompt = null;
let installed = false;
const listeners = new Set();

const publish = () => {
  const state = { canInstall: Boolean(deferredPrompt), installed };
  listeners.forEach((listener) => listener(state));
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    installed = false;
    publish();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installed = true;
    publish();
  });
}

export const subscribeToInstallState = (listener) => {
  listeners.add(listener);
  listener({ canInstall: Boolean(deferredPrompt), installed });
  return () => listeners.delete(listener);
};

export const promptInstall = async () => {
  const event = deferredPrompt;
  if (!event) return null;
  deferredPrompt = null;
  publish();
  await event.prompt();
  return event.userChoice;
};
