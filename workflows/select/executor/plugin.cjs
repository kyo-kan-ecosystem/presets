
// @ts-ignore
const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")




class WorkflowPluginSelectExecutor extends AbstractWorkflow {
    /**
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigureInPlace<import("./protocol").OptinalExecutors>} configure
     * @param {import("@kyo-kan/engine").ResolverParseContext} resolver  
     */
    getFlowDatas(configure, resolver) {
        /**
         * @type {any}
         */
        const flowDatas = {}

        for (const [selectKey, executor] of Object.entries(configure.flowDatas)) {
            const executorId = resolver.getExecutorId(executor)
            flowDatas[selectKey] = executorId

        }
        return flowDatas
    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").OptinalExecutors>} configure
     * @returns {import("@kyo-kan/engine/protocol/types").Contexts}
     * @param {undefined} request
     */
    now(context, configure, request) {
        const selectedValue = this.getInitState(context)

        const executorId = configure.flowDatas[selectedValue]
        context.states.controll.setExecutorId(executorId)


        return context
    }
    /**
    * @param {import("@kyo-kan/engine/protocol/types").Context} context
    * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").OptinalExecutors>} configure
    * @param {*} request 
    * @returns {import("@kyo-kan/engine/protocol/types").MaybeContexts}  
    */
    go(context, configure, request) {

        const state = this.getState(context, { isExecuted: false })
        if (state.isExecuted === true) {
            context.states.controll.setExecuteMode("returnFromSub")
            return context

        }
        const selectedValue = this.getInitState(context)
        const executorId = configure.flowDatas[selectedValue]
        context.states.controll.setExecutorId(executorId)



        return context


    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").OptinalExecutors>} configure
     * @param {any} request
     * @returns {import("@kyo-kan/engine/protocol/types").MaybeContexts}
     */
    enterAsSubworkflow(context, configure, request) {


        this.setState(context, { isExecuted: false }, true)
        return context

    }
}

module.exports = { WorkflowPluginSelectExecutor }