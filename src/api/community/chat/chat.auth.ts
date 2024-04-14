import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';
///////////////////////////////////////////////////////////////////////////////////////
export class ChatAuth {

static _baseContext = `Community.Chat`;

static addUserToConversation: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.AddUserToConversation`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static deleteConversation: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.DeleteConversation`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.DeleteOne,
};

static deleteMessage: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.DeleteMessage`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static getConversationBetweenTwoUsers: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetConversationBetweenTwoUsers`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static getConversationById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetConversationById`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getConversationMessages: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetConversationMessages`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getMarkedConversationsForUser: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetMarkedConversationsForUser`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getMessage: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetMessage`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static getRecentConversationsForUser: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetRecentConversationsForUser`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static removeUserFromConversation: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.RemoveUserFromConversation`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static searchUserConversations: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.SearchUserConversations`,
    Ownership           : ResourceOwnership.Owner,
    ActionScope         : ActionScope.Owner,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

static sendMessage: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.SendMessage`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static startConversation: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.StartConversation`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static updateConversation: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.UpdateConversation`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.UpdateOne,
};

static updateMessage: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.UpdateMessage`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

}

