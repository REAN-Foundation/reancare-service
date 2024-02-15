import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
import child_process from 'child_process';
import * as crypto from 'crypto';
import express from 'express';
import * as fs from 'fs';
import * as os from 'os';
import { generate } from 'generate-password';
import mime = require('mime-types');
import path from 'path';
import { ConfigurationManager } from '../config/configuration.manager';
import { Gender, OSType } from '../domain.types/miscellaneous/system.types';
import { InputValidationError } from './input.validation.error';
import { TimeHelper } from './time.helper';
import Countries from './misc/countries';
import { DateStringFormat } from '../domain.types/miscellaneous/time.types';
import { Logger } from './logger';

////////////////////////////////////////////////////////////////////////

export class Helper {

    static calculateBMI = (
        currentHeight: number,
        heightUnits: string,
        currentWeight: number,
        weightUnits: string) => {

        let height = currentHeight;
        let weight = currentWeight;
        let height_square = 0;
        let bmi = null;
        let heightStr = 'Unspecified';
        let weightStr = 'Unspecified';

        if (currentWeight == null && currentHeight == null) {
            return { bmi, weightStr, heightStr };
        }

        if (currentHeight) {
            if (heightUnits === 'feet' || heightUnits === 'ft') {
                height = height * 30.48; //Convert feet to cms
            }
            const heightInFeet = (height / 30.48);
            const feet = (Math.floor(heightInFeet)).toFixed();
            const inches = (Math.floor((heightInFeet % 1.0) * 12)).toFixed();

            heightStr = height.toFixed() + ` cms (${feet} feet, ${inches} inches)`;

            height = height / 100; //Convert to meteres
            height_square = height * height;
        }

        if (currentWeight) {
            if (weightUnits === 'lbs' || weightUnits === 'lb') {
                weight = weight * 0.453592;
            }
            if (!weightUnits) {
                weightUnits = 'Kg';
            }
            const weightInLbs = weight / 0.453592;
            weightStr = weight.toFixed() + ` Kg (${weightInLbs.toFixed()} lbs)`;
        }

        if (height_square === 0) {
            return { bmi, weightStr, heightStr };
        }

        bmi = weight / height_square;
        return { bmi, weightStr, heightStr };
    };

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
    };

    static writeTextToFile = async (text: string, filename: string) => {
        try {
            var uploadFolder = ConfigurationManager.UploadTemporaryFolder();
            var dateFolder = TimeHelper.getDateString(new Date(), DateStringFormat.YYYY_MM_DD);
            var fileFolder = path.join(uploadFolder, dateFolder);
            if (!fs.existsSync(fileFolder)) {
                await fs.promises.mkdir(fileFolder, { recursive: true });
            }
            const filePath = path.join(fileFolder, filename);
            fs.writeFileSync(filePath, text);
            return filePath;
        }
        catch (error) {
            Logger.instance().log(error.message);
        }
    };

    static hasProperty = (obj, prop) => {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    };

    static getOSType = () => {
        var type = os.type();
        switch (type) {
            case 'Darwin':
                return OSType.MacOS;
            case 'Linux':
                return OSType.Linux;
            case 'Windows_NT':
                return OSType.Windows;
            default:
                return OSType.Linux;
        }
    };

    static isUrl = (str) => {
        if (!str) {
            return false;
        }
        try {
            new URL(str);
            return true;
        } catch (err) {
            return false;
        }
    };

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
    };

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
        if (gender === Gender.Male) {
            return 'Mr.';
        }
        if (gender === Gender.Female) {
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
        if (!str) {
            return temp;
        }
        for (let x = 0; x < str.length; x++) {
            const c = str.charAt(x);
            if (Helper.isDigit(c)) {
                temp += c;
            }
        }
        return temp;
    };

    static checkStr(val: any) {
        if (val === null || val === undefined || typeof val !== 'string') {
            return null;
        }
        return val;
    }

    static isStr(val: any): boolean {
        if (val === null || val === undefined || typeof val !== 'string') {
            return false;
        }
        return true;
    }

    static checkNum(val: any): number {
        if (val === null || val === undefined || typeof val !== 'number') {
            return null;
        }
        return val;
    }

    static isNum(val: any): boolean {
        if (val === null || val === undefined || typeof val !== 'number') {
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
        if (!phone) {
            return phone;
        }
        if (phone.includes('-')) {
            const tokens = phone.split('-');
            let countryCode = tokens[0];
            let phoneNumber = tokens.length > 2 ? tokens.slice(1, ).join() : tokens[1];
            countryCode = '+' + Helper.getDigitsOnly(countryCode);
            phoneNumber = Helper.getDigitsOnly(phoneNumber);
            return countryCode + '-' + phoneNumber;
        }
        else if (phone.startsWith('+')) {
            var countryCodes = Countries.map(x => x.PhoneCode);
            var countryCodesSorted = countryCodes.sort((a,b) => b.length - a.length);
            for (var cc of countryCodesSorted) {
                if (phone.startsWith(cc)) {
                    var phoneNumber = phone.substring(cc.length);
                    phoneNumber = Helper.getDigitsOnly(phoneNumber);
                    return cc + '-' + phoneNumber;
                }
            }
        }
        return phone;
    }

    static validatePhone(phone: string) {
        const tokens = phone.split('-');
        const countryCode = tokens[0];
        const phoneNumber = tokens[1];
        const validCountryCode = Helper.isStr(countryCode) && countryCode.length > 0;
        if (!validCountryCode) {
            return Promise.reject('Invalid country code');
        }
        const validPhoneNumber = Helper.isStr(phoneNumber) && phoneNumber.length >= 9;
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
    };

    public static getPossiblePhoneNumbers = (phone) => {

        if (phone == null) {
            return [];
        }

        let phoneTemp = phone;
        phoneTemp = phoneTemp.trim();
        const countryCodes = Countries.map(x => x.PhoneCode);
        const searchFors = countryCodes;
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

            var possibles = Countries.map(x => {
                return x.PhoneCode + phoneTemp;
            });
            possiblePhoneNumbers.push(...possibles);
            possibles = Countries.map(x => {
                return x.PhoneCode + "-" + phoneTemp;
            });
            possiblePhoneNumbers.push(...possibles);

            possiblePhoneNumbers.push(phoneTemp);
        }
        return possiblePhoneNumbers;
    };

    public static getFileExtension = (filename: string) => {
        var ext = /^.+\.([^.]+)$/.exec(filename);
        return ext == null ? "" : ext[1];
    };

    public static getFilenameFromFilePath = (filepath: string) => {
        return path.basename(filepath);
    };

    public static generateDisplayId = (prefix = null) => {
        var tmp = (Math.floor(Math.random() * 9000000000) + 1000000000).toString();
        var displayId = tmp.slice(0, 4) + '-' + tmp.slice(4, 8);
        var identifier = displayId;
        if (prefix != null){
            identifier = prefix + '-' + identifier;
        }
        return identifier;
    };

    public static generateDisplayCode = (prefix = null) => {
        const code = generate({
            length    : 24,
            numbers   : true,
            lowercase : true,
            uppercase : false,
            symbols   : false,
        });
        return prefix ? prefix + '#' + code : code;
    };

    public static convertCamelCaseToPascalCase = (str: string): string => {
        if (str.length > 0) {
            return str.charAt(0).toUpperCase() + str.substring(1);
        }
        return str;
    };

    public static generateDownloadFolderPath = async() => {

        var timestamp = TimeHelper.timestamp(new Date());
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        var downloadFolderPath = path.join(tempDownloadFolder, timestamp);

        await fs.promises.mkdir(downloadFolderPath, { recursive: true });

        return downloadFolderPath;
    };

    public static createTempDownloadFolder = async() => {
        var tempDownloadFolder = ConfigurationManager.DownloadTemporaryFolder();
        if (fs.existsSync(tempDownloadFolder)) {
            return tempDownloadFolder;
        }
        await fs.promises.mkdir(tempDownloadFolder, { recursive: true });
        return tempDownloadFolder;
    };

    public static createTempUploadFolder = async() => {
        var tempUploadFolder = ConfigurationManager.UploadTemporaryFolder();
        if (fs.existsSync(tempUploadFolder)) {
            return tempUploadFolder;
        }
        await fs.promises.mkdir(tempUploadFolder, { recursive: true });
        return tempUploadFolder;
    };

    public static strToFilename = (str: string, extension: string, delimiter: string, limitTo = 32): string => {
        var tmp = str.replace(' ', delimiter);
        tmp = tmp.substring(0, limitTo);
        var ext = extension.startsWith('.') ? extension : '.' + extension;
        return tmp + ext;
    };

    public static getMimeType = (pathOrExtension: string) => {
        var mimeType = mime.lookup(pathOrExtension);
        if (!mimeType) {
            mimeType = 'text/plain';
        }
        return mimeType;
    };

    public static getValueForEitherKeys = (obj: any, keys: string[]): string => {
        const existingKeys = Object.keys(obj);
        for (var key of keys) {
            var found = existingKeys.includes(key);
            if (found) {
                return obj[key];
            }
        }
        return null;
    };

    public static getEnumKeyFromValue = (obj: any, value: string): string => {
        var key = Object.keys(obj).find(key => obj[key] === value);
        return key || null;
    };

    public static getDefaultProfileImageForGender = (gender: Gender): string => {
        const cwd = process.cwd();
        const imageLocation = path.join(cwd, 'assets/images/stock.profile.images/');
        if (gender === Gender.Male) {
            return path.join(imageLocation, 'male_white.png');
        }
        else if (gender === Gender.Female) {
            return path.join(imageLocation, 'female_white.png');
        }
        else {
            return path.join(imageLocation, 'male_african.png');
        }
    };

    public static getIconsPath = (filename: string): string => {
        const cwd = process.cwd();
        const imageLocation = path.join(cwd, 'assets/images/icons/');
        return path.join(imageLocation, filename);
    };

    public static sortObjectKeysAlphabetically = (obj) => {
        const sorted = Object.keys(obj)
            .sort()
            .reduce((accumulator, key) => {
                accumulator[key] = obj[key];

                return accumulator;
            }, {});
        return sorted;
    };

    public static parseIntegerFromString = (input: string): number | null => {
        try {
          // Attempt to parse the integer from the input string
          const digitRegex = /^[0-9]+$/;
          digitRegex.test(input);
          const parsedInt = digitRegex.test(input) ? parseInt(input, 10) : null;
          return parsedInt;
        } catch (error: any) {
          Logger.instance().log(`Error: ${error.message}`);
          return null;
        }
    };

}
