
///////////////////////////////////////////////////////////////////////

import { Logger } from "./logger";

export class ActivityRecorder {

    public static record(activityDetails: any) {
        
        const str = JSON.stringify(activityDetails);
        Logger.instance().log(str);

        //record activity here...
    }

}
