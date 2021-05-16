import * as fs from 'fs';
import child_process from 'child_process';

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
                function (
                    error: Error,
                    standardOutput: string,
                    standardError: string
                ) {
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
    }
    
    static getSessionHeaders = (token: string) => {
        return {
            'Content-Type': 'application/json; charset=utf-8',
            Accept: '*/*',
            'Cache-Control': 'no-cache',
            'Accept-Encoding': 'gzip, deflate, br',
            Connection: 'keep-alive',
            Authorization: 'Bearer ' + token,
        };
    }

    static getNeedleOptions = (headers) => {
        return {
            headers: headers,
            compressed: true,
            json: true,
        };
    }

    static removeArrayDuplicates<Type>(arr: Type[]): Type[] {
        function onlyUnique(value, index, self) {
            return self.indexOf(value) === index;
        }
        var unique = arr.filter(onlyUnique);
        return unique;
    }
    
    static areStringsOverlapping = (firstStr:string, secondStr:string) =>{
        if(firstStr.indexOf(secondStr) != -1 || secondStr.indexOf(firstStr) != -1){
            return true;
        }
        return false;
    }

    static areOffsetsOverlapping = (
        firstStart: number,
        firstEnd: number,
        secondStart: number,
        secondEnd: number): boolean => {

        if ((firstStart <= secondStart && secondStart >= firstEnd) ||
            (firstStart <= secondEnd && secondEnd >= firstEnd) ||
            (secondStart <= firstStart && firstStart >= secondEnd) ||
            (secondStart <= firstEnd && firstEnd >= secondEnd)) {
            return true;
        }
        return false;
    }
}

