import { Action } from '../../Action';
import { ActionMetadata } from '../../metadata/ActionMetadata';
import { BaseDriver } from '../BaseDriver';
import { MiddlewareMetadata } from '../../metadata/MiddlewareMetadata';
import { ParamMetadata } from '../../metadata/ParamMetadata';
import { UseMetadata } from '../../metadata/UseMetadata';
/**
 * Integration with koa framework.
 */
export declare class KoaDriver extends BaseDriver {
    koa?: any;
    router?: any;
    constructor(koa?: any, router?: any);
    /**
     * Initializes the things driver needs before routes and middleware registration.
     */
    initialize(): void;
    /**
     * Registers middleware that run before controller actions.
     */
    registerMiddleware(middleware: MiddlewareMetadata): void;
    /**
     * Registers action in the driver.
     */
    registerAction(actionMetadata: ActionMetadata, executeCallback: (options: Action) => any): void;
    /**
     * Registers all routes in the framework.
     */
    registerRoutes(): void;
    /**
     * Gets param from the request.
     */
    getParamFromRequest(actionOptions: Action, param: ParamMetadata): any;
    /**
     * Handles result of successfully executed controller action.
     */
    handleSuccess(result: any, action: ActionMetadata, options: Action): void;
    /**
     * Handles result of failed executed controller action.
     */
    handleError(error: any, action: ActionMetadata | undefined, options: Action): Promise<void>;
    /**
     * Creates middlewares from the given "use"-s.
     */
    protected prepareMiddlewares(uses: UseMetadata[]): Function[];
    /**
     * Dynamically loads koa module.
     */
    protected loadKoa(): void;
    /**
     * Dynamically loads @koa/router module.
     */
    private loadRouter;
    /**
     * Dynamically loads @koa/multer module.
     */
    private loadMulter;
}
