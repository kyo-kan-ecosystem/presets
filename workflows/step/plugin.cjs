

const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")



/**
 * @extends {AbstractWorkflow<import("./protocol").StepState>}
 */
class WorkflowPluginStep extends AbstractWorkflow {

    /**
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigureInPlace} configure
     * @param {import("@kyo-kan/engine").ResolverParseContext} resolver  
     */
    getMemberExecutors(configure, resolver) {
        const flowDatas = []
        for (const executor of configure.executors) {
            const executorId = resolver.getExecutorId(executor)
            flowDatas.push(executorId)

        }
        return flowDatas
    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     * @returns {import("@kyo-kan/engine/protocol/types").WorkflowStep}  
     */
    now(context, configure, request) {
        const state = this.getState(context, { index: 0, isSubworkFlow: false })
        return { context, executor: configure.flowDatas[state.index] }





    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     * @returns {import("@kyo-kan/engine/protocol/types").WorkflowStep}  
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

        /**
         * @type {import("@kyo-kan/engine/protocol/types").WorkflowStep}
         */
        const result = { context, executor: configure.executors[state.index] }
        state.index = nextIndex
        this.setState(context, state)
        return result



    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     *   
     */
    enterAsSubworkflow(context, configure, request) {
        this.setState(context, { index: 0, isSubworkFlow: true })

    }


}

module.exports = { WorkflowPluginStep }


