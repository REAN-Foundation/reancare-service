import * as asyncLib from 'async';
import { Logger } from "../../common/logger";
import { AnalyticsEvent } from "./analytics.types";
import axios from 'axios';
import { UserDetailsDto } from '../../domain.types/users/user/user.dto';
import { uuid } from '../../domain.types/miscellaneous/system.types';
import { TimeHelper } from '../../common/time.helper';
import { DurationType } from '../../domain.types/miscellaneous/time.types';

/////////////////////////////////////////////////////////////////////

export class AnalyticsHandler {

    private static _numAsyncTasks = 4;

    private static _eventQueue = asyncLib.queue((event: AnalyticsEvent, onCompleted) => {
        (async () => {
            await AnalyticsHandler.addEvent(event);
            onCompleted();
        })();
    }, AnalyticsHandler._numAsyncTasks);

    private static _addUserQueue = asyncLib.queue((user: UserDetailsDto, onCompleted) => {
        (async () => {
            await AnalyticsHandler.addNewUser(user);
            onCompleted();
        })();
    }, AnalyticsHandler._numAsyncTasks);

    private static _deleteUserQueue = asyncLib.queue((userId: uuid, onCompleted) => {
        (async () => {
            await AnalyticsHandler.deleteExistingUser(userId);
            onCompleted();
        })();
    }, AnalyticsHandler._numAsyncTasks);

    private static async addEvent(event: AnalyticsEvent): Promise<void> {
        try {
            const apiKey = process.env.INTERNAL_API_KEY;
            const headers = {
                'Content-Type'    : 'application/json',
                Accept            : '*/*',
                'Cache-Control'   : 'no-cache',
                'Accept-Encoding' : 'gzip, deflate, br',
                Connection        : 'keep-alive',
                'x-api-key'       : apiKey,
            };

            var url = process.env.ANALYTICS_API_BASE_URL + '/events/';
            var body = {
                ...event,
            };
            var response = await axios.post(url, body, { headers });
            if (response.status === 201) {
                Logger.instance().log('Successfully pushed analytics event!');
            } else {
                Logger.instance().error('Unable to push analytics event!', response.status, response.data);
            }
        } catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    }

    private static async addNewUser(user: UserDetailsDto): Promise<void> {
        try {
            const apiKey = process.env.INTERNAL_API_KEY;
            const headers = {
                'Content-Type'    : 'application/json',
                Accept            : '*/*',
                'Cache-Control'   : 'no-cache',
                'Accept-Encoding' : 'gzip, deflate, br',
                Connection        : 'keep-alive',
                'x-api-key'       : apiKey,
            };

            const timezoneOffsetMinutes = TimeHelper.getTimezoneOffsets(user.CurrentTimeZone, DurationType.Minute);

            var url = process.env.ANALYTICS_API_BASE_URL + '/users';
            var body = {
                id                : user.id,
                TenantId          : user.TenantId,
                RoleId            : user.RoleId ?? user.Role?.id,
                OnboardingSource  : 'Unknown',
                TimezoneOffsetMin : timezoneOffsetMinutes,
                RegistrationDate  : user.Person.ActiveSince ?? new Date(),
            };
            var response = await axios.post(url, body, { headers });
            if (response.status === 201) {
                Logger.instance().log('Successfully pushed analytics user!');
            } else {
                Logger.instance().error('Unable to push analytics user!', response.status, response.data);
            }
        } catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    }

    private static async deleteExistingUser(userId: uuid): Promise<void> {
        try {
            const apiKey = process.env.INTERNAL_API_KEY;
            const headers = {
                'Content-Type'    : 'application/json',
                Accept            : '*/*',
                'Cache-Control'   : 'no-cache',
                'Accept-Encoding' : 'gzip, deflate, br',
                Connection        : 'keep-alive',
                'x-api-key'       : apiKey,
            };

            var url = process.env.ANALYTICS_API_BASE_URL + '/users/' + userId;
            var response = await axios.delete(url, { headers });
            if (response.status === 200) {
                Logger.instance().log('Successfully deleted analytics user!');
            } else {
                Logger.instance().error('Unable to delete analytics user!', response.status, response.data);
            }
        } catch (error) {
            Logger.instance().log(`${error.message}`);
        }
    }

    // Push an event to the queue. This is a non-blocking call.
    public static pushEvent(event: AnalyticsEvent): void {
        AnalyticsHandler._eventQueue.push(event, (err) => {
            if (err) {
                Logger.instance().log('Error pushing event:' + err.message);
            }
        });
    }

    // Create a user
    public static createUser(user: UserDetailsDto): void {
        AnalyticsHandler._addUserQueue.push(user, (err) => {
            if (err) {
                Logger.instance().log('Error creating user:' + err.message);
            }
        });
    }

    // Delete a user
    public static deleteUser(userId: uuid): void {
        AnalyticsHandler._deleteUserQueue.push(userId, (err) => {
            if (err) {
                Logger.instance().log('Error deleting user:' + err.message);
            }
        });
    }

}

////////////////////////////////////////////////////////////////////////////////////////////////////////
