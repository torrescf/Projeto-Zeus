import { ActionMetadata } from '../metadata/ActionMetadata';
import { ControllerMetadata } from '../metadata/ControllerMetadata';
import { InterceptorMetadata } from '../metadata/InterceptorMetadata';
import { MiddlewareMetadata } from '../metadata/MiddlewareMetadata';
import { ParamMetadata } from '../metadata/ParamMetadata';
import { ResponseHandlerMetadata } from '../metadata/ResponseHandleMetadata';
import { UseMetadata } from '../metadata/UseMetadata';
import { getMetadataArgsStorage } from '../index';
/**
 * Builds metadata from the given metadata arguments.
 */
export class MetadataBuilder {
    constructor(options) {
        this.options = options;
    }
    // -------------------------------------------------------------------------
    // Public Methods
    // -------------------------------------------------------------------------
    /**
     * Builds controller metadata from a registered controller metadata args.
     */
    buildControllerMetadata(classes) {
        return this.createControllers(classes);
    }
    /**
     * Builds middleware metadata from a registered middleware metadata args.
     */
    buildMiddlewareMetadata(classes) {
        return this.createMiddlewares(classes);
    }
    /**
     * Builds interceptor metadata from a registered interceptor metadata args.
     */
    buildInterceptorMetadata(classes) {
        return this.createInterceptors(classes);
    }
    // -------------------------------------------------------------------------
    // Protected Methods
    // -------------------------------------------------------------------------
    /**
     * Creates middleware metadatas.
     */
    createMiddlewares(classes) {
        const middlewares = !classes
            ? getMetadataArgsStorage().middlewares
            : getMetadataArgsStorage().filterMiddlewareMetadatasForClasses(classes);
        return middlewares.map(middlewareArgs => new MiddlewareMetadata(middlewareArgs));
    }
    /**
     * Creates interceptor metadatas.
     */
    createInterceptors(classes) {
        const interceptors = !classes
            ? getMetadataArgsStorage().interceptors
            : getMetadataArgsStorage().filterInterceptorMetadatasForClasses(classes);
        return interceptors.map(interceptorArgs => new InterceptorMetadata({
            ...interceptorArgs,
            interceptor: interceptorArgs.target,
        }));
    }
    /**
     * Creates controller metadatas.
     */
    createControllers(classes) {
        const controllers = !classes
            ? getMetadataArgsStorage().controllers
            : getMetadataArgsStorage().filterControllerMetadatasForClasses(classes);
        return controllers.map(controllerArgs => {
            const controller = new ControllerMetadata(controllerArgs);
            controller.build(this.createControllerResponseHandlers(controller));
            controller.actions = this.createActions(controller);
            controller.uses = this.createControllerUses(controller);
            controller.interceptors = this.createControllerInterceptorUses(controller);
            return controller;
        });
    }
    /**
     * Creates action metadatas.
     */
    createActions(controller) {
        const actionsWithTarget = [];
        for (let target = controller.target; target; target = Object.getPrototypeOf(target)) {
            const actions = getMetadataArgsStorage().filterActionsWithTarget(target);
            const methods = actionsWithTarget.map(a => a.method);
            actions
                .filter(({ method }) => !methods.includes(method))
                .forEach(actionArgs => {
                const action = new ActionMetadata(controller, { ...actionArgs, target: controller.target }, this.options);
                action.options = { ...controller.options, ...actionArgs.options };
                action.params = this.createParams(action);
                action.uses = this.createActionUses(action);
                action.interceptors = this.createActionInterceptorUses(action);
                action.build(this.createActionResponseHandlers(action));
                actionsWithTarget.push(action);
            });
        }
        return actionsWithTarget;
    }
    /**
     * Creates param metadatas.
     */
    createParams(action) {
        return getMetadataArgsStorage()
            .filterParamsWithTargetAndMethod(action.target, action.method)
            .map(paramArgs => new ParamMetadata(action, this.decorateDefaultParamOptions(paramArgs)));
    }
    /**
     * Creates response handler metadatas for action.
     */
    createActionResponseHandlers(action) {
        return getMetadataArgsStorage()
            .filterResponseHandlersWithTargetAndMethod(action.target, action.method)
            .map(handlerArgs => new ResponseHandlerMetadata(handlerArgs));
    }
    /**
     * Creates response handler metadatas for controller.
     */
    createControllerResponseHandlers(controller) {
        return getMetadataArgsStorage()
            .filterResponseHandlersWithTarget(controller.target)
            .map(handlerArgs => new ResponseHandlerMetadata(handlerArgs));
    }
    /**
     * Creates use metadatas for actions.
     */
    createActionUses(action) {
        return getMetadataArgsStorage()
            .filterUsesWithTargetAndMethod(action.target, action.method)
            .map(useArgs => new UseMetadata(useArgs));
    }
    /**
     * Creates use interceptors for actions.
     */
    createActionInterceptorUses(action) {
        return getMetadataArgsStorage()
            .filterInterceptorUsesWithTargetAndMethod(action.target, action.method)
            .map(useArgs => new InterceptorMetadata(useArgs));
    }
    /**
     * Creates use metadatas for controllers.
     */
    createControllerUses(controller) {
        return getMetadataArgsStorage()
            .filterUsesWithTargetAndMethod(controller.target, undefined)
            .map(useArgs => new UseMetadata(useArgs));
    }
    /**
     * Creates use interceptors for controllers.
     */
    createControllerInterceptorUses(controller) {
        return getMetadataArgsStorage()
            .filterInterceptorUsesWithTargetAndMethod(controller.target, undefined)
            .map(useArgs => new InterceptorMetadata(useArgs));
    }
    /**
     * Decorate paramArgs with default settings
     */
    decorateDefaultParamOptions(paramArgs) {
        const options = this.options.defaults && this.options.defaults.paramOptions;
        if (!options)
            return paramArgs;
        if (paramArgs.required === undefined)
            paramArgs.required = options.required || false;
        return paramArgs;
    }
}
//# sourceMappingURL=MetadataBuilder.js.map