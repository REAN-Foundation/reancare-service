import { Logger } from '../../common/logger';
import { Helper } from '../../common/helper';
import { ILlmService } from './llm.service.interface';
import needle = require('needle');

///////////////////////////////////////////////////////////////////////////////////

const headers = {
    'Content-Type'    : 'application/json',
    Accept            : '*/*',
    'Cache-Control'   : 'no-cache',
    'Accept-Encoding' : 'gzip, deflate, br',
    Connection        : 'keep-alive',
};

///////////////////////////////////////////////////////////////////////////////////

export class LlmService implements ILlmService {

    deleteCache = async (clientName: string, phone: string): Promise<boolean> => {
        try {
            const url = `${process.env.LLM_SERVICE_BASE_URL}/llm_service/cache/${clientName}/${phone}`;
            const options = Helper.getNeedleOptions(headers);
            const response = await needle('delete', url, null, options);
            if (response.statusCode === 200) {
                Logger.instance().log(`Successfully deleted LLM service cache for user: ${phone}`);
                return true;
            }
            Logger.instance().log(`Unable to delete LLM service cache. Status: ${response.statusCode}`);
            return false;
            
        } catch (error: any) {
            Logger.instance().log(`Error deleting LLM service cache: ${error.message}`);
            return false;
        }
    };

}
