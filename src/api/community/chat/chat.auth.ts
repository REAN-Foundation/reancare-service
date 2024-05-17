import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';
///////////////////////////////////////////////////////////////////////////////////////
export class ChatAuth {

    static readonly _baseContext = `Community.Chat`;

    static readonly addUserToConversation: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddUserToConversation`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly deleteConversation: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteConversation`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

    static readonly deleteMessage: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteMessage`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getConversationBetweenTwoUsers: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetConversationBetweenTwoUsers`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getConversationById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetConversationById`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getConversationMessages: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetConversationMessages`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly getMarkedConversationsForUser: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetMarkedConversationsForUser`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getMessage: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetMessage`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getRecentConversationsForUser: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetRecentConversationsForUser`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly removeUserFromConversation: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.RemoveUserFromConversation`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly searchUserConversations: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.SearchUserConversations`,
        Ownership           : ResourceOwnership.System,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly sendMessage: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SendMessage`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly startConversation: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.StartConversation`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly updateConversation: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateConversation`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updateMessage: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateMessage`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.UpdateOne,
    };

}

