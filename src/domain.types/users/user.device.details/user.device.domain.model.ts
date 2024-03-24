
export interface UserDeviceDetailsDomainModel {
    id?               : string,
    Token?            : string;
    DeviceIdentifier? : string;
    UserId?           : string;
    DeviceName?       : string;
    OSType?           : string;
    OSVersion?        : string;
    AppName?          : string;
    AppVersion?       : string;
    ChangeCount?      : number;
}

export interface DeviceDetails {
    OSType?: string;
    Count?: number;
}
