
export class TypeHandler {

    static checkStr(val:any): string {
        if(typeof(val) === null || typeof(val) === undefined || typeof(val) !== 'string') {
            return null;
        }
        return val;
    }

    static checkNum(val:any): number {
        if(val === null || typeof(val) === 'undefined' || typeof(val) !== 'number') {
            return null;
        }
        return val;
    }

    static checkObj(val:any): object {
        if(val === null || typeof(val) === 'undefined' || typeof(val) !== 'object') {
            return null;
        }
        return val;
    }
}