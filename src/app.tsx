import React from 'react';

import { createRoot } from 'react-dom/client';
import ElectronApp from './ElectronApp';

const root = createRoot(document.body);
root.render(<ElectronApp/>);