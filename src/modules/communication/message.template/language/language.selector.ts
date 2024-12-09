import { SupportedLanguage } from '../../../../domain.types/users/user/user.types';
import * as EnglishMessageTemplates from './english.json';
import * as SpanishMessageTemplates from './spanish.json';

export const loadLanguageTemplates = (preferredLanguage: SupportedLanguage = SupportedLanguage.English) => {
    
    switch (preferredLanguage) {
        case SupportedLanguage.English:
            return EnglishMessageTemplates;

        case SupportedLanguage.Spanish:
            return SpanishMessageTemplates;

        default:
            return EnglishMessageTemplates;
    }
};
