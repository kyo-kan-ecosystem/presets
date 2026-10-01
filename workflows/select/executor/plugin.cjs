const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")



/**
 * @extends {AbstractWorkflow<import("./protocol").OptionalState, import("./protocol").SelectedValue>}
 */
class WorkflowPluginSelectExecutor extends AbstractWorkflow {
    /**
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigureInPlace<import("./protocol").OptinalExecutors>} configure
     * @param {import("@kyo-kan/engine").ResolverParseContext} resolver  
     */
    getFlowDatas(configure, resolver) {
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
    * @returns {import("@kyo-kan/engine/protocol/types").WorkflowStep}  
    */
    now(context, configure, request) {
        const selectedValue = this.getInitState(context)

        const executor = configure.flowDatas[selectedValu]


        return { context, executor }
    }
    /**
    * @param {import("@kyo-kan/engine/protocol/types").Context} context
    * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").OptinalExecutors>} configure
    * @returns {import("@kyo-kan/engine/protocol/types").WorkflowStep}  
    */
    go(context, configure, request) {

        const state = this.getState(context)
        if (state.isExecuted === true) {
            context.states.controll.setExecuteMode("returnFromSub")
            return { context }

        }
        const selectedValue = this.getInitState(context)
        const executor = configure.flowDatas[selectedValue]


        return { context, executor }


    }
    /**
     * @param {import("@kyo-kan/engine/protocol/types").Context} context
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").StepExecutors>} configure
     *   
    */
    enterAsSubworkflow(context, configure, request) {


        this.setState(context, { isExecuted: false }, true)

    }
}

module.exports = { WorkflowPluginSelectExecutor }