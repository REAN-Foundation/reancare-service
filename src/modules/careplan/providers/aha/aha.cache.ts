export class AhaCache {

    static AhaWebToken: string;

    static ExpiresOn: Date;

    constructor() {
        AhaCache.AhaWebToken = '';
    }

    static GetWebToken() {
        var currentTime = new Date();
        if (currentTime < AhaCache.ExpiresOn) {
            return AhaCache.AhaWebToken;
        } else {
            return null;
        }
    }

    static GetTokenExpirationTime() {
        return AhaCache.ExpiresOn;
    }

    static SetWebToken(token, expirationSeconds) {
        var currentTime = new Date();
        AhaCache.ExpiresOn = new Date(currentTime.setSeconds(currentTime.getSeconds() + expirationSeconds));
        AhaCache.AhaWebToken = token;
    }

}

////////////////////////////////////////////////////////////////
