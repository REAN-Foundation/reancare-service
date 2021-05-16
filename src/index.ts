require('dotenv').config();

import Application from './app';

(async () => {
    const app = Application.instance();
    await app.start();
})();
