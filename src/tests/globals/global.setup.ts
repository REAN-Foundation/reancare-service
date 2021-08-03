//import * as dotenv from "dotenv";
import * as path from 'path';
import Application from '../../app';
import { Logger } from "../../common/logger";

// const envPath = path.join(process.cwd(), '.env');
//dotenv.config();
////////////////////////////////////////////////////////////////////

export default async () => {
    try {
      var appInstance = Application.instance();
        await appInstance.start();
    }
    catch (error) {
        Logger.instance().log('Problem in setting up the tests! -> ' + error.message);
    }
};
