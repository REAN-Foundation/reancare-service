import { Logger } from "../../../../common/logger";

//////////////////////////////////////////////////////////////////////////////////

export default async () => {
    try {
        
        //Logger.instance().log("Tearing down...");
    }
    catch (error) {
        Logger.instance().log('Problem in tearing down the tests! -> ' + error.message);
    }
};

