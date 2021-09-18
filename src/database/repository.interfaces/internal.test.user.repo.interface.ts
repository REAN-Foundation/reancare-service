
export interface IInternalTestUserRepo {

    create(phone: string): Promise<any>;

    isInternalTestUser(phone: string): Promise<boolean>;

}
