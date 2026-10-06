const Handlebars = require('handlebars')
const CACHE = {}
/**
 * @type {Required<Pick<import('./protocol').ExecutorTemplateHandlebarsOption, 'outputKey'|'paramsKey'>>}
 */
const DEFUALT_OPTION = {
    outputKey: 'output',
    paramsKey: 'params'

}

class ExecutorTemplateHadlebars {
    /**
     * 
     * @param {import('@kyo-kan/engine/protocol/types').Context<any, import('../../../api/functions/context_id/protocol').MaybeApiContextId} context
     * @param {*} reuest
     * @param {import('./protocol').ExecutorTemplateHandlebarsOption} options 
     *   
     */
    enter(context, reuest, options) {
        let cacheIds = [context.states.controll.getExecutorId()]
        if ('ContextId' in context.functions === true) {
            cacheIds.unshift(context.functions.ContextId.getId())


        }
        const cacheId = cacheIds.join('_')

        if (cacheId in CACHE === false) {
            const unCacheTemplate = Handlebars.compile(options.template)
            CACHE[cacheId] = unCacheTemplate


        }
        const paramsKey = 'paramsKey' in options ? options.paramsKey : DEFUALT_OPTION.paramsKey
        const outputKey = 'outputKey' in options ? options.outputKey : DEFUALT_OPTION.outputKey
        const currentWorkflowBord = context.bords.getCurrentWorkflow()
        const template = CACHE[cacheId]
        const output = template(currentWorkflowBord[paramsKey])
        currentWorkflowBord[outputKey] = output
        context.bords.updateCurrentWorkflowBord(currentWorkflowBord, true)


    }


}