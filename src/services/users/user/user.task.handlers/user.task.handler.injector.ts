import { DependencyContainer } from 'tsyringe';
import { UserTaskActionHandler } from './user.task.action.handler';
import { UserTaskHandler } from './user.task.category.handler';
import { UserTaskChannelHandler } from './user.task.channel.handler';
import { UserActionType, UserTaskCategory } from '../../../../domain.types/users/user.task/user.task.types';
import { NotificationChannel } from '../../../../domain.types/general/notification/notification.types';
import { CareplanActionHandler } from './action.handlers/careplan.action.handler';
import { AssessmentTaskHandler } from './category.handlers/assessment.task.handler';
import { MessageTaskHandler } from './category.handlers/message.task.handler';
import { DefaultTaskHandler } from './category.handlers/default.task.handler';
import { WhatsAppChannelHandler } from './channel.handlers/whatsapp.channel.handler';
import { TelegramChannelHandler } from './channel.handlers/telegram.channel.handler';

///////////////////////////////////////////////////////////////////////////////

export class UserTaskHandlerInjector {

    static registerInjections(container: DependencyContainer) {

        // Register resolver instances
        const actionHandlerResolver = container.resolve(UserTaskActionHandler);
        const taskHandlerResolver = container.resolve(UserTaskHandler);
        const channelHandlerResolver = container.resolve(UserTaskChannelHandler);

        // Register resolvers in container with interface tokens
        container.registerInstance('IActionHandlerResolver', actionHandlerResolver);
        container.registerInstance('ITaskHandlerResolver', taskHandlerResolver);
        container.registerInstance('IChannelHandlerResolver', channelHandlerResolver);

        // Register Action Handlers
        actionHandlerResolver.registerHandler(UserActionType.Careplan, CareplanActionHandler);
        // Add more action handlers as needed:
        // actionHandlerResolver.registerHandler(UserActionType.Medication, MedicationActionHandler);
        // actionHandlerResolver.registerHandler(UserActionType.Appointment, AppointmentActionHandler);

        // Register Category Handlers
        taskHandlerResolver.registerHandler(UserTaskCategory.Assessment, AssessmentTaskHandler);
        taskHandlerResolver.registerHandler(UserTaskCategory.Message, MessageTaskHandler);
        // Add more category handlers as needed:
        // taskHandlerResolver.registerHandler(UserTaskCategory.Medication, MedicationTaskHandler);
        // taskHandlerResolver.registerHandler(UserTaskCategory.Appointment, AppointmentTaskHandler);

        // Set default handler for unhandled categories
        UserTaskHandler.setDefaultHandler(DefaultTaskHandler);

        // Register Channel Handlers
        channelHandlerResolver.registerHandler(NotificationChannel.WhatsApp, WhatsAppChannelHandler);
        channelHandlerResolver.registerHandler(NotificationChannel.WhatsappWati, WhatsAppChannelHandler);
        channelHandlerResolver.registerHandler(NotificationChannel.WhatsappMeta, WhatsAppChannelHandler);
        channelHandlerResolver.registerHandler(NotificationChannel.Telegram, TelegramChannelHandler);
        // Add more channel handlers as needed:
        // channelHandlerResolver.registerHandler(NotificationChannel.SMS, SmsChannelHandler);
        // channelHandlerResolver.registerHandler(NotificationChannel.Email, EmailChannelHandler);
    }

}
