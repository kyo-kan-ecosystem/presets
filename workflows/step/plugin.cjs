// @ts-nocheck


const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")



/**
 * 
 * @extends {AbstractWorkflow<import("./protocol").StepState,boolean>}
 */
class PluginSteps extends AbstractWorkflow {

    /**
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigureInPlace<import("./protocol").StepExecutors>} configure
     * @param {import("@kyo-kan/engine").ResolverParseContext} resolver  
     */
    getFlowDatas(configure, resolver) {
        const flowDatas = []
        for (const executor of configure.flowDatas) {
            const executorId = resolver.getExecutorId(executor)
            flowDatas.push(executorId)

        }
        return flowDatas
    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     * @returns {import("@kyo-kan/engine/protocol/types").MaybeContexts}
     * @param {any} request
     */
    now(context, configure, request) {
        const state = this.getState(context, { index: 0, isSubworkFlow: false })
        context.states.controll.setExecutorId(configure.flowDatas[state.index])
        return context





    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     * @returns {import("@kyo-kan/engine/protocol/types").MaybeContexts}
     * @param {*} request   
     */
    go(context, configure, request) {
        const state = this.getState(context, { index: 0, isSubworkFlow: false })
        const nextIndex = state.index + 1
        if (nextIndex >= configure.flowDatas.length) {
            if (state.isSubworkFlow === true) {
                context.states.controll.setExecuteMode("returnFromSub")

            }
            else {
                context.states.controll.setExecuteMode("end")
            }


        }

        context.states.controll.setExecutorId(configure.flowDatas[state.index])

        state.index = nextIndex
        this.setState(context, state)
        return context



    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     * @param {*} request   
     */
    enterAsSubworkflow(context, configure, request) {
        this.setState(context, { index: 0, isSubworkFlow: true })
        return context

    }


}

module.exports = { PluginSteps }


