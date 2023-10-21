
export class BaseController {

    _resourceName: string = null;

    constructor(resourceName: string) {
        this._resourceName = resourceName;
    }

}
