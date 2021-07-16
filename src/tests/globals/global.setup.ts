import * as dotenv from "dotenv";
import * as path from 'path';

import { Loader } from '../../startup/loader';

////////////////////////////////////////////////////////////////////

export default async () => {
    try {
        const envPath = path.join(process.cwd(), '.env');
        dotenv.config({ path: envPath });

        await Loader.init();
    }
    catch (error) {
        console.log('Problem in setting up the tests! -> ' + error.message);
    }
};
