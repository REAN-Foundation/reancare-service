import * as fs from 'fs';
import child_process from 'child_process';
import { InputValidationError } from './input.validation.error';
import { Gender } from './system.types';
import { generate} from 'generate-password';
import { scryptSync, randomBytes } from 'crypto';
import { CustomSanitizer, CustomValidator } from 'express-validator';
////////////////////////////////////////////////////////////////////////

export class Helper {
    static dumpJson(obj, filename) {
        var txt = JSON.stringify(obj, null, '    ');
        fs.writeFileSync(filename, txt);
    }

    static executeCommand = (command: string): Promise<string> => {
        return new Promise(function (resolve, reject) {
            child_process.exec(
                command,
                function (error: Error, standardOutput: string, standardError: string) {
                    if (error) {
                        reject();
                        return;
                    }
                    if (standardError) {
                        reject(standardError);
                        return;
                    }
                    resolve(standardOutput);
                }
            );
        });
    };

    static getSessionHeaders = (token: string) => {
        return {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: '*/*',
            'Cache-Control': 'no-cache',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            Authorization: 'Bearer ' + token,
        };
    };

    static getNeedleOptions = (headers) => {
        return {
            headers: headers,
            compressed: true,
            json: true,
        };
    };

    static removeArrayDuplicates<Type>(arr: Type[]): Type[] {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var unique = arr.filter(onlyUnique);
        return unique;
    }

    static areStringsOverlapping = (firstStr: string, secondStr: string) => {
        if (firstStr.indexOf(secondStr) != -1 || secondStr.indexOf(firstStr) != -1) {
            return true;
        }
        return false;
    };

    static areOffsetsOverlapping = (
        firstStart: number,
        firstEnd: number,
        secondStart: number,
        secondEnd: number
    ): boolean => {
        if (
            (firstStart <= secondStart && secondStart >= firstEnd) ||
            (firstStart <= secondEnd && secondEnd >= firstEnd) ||
            (secondStart <= firstStart && firstStart >= secondEnd) ||
            (secondStart <= firstEnd && firstEnd >= secondEnd)
        ) {
            return true;
        }
        return false;
    };

    static handleValidationError = (result) => {
        var index = 1;
        var errorMessages = [];
        for (var er of result.errors) {
            errorMessages.push(` ${index}. ${er.msg} - <${er.value}> for <${er.param}> in ${er.location}`);
            index++;
        }
        throw new InputValidationError(errorMessages);
    };

    static getAgeFromBirthDate = (birthdate: Date, onlyYears: boolean = false): string => {
        if (birthdate === null) {
            return '';
        }
        var bd = birthdate.getTime();
        var milsecs = Date.now() - bd;

        const milsecInYear = 365 * 24 * 3600 * 1000;
        const milsecsInMonth = 30 * 24 * 3600 * 1000;

        var years = Math.floor(milsecs / milsecInYear);
        var remainder = milsecs % milsecInYear;
        var months = Math.floor(remainder / milsecsInMonth);

        var age = years > 0 ? years.toString() + ' years' : '';
        if (onlyYears) {
            if (age.length == 0) {
                return '0 years';
            }
            return age;
        }
        age = age + (months > 0 ? ' and ' + months.toString() + ' months' : '');
        return age;
    };

    static guessPrefixByGender = (gender: Gender) => {
        if (gender == 'Male' || gender == 'male') {
            return 'Mr.';
        }
        if (gender == 'Female' || gender == 'female') {
            return 'Miss.';
        }
        return ''; //Return empty prefix
    };

    static constructPersonDisplayName = (
        prefix: string | null,
        firstName: string | null,
        lastName: string | null
    ): string => {
        var prefix = Helper.checkStr(prefix) ? prefix + ' ' : '';
        var firstName = Helper.checkStr(firstName) ? firstName + ' ' : '';
        var lastName = Helper.isStr(lastName) ? lastName : '';
        var displayName: string = prefix + firstName + lastName;
        displayName = displayName.trim();
        return displayName;
    };

    static getGender = (str: string): Gender => {
        if (
            str != 'Male' &&
            str != 'Female' &&
            str != 'male' &&
            str != 'female' &&
            str != 'Other' &&
            str != 'other'
        ) {
            return 'Unknown';
        }
        return str;
    };

    static formatDate = (date) => {
        var d = new Date(date);
        var month = ('00' + (d.getMonth() + 1).toString()).slice(-2);
        var day = ('00' + d.getDate().toString()).slice(-2);
        var year = d.getFullYear();
        return [year, month, day].join('-');
    };

    static isAlpha = (c) => {
        var alphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphas.indexOf(c) != -1;
    };

    static isAlphaVowel = (c) => {
        var alphas = 'aeiouAEIOU';
        return alphas.indexOf(c) != -1;
    };

    static isDigit = (c) => {
        var digits = '0123456789';
        return digits.indexOf(c) != -1;
    };

    static isAlphaNum = (c) => {
        return Helper.isAlpha(c) || Helper.isDigit(c);
    };

    static hasAlpha = (str: string) => {
        for (var c of str) {
            if (Helper.isAlpha(c)) {
                return true;
            }
        }
        return false;
    };

    static getDigitsOnly = (str: string): string => {
        var temp: string = '';
        for (var x = 0; x < str.length; x++) {
            var c = str.charAt(x);
            if (Helper.isDigit(c)) {
                temp += c;
            }
        }
        return temp;
    };

    static checkStr(val: any) {
        if (typeof val === null || typeof val === undefined || typeof val !== 'string') {
            return null;
        }
        return val;
    }

    static isStr(val: any): boolean {
        if (typeof val === null || typeof val === undefined || typeof val !== 'string') {
            return false;
        }
        return true;
    }

    static checkNum(val: any): number {
        if (val === null || typeof val === 'undefined' || typeof val !== 'number') {
            return null;
        }
        return val;
    }

    static isNum(val: any): boolean {
        if (val === null || typeof val === 'undefined' || typeof val !== 'number') {
            return false;
        }
        return true;
    }

    static checkObj(val: any): object {
        if (val === null || typeof val === 'undefined' || typeof val !== 'object') {
            return null;
        }
        return val;
    }

    static generatePassword(): string {
        var password = generate({
            length: 8,
            numbers: true,
            lowercase: true,
            uppercase: true,
            symbols: true,
        });
        return password;
    }

    static _salt: string = randomBytes(16).toString('hex');
    static createHash(str: string): string {
        const hash = scryptSync(str, Helper._salt, 32).toString('hex');
        return hash;
    }

    static sanitizePhoneNumber(phoneNumber: string) {
        var temp = Helper.getDigitsOnly(phoneNumber);
        return temp;
    }

    static sanitizePhoneCountryCode(phoneCountryCode: string) {
        var temp = Helper.getDigitsOnly(phoneCountryCode);
        return '+' + temp;
    }

    public static validatePhoneCountryCode(phoneCountryCode: string) {
        var validCountryCode = Helper.isStr(phoneCountryCode) && phoneCountryCode.length > 0;
        if (!validCountryCode) {
            return Promise.reject('Invalid country code');
        }
        return Promise.resolve();
    }

    public static validatePhoneNumber(phoneNumber: string) {
        var validPhoneNumber = Helper.isStr(phoneNumber) && phoneNumber.length > 9;
        if (!validPhoneNumber) {
            //throw new InputValidationError(['Invalid phone number']);
            return Promise.reject('Invalid phone number');
        }
        return Promise.resolve();
    }
    
    public static sleep = (miliseconds) => {
        return new Promise((resolve) => {
            setTimeout(resolve, miliseconds);
        });
    }
    
    public static isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }
    
}
