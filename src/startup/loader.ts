import 'reflect-metadata';
import { CareplanHandler } from '../modules/careplan/careplan.handler';
import { container } from 'tsyringe';
import { Logger } from '../common/logger';
import { MessagingService } from '../modules/communication/messaging.service/messaging.service';
import { NotificationService } from '../modules/communication/notification.service/notification.service';
import { StorageService } from '../modules/ehr/services/storage.service';
import { Injector } from './injector';
import { Scheduler } from './scheduler';
import { Seeder } from './seeder';
import { ConfigurationManager } from '../config/configuration.manager';
import { IMessagingProvider } from '../modules/events/interfaces/messaging.povider.interface';

//////////////////////////////////////////////////////////////////////////////////////////////////

export class Loader {

    private static _seeder: Seeder = null;

    private static _scheduler: Scheduler = Scheduler.instance();

    private static _messagingService: MessagingService = null;

    private static _notificationService: NotificationService = null;

    private static _ehrStore: StorageService = null;

    private static _messagingProvider: IMessagingProvider = null;

    public static get seeder() {
        return Loader._seeder;
    }

    public static get scheduler() {
        return Loader._scheduler;
    }

    public static get storage() {
        return Loader._ehrStore;
    }

    public static get messagingService() {
        return Loader._messagingService;
    }

    public static get notificationService() {
        return Loader._notificationService;
    }

    public static get messagingProvider() {
        return Loader._messagingProvider;
    }

    public static init = async (): Promise<boolean> => {
        try {

            //Register injections here...
            Injector.registerInjections();

            Loader._seeder = container.resolve(Seeder);

            const ehrEnabled = ConfigurationManager.EhrEnabled();
            if (ehrEnabled) {
                Loader._ehrStore = container.resolve(StorageService);
                await Loader._ehrStore.init();
            }

            Loader._notificationService = container.resolve(NotificationService);
            Loader._notificationService.init();

            Loader._messagingService = container.resolve(MessagingService);
            Loader._messagingService.init();

            Loader._messagingProvider = container.resolve<IMessagingProvider>('IMessagingProvider');
            await Loader._messagingProvider.initialize();

            await CareplanHandler.init();

            return true;

        } catch (error) {
            Logger.instance().log(error.message);
            return false;
        }
    };

}
