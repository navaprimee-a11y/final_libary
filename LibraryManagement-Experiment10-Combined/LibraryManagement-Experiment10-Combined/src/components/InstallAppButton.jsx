import React, { useEffect, useState } from 'react';
import Button from './common/Button';
import { promptInstall, subscribeToInstallState } from '../pwa/installPrompt';

const InstallAppButton = () => {
  const [canInstall, setCanInstall] = useState(false);
  const [status, setStatus] = useState('');

  useEffect(() => subscribeToInstallState(({ canInstall: available, installed }) => {
    setCanInstall(available);
    if (installed) setStatus('Library app installed successfully.');
  }), []);

  const install = async () => {
    try {
      const choice = await promptInstall();
      if (!choice) {
        setStatus('Use your browser menu to install this library app.');
      } else {
        setStatus(choice.outcome === 'accepted' ? 'Installation accepted.' : 'Installation was cancelled.');
      }
    } catch {
      setStatus('Use your browser menu to install this library app.');
    }
  };

  if (!canInstall && !status) return null;

  return (
    <span className="install-app-control">
      {canInstall && <Button variant="ghost" className="install-app-button" onClick={install}>Install app</Button>}
      {status && <span className="install-app-status" role="status">{status}</span>}
    </span>
  );
};

export default InstallAppButton;
