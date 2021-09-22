import * as fs from 'fs';
import child_process from 'child_process';
import { InputValidationError } from './input.validation.error';
import { Gender } from '../domain.types/miscellaneous/system.types';
import { generate } from 'generate-password';
import { hashSync, compareSync, genSaltSync } from 'bcryptjs';
import * as crypto from 'crypto';
import express from 'express';

////////////////////////////////////////////////////////////////////////

export class Helper {

    static getResourceOwner = (request: express.Request): string => {
        if (request.params.userId) {
            return request.params.userId;
        }
        if (request.params.patientUserId) {
            return request.params.patientUserId;
        }
        if (request.params.doctorUserId) {
            request.params.doctorUserId;
        }
        return null;
    }

    static dumpJson(obj, filename) {
        const txt = JSON.stringify(obj, null, '    ');
        fs.writeFileSync(filename, txt);
    }
    
    static jsonToObj = (jsonPath) => {

        if (!fs.existsSync(jsonPath)) {
            return null;
        }

        const rawdata = fs.readFileSync(jsonPath, {
            encoding : 'utf8',
            flag     : 'r',
        });

        const obj = JSON.parse(rawdata);
        return obj;
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
            'Content-Type'    : 'application/json; charset=utf-8',
            Accept            : '*/*',
            'Cache-Control'   : 'no-cache',
            'Accept-Encoding' : 'gzip, deflate, br',
            Connection        : 'keep-alive',
            Authorization     : 'Bearer ' + token,
        };
    };

    static getNeedleOptions = (headers) => {
        return {
            headers    : headers,
            compressed : true,
            json       : true,
        };
    };

    static removeArrayDuplicates<Type>(arr: Type[]): Type[] {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        const unique = arr.filter(onlyUnique);
        return unique;
    }

    static areStringsOverlapping = (firstStr: string, secondStr: string) => {
        if (firstStr.indexOf(secondStr) !== -1 || secondStr.indexOf(firstStr) !== -1) {
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
        let index = 1;
        const errorMessages = [];
        for (const er of result.errors) {
            errorMessages.push(` ${index}. ${er.msg} - <${er.value}> for <${er.param}> in ${er.location}`);
            index++;
        }
        throw new InputValidationError(errorMessages);
    };

    static getAgeFromBirthDate = (birthdate: Date, onlyYears = false): string => {
        if (birthdate === null) {
            return '';
        }
        const bd = birthdate.getTime();
        const milsecs = Date.now() - bd;

        const milsecInYear = 365 * 24 * 3600 * 1000;
        const milsecsInMonth = 30 * 24 * 3600 * 1000;

        const years = Math.floor(milsecs / milsecInYear);
        const remainder = milsecs % milsecInYear;
        const months = Math.floor(remainder / milsecsInMonth);

        let age = years > 0 ? years.toString() + ' years' : '';
        if (onlyYears) {
            if (age.length === 0) {
                return '0 years';
            }
            return age;
        }
        age = age + (months > 0 ? ' and ' + months.toString() + ' months' : '');
        return age;
    };

    static guessPrefixByGender = (gender: Gender) => {
        if (gender === 'Male' || gender === 'male') {
            return 'Mr.';
        }
        if (gender === 'Female' || gender === 'female') {
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
        let displayName: string = prefix + firstName + lastName;
        displayName = displayName.trim();
        if (displayName.length === 0) {
            displayName = 'unknown';
        }
        return displayName;
    };

    static getGender = (str: string): Gender => {
        if (
            str !== 'Male' &&
            str !== 'Female' &&
            str !== 'male' &&
            str !== 'female' &&
            str !== 'Other' &&
            str !== 'other'
        ) {
            return 'Unknown';
        }
        return str;
    };

    static formatDate = (date) => {
        const d = new Date(date);
        const month = ('00' + (d.getMonth() + 1).toString()).slice(-2);
        const day = ('00' + d.getDate().toString()).slice(-2);
        const year = d.getFullYear();
        return [year, month, day].join('-');
    };

    static isAlpha = (c) => {
        const alphas = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        return alphas.indexOf(c) !== -1;
    };

    static isAlphaVowel = (c) => {
        const alphas = 'aeiouAEIOU';
        return alphas.indexOf(c) !== -1;
    };

    static isDigit = (c) => {
        const digits = '0123456789';
        return digits.indexOf(c) !== -1;
    };

    static isAlphaNum = (c) => {
        return Helper.isAlpha(c) || Helper.isDigit(c);
    };

    static hasAlpha = (str: string) => {
        for (const c of str) {
            if (Helper.isAlpha(c)) {
                return true;
            }
        }
        return false;
    };

    static getDigitsOnly = (str: string): string => {
        let temp = '';
        for (let x = 0; x < str.length; x++) {
            const c = str.charAt(x);
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

    static generatePassword(): string {
        const password = generate({
            length    : 8,
            numbers   : true,
            lowercase : true,
            uppercase : true,
            symbols   : true,
        });
        return password;
    }

    static sanitizePhone(phone: string) {
        const tokens = phone.split('-');
        let countryCode = tokens[0];
        let phoneNumber = tokens.length > 2 ? tokens.slice(1, ).join() : tokens[1];
        countryCode = '+' + Helper.getDigitsOnly(countryCode);
        phoneNumber = Helper.getDigitsOnly(phoneNumber);
        return countryCode + '-' + phoneNumber;
    }

    static validatePhone(phone: string) {
        const tokens = phone.split('-');
        const countryCode = tokens[0];
        const phoneNumber = tokens[1];
        const validCountryCode = Helper.isStr(countryCode) && countryCode.length > 0;
        if (!validCountryCode) {
            return Promise.reject('Invalid country code');
        }
        const validPhoneNumber = Helper.isStr(phoneNumber) && phoneNumber.length > 9;
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
    };

    public static isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    };

    public static encodeToBase64 = (str: string) => {
        const buffer = Buffer.from(str, 'utf-8');
        return buffer.toString('base64');
    };

    public static decodeFromBase64 = (str: string) => {
        const buffer = Buffer.from(str, 'base64');
        return buffer.toString('utf-8');
    };

    public static hash = (str: string) => {
        const salt = genSaltSync(8);
        const hashed = hashSync(str, salt);
        return hashed;
    };

    public static compare = (str: string, hashed: string) => {
        return compareSync(str, hashed);
    };

    //Reference: https://github.com/zishon89us/node-cheat/blob/master/stackoverflow_answers/crypto-create-cipheriv.js#L2

    public static encrypt = (str: string) => {
        const algorithm = 'aes-256-ctr';
        const LENGTH = 16;
        const iv = crypto.randomBytes(LENGTH);
        const cipher = crypto.createCipheriv(algorithm, Buffer.from(process.env.CIPHER_SALT, 'hex'), iv);
        let encrypted = cipher.update(str);
        encrypted = Buffer.concat([encrypted, cipher.final()]);
        return iv.toString('hex') + ':' + encrypted.toString('hex');
    };

    public static decrypt = (str: string) => {
        const algorithm = 'aes-256-ctr';
        const tokens = str.split(':');
        const iv = Buffer.from(tokens.shift(), 'hex');
        const encryptedText = Buffer.from(tokens.join(':'), 'hex');
        const decipher = crypto.createDecipheriv(algorithm, Buffer.from(process.env.CIPHER_SALT, 'hex'), iv);
        let decrypted = decipher.update(encryptedText);
        decrypted = Buffer.concat([decrypted, decipher.final()]);
        return decrypted.toString();
    }

    public static getPossiblePhoneNumbers = (phone) => {

        if (phone == null) {
            return [];
        }
        
        let phoneTemp = phone;
        phoneTemp = phoneTemp.trim();
        const searchFors = ['+91', '+1'];
        const possiblePhoneNumbers = [phone];

        let phonePrefix = "";

        for (var s of searchFors) {
            if (phoneTemp.startsWith(s)) {
                phonePrefix = s;
                phoneTemp = phoneTemp.replace(s, '');
                phoneTemp = phoneTemp.replace('-', '');
            }
        }
    
        if (phonePrefix) {
            possiblePhoneNumbers.push(phonePrefix + phoneTemp);
            possiblePhoneNumbers.push(phonePrefix + "-" + phoneTemp);
            possiblePhoneNumbers.push(phoneTemp);
    
        } else {
            possiblePhoneNumbers.push("+91" + phoneTemp);
            possiblePhoneNumbers.push("+91-" + phoneTemp);
    
            possiblePhoneNumbers.push("+1" + phoneTemp);
            possiblePhoneNumbers.push("+1-" + phoneTemp);
            possiblePhoneNumbers.push(phoneTemp);
        }
        return possiblePhoneNumbers;
    }

}
