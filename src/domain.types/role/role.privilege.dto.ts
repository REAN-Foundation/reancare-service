
export interface RolePrivilegeDto {
    id        : string,
    RoleId    : number;
    RoleName  : string;
    Privilege : string;
    Scope     : string;
    Enabled   : boolean;
}
