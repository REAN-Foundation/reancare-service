import { Request, Response, NextFunction } from 'express';
import { Span, context, SpanKind, Tracer, trace, Context } from '@opentelemetry/api';
import { Helper } from '../common/helper';
import { CustomAuthorizer } from '../auth/custom/custom.authorizer';
import { ResponseHandler } from '../common/response.handler';

/////////////////////////////////////////////////////////////////////////////////////////////////

// Authorization decorator

export function authorize(context: string, allowAnonymous = false) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = async function(request: Request, response: Response) {
            request.context = context;
            if (allowAnonymous) {
                // If anonymous access is allowed, directly call the original method
                await originalMethod.apply(this, request, response);
                return;
            }
            var authorizer = new CustomAuthorizer();
            const authorized = authorizer.authorize(request);
            if (authorized) {
                // If authorized, call the original method
                await originalMethod.apply(this, request, response);
                return;
            } else {
                // If not authorized, return a 403 Forbidden response
                ResponseHandler.failure(request, response, 'Unauthorized', 403);
            }
        };
    };
}

/////////////////////////////////////////////////////////////////////////////////////////////////

// Open-telemetry Tracing decorator

const TELEMETRY_ENABLED = process.env.ENABLE_TELEMETRY === 'true' ? true : false;

export function span (operation: string) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function(request: Request, response: Response, next: NextFunction) {
            if (!TELEMETRY_ENABLED) {
                originalMethod.call(this, request, response, next);
                return;
            }
            // Create a span
            const serviceName = Helper.getServiceName();
            const tracer: Tracer = trace.getTracer(serviceName);
            const span: Span = tracer.startSpan(operation, {
                kind : SpanKind.SERVER,
            });
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const spanContext: Context = trace.setSpan(context.active(), span);
            // context.with(spanContext, () => {
            //     // Call the original method
            //     originalMethod.call(this, request, response, next);
            // });
            //OR
            try {
                return originalMethod.call(this, request, response, next);
            }
            catch (error) {
                span.recordException(error);
                throw error;
            }
            finally {
                span.end();
            }
        };
    };
}

// // Export the decorator functions
// module.exports = { authorize, span };
