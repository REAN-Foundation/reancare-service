import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { AnalyticsEvent } from "./analytics.types";

export class AnalyticsHandler {

    private static _instance: AnalyticsHandler;

    static _numAsyncTasks = 4;

    private constructor() {
    }

    public static instance(): AnalyticsHandler {
        if (!this._instance) {
            this._instance = new AnalyticsHandler();
        }
        return this._instance;
    }

    static _queue = asyncLib.queue((event: AnalyticsEvent, onCompleted) => {
        (async () => {
            await AnalyticsHandler.addEvent(event);
            onCompleted(event);
        })();
    }, AnalyticsHandler._numAsyncTasks);

    private static async addEvent(event: AnalyticsEvent): Promise<void> {
        try {
            // Save the event to the database
        } catch (error) {
            Logger.instance().log(error);
        }
    }

}
