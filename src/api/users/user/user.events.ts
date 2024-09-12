import express from 'express';
import { AnalyticsEvent, AnalyticsEventCategory, AnalyticsEventSubject, AnalyticsEventType } from '../../../modules/analytics/analytics.types';
import { AnalyticsHandler } from '../../../modules/analytics/analytics.handler';
import { UserDetailsDto } from '../../../domain.types/users/user/user.dto';
import { getCommonEventParams } from '../../../modules/analytics/analytics.common';

///////////////////////////////////////////////////////////////////////////////////////

export class UserEvents {

    static async onUserCreated(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                return;
            }
            const params = getCommonEventParams(request, user);
            const message = `User '${user.id}' account is created.`;
            const eventName = AnalyticsEventType.UserCreate;
            const eventSubject = AnalyticsEventSubject.UserAccount;
            const eventCategory = AnalyticsEventCategory.UserAccount;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.createUser(user);
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserUpdated(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserUpdate;
            const eventSubject = AnalyticsEventSubject.UserAccount;
            const eventCategory = AnalyticsEventCategory.UserAccount;
            const message = `User '${user.id}' account is updated.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserDeleted(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserDelete;
            const eventSubject = AnalyticsEventSubject.UserAccount;
            const eventCategory = AnalyticsEventCategory.UserAccount;
            const message = `User '${user.id}' account is deleted.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
            AnalyticsHandler.deleteUser(user.id);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserLoginWithPassword(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserLoginWithPassword;
            const eventSubject = AnalyticsEventSubject.LoginSession;
            const eventCategory = AnalyticsEventCategory.LoginSession;
            const message = `User '${user.id}' logged in using pasword.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserLoginWithOtp(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserLoginWithOtp;
            const eventSubject = AnalyticsEventSubject.LoginSession;
            const eventCategory = AnalyticsEventCategory.LoginSession;
            const message = `User '${user.id}' logged in using OTP.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserLogout(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserLogout;
            const eventSubject = AnalyticsEventSubject.LoginSession;
            const eventCategory = AnalyticsEventCategory.LoginSession;
            const message = `User '${user.id}' logged out.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserPasswordChanged(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserPasswordChange;
            const eventSubject = AnalyticsEventSubject.UserAccount;
            const eventCategory = AnalyticsEventCategory.UserAccount;
            const message = `User '${user.id}' changed password.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onUserPasswordReset(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserPasswordReset;
            const eventSubject = AnalyticsEventSubject.UserAccount;
            const eventCategory = AnalyticsEventCategory.UserAccount;
            const message = `User '${user.id}' password reset.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onSendPasswordResetCode(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserSendPasswordResetCode;
            const eventSubject = AnalyticsEventSubject.UserAccount;
            const eventCategory = AnalyticsEventCategory.UserAccount;
            const message = `User '${user.id}' password reset code sent.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

    static async onGenerateOtp(request: express.Request, user: UserDetailsDto) {
        try {
            if (!user) {
                return;
            }
            if (user.IsTestUser) {
                // Do not record test user events
                return;
            }
            const params = getCommonEventParams(request, user);
            const eventName = AnalyticsEventType.UserGenerateOtp;
            const eventSubject = AnalyticsEventSubject.LoginSession;
            const eventCategory = AnalyticsEventCategory.LoginSession;
            const message = `User '${user.id}' OTP generated.`;
            const event: AnalyticsEvent = {
                ...params,
                ResourceId: user.id,
                ResourceType: 'user',
                SourceVersion: null,
                EventName: eventName,
                EventSubject: eventSubject,
                EventCategory: eventCategory,
                ActionStatement: message,
                Attributes: {
                    RoleId: user.Role.id ?? (user.RoleId ?? null),
                    RoleName: user.Role? user.Role.RoleName : null,
                }
            };
            AnalyticsHandler.pushEvent(event);
        } catch (error) {
            console.error(error);
        }
    }

}

