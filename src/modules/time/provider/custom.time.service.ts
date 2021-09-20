import { ITimeService } from "../interfaces/time.service.interface";
import { DateStringFormat, DurationType } from "../interfaces/time.types";

import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import relativeTime  from 'dayjs/plugin/relativeTime';
import isBetween   from 'dayjs/plugin/isBetween';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import dayOfYear from 'dayjs/plugin/dayOfYear';
import weekday from 'dayjs/plugin/weekday';
import duration from 'dayjs/plugin/duration';
import calendar from 'dayjs/plugin/calendar';

//////////////////////////////////////////////////////////////////////////////////////////////////////

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(weekOfYear);
dayjs.extend(dayOfYear);
dayjs.extend(weekday);
dayjs.extend(duration);
dayjs.extend(calendar);

//////////////////////////////////////////////////////////////////////////////////////////////////////

export class CustomTimeService implements ITimeService {

    timestamp = (date: Date): string => {
        return date.getTime().toString();
    }

    getDateString = (date: Date, format: DateStringFormat): string => {

        if (format === DateStringFormat.YYYY_MM_DD) {
            return date.toISOString().split('T')[0];
        }
        return date.toISOString().split('T')[0];
    }

    addDuration = (date: Date, durationValue: number, durationType: DurationType): Date => {

        var date_ = dayjs(date);

        if (durationType === DurationType.Miliseconds) {
            var newDate_ = date_.add(durationValue, 'milliseconds');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Seconds) {
            var newDate_ = date_.add(durationValue, 'seconds');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Minutes) {
            var newDate_ = date_.add(durationValue, 'minutes');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Hours) {
            var newDate_ = date_.add(durationValue, 'hours');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Days) {
            var newDate_ = date_.add(durationValue, 'days');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Weeks) {
            var newDate_ = date_.add(durationValue, 'weeks');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Months) {
            var newDate_ = date_.add(durationValue, 'months');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Years) {
            var newDate_ = date_.add(durationValue, 'years');
            return newDate_.toDate();
        }
        return date;
    }

    subtractDuration = (date: Date, durationValue: number, durationType: DurationType): Date => {

        var date_ = dayjs(date);

        if (durationType === DurationType.Miliseconds) {
            var newDate_ = date_.subtract(durationValue, 'milliseconds');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Seconds) {
            var newDate_ = date_.subtract(durationValue, 'seconds');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Minutes) {
            var newDate_ = date_.subtract(durationValue, 'minutes');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Hours) {
            var newDate_ = date_.subtract(durationValue, 'hours');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Days) {
            var newDate_ = date_.subtract(durationValue, 'days');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Weeks) {
            var newDate_ = date_.subtract(durationValue, 'weeks');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Months) {
            var newDate_ = date_.subtract(durationValue, 'months');
            return newDate_.toDate();
        }
        if (durationType === DurationType.Years) {
            var newDate_ = date_.subtract(durationValue, 'years');
            return newDate_.toDate();
        }
        return date;
    }

    isBefore = (first: Date, second: Date): boolean => {
        return dayjs(first).isBefore(dayjs(second));
    }

    isAfter = (first: Date, second: Date): boolean => {
        return dayjs(first).isAfter(dayjs(second));
    }

    durationFromString = (str: string, durationType: DurationType): number => {

        var durationInHours = 0;
        var tokens = str.toLowerCase().split(":");
    
        for (var i = 0; i < tokens.length; i++) {
    
            var x = tokens[i];
    
            if (x.includes("h")) {
                x = x.replace("h", "");
                var hours = parseInt(x);
                durationInHours += hours;
            }
            if (x.includes("d")) {
                x = x.replace("d", "");
                var days = parseInt(x);
                durationInHours += (days * 24);
            }
            if (x.includes("w")) {
                x = x.replace("w", "");
                var weeks = parseInt(x);
                durationInHours += (weeks * 24 * 7);
            }
            if (x.includes("m")) {
                x = x.replace("m", "");
                var months = parseInt(x);
                durationInHours += (months * 24 * 30);
            }
        }

        if (durationType === DurationType.Miliseconds) {
            return durationInHours * 60 * 60 * 1000;
        }
        if (durationType === DurationType.Seconds) {
            return durationInHours * 60 * 60;
        }
        if (durationType === DurationType.Minutes) {
            return durationInHours * 60;
        }
        if (durationType === DurationType.Hours) {
            return durationInHours;
        }
        if (durationType === DurationType.Days) {
            return durationInHours / 24.0;
        }
        if (durationType === DurationType.Weeks) {
            return durationInHours / (24.0 * 7);
        }
        if (durationType === DurationType.Months) {
            return durationInHours / (24.0 * 30);
        }
        if (durationType === DurationType.Years) {
            return durationInHours / (24.0 * 365);
        }
        return durationInHours;
    }

    getTimezoneOffsets = (timezoneOffsetStr: string, durationType: DurationType): number => {

        var offsetTmp = timezoneOffsetStr;
        var offsetMinutes = 0;

        if (timezoneOffsetStr.includes('+')) {
            offsetTmp = offsetTmp.replace('+', '-');
        }
        else if (!timezoneOffsetStr.includes('-')) {
            offsetTmp = offsetTmp.replace(' ', '');
            offsetTmp = '-' + offsetTmp;
        }
        else if (timezoneOffsetStr.includes('-')) {
            offsetTmp = offsetTmp.replace('-', '+');
        }
    
        if (timezoneOffsetStr.includes(':')) {
            var tokens = offsetTmp.split(":");
            var offset_hours = parseInt(tokens[0]);
            var offset_minutes = parseInt(tokens[1]);
            if (offset_hours < 0) {
                offset_minutes = -1 * offset_minutes;
            }
            offsetMinutes = (offset_hours * 60) + offset_minutes;
        }
        else {
            var len = offsetTmp.length;
            var min = offsetTmp.substring(len - 2, len);
            var hr = offsetTmp.substring(0, len - 2);
            var offset_hours = parseInt(hr);
            var offset_minutes = parseInt(min);
            if (offset_hours < 0) {
                offset_minutes = -1 * offset_minutes;
            }
            offsetMinutes = (offset_hours * 60) + offset_minutes;
        }

        if (durationType === DurationType.Miliseconds) {
            return offsetMinutes * 60 * 1000;
        }
        if (durationType === DurationType.Seconds) {
            return offsetMinutes * 60 ;
        }
        if (durationType === DurationType.Minutes) {
            return offsetMinutes;
        }
        if (durationType === DurationType.Hours) {
            return offsetMinutes / 60.0;
        }
        if (durationType === DurationType.Days) {
            return offsetMinutes / (24.0 * 60);
        }
        if (durationType === DurationType.Weeks) {
            return offsetMinutes / (24.0 * 60 * 7);
        }
        if (durationType === DurationType.Months) {
            return offsetMinutes / (24.0 * 60 * 30);
        }
        if (durationType === DurationType.Years) {
            return offsetMinutes / (24.0 * 60 * 365);
        }
        return offsetMinutes;
    }

}
