import Reminder from '../../models/general/reminder.model';
import {
    ReminderDto,
    ReminderType,
    RepeatAfterEveryNUnit
} from '../../../../../domain.types/general/reminder/reminder.domain.model';

///////////////////////////////////////////////////////////////////////////////////

export class ReminderMapper {

    static toDto = (reminder: Reminder): ReminderDto => {
        if (reminder == null){
            return null;
        }

        const dto: ReminderDto = {
            id                    : reminder.id,
            UserId                : reminder.UserId,
            Name                  : reminder.Name,
            ReminderType          : reminder.ReminderType as ReminderType,
            WhenDate              : reminder.WhenDate,
            WhenTime              : reminder.WhenTime,
            StartDate             : reminder.StartDate,
            EndDate               : reminder.EndDate,
            EndAfterNRepetitions  : reminder.EndAfterNRepetitions,
            RepeatList            : JSON.parse(reminder.RepeatList),
            RepeatAfterEvery      : reminder.RepeatAfterEvery,
            RepeatAfterEveryNUnit : reminder.RepeatAfterEveryNUnit as RepeatAfterEveryNUnit,
            HookUrl               : reminder.HookUrl,
            RawContent            : reminder.RawContent ?? null,
            CreatedAt             : reminder.createdAt,
            UpdatedAt             : reminder.updatedAt,
        };
        return dto;
    };

}
