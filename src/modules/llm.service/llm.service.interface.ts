
export interface ILlmService {
    
    deleteCache(clientName: string, phone: string): Promise<boolean>;

}
