const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")

const InitState = 0
const ProcessingState = 1
const CompleteState = 2


/**
 * @extends {AbstractWorkflow<import("./protocol.d.ts").ConcurrentState, any>}
 */
class WorkflowPluginConcurrentExecutor extends AbstractWorkflow {

    /**
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigureInPlace<import("./protocol").ConcurrentExecutors>} configure
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
     * @abstract
     * @param {import("@kyo-kan/engine/protocol/types").Context} context 
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").ConcurrentExecutors>} configure
     * @param {*} request 
     * @returns {import("../../../protocol").MaybeContexts}
     * 
     * 
     */
    enterWorkflow(context, configure, request) {
        return this._initWorkflow(context, configure, false)

    }
    /**
    * @abstract
    * @param {import("@kyo-kan/engine/protocol/types").Context} context 
    * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").ConcurrentExecutors>} configure
    * @param {*} request 
    * @returns {import("../../../protocol").MaybeContexts}
    * 
    * 
    */
    enterAsSubworkflow(context, configure, request) {
        return this._initWorkflow(context, configure, true)

    }
    /**
    * @param {import("@kyo-kan/engine/protocol/types").Context} context 
    * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").ConcurrentExecutors>} configure
    * @param {boolean} isSubworkflow 
    */
    _initWorkflow(context, configure, isSubworkflow) {
        const taskStateMap = {}
        const contexts = []
        const branchPointId = context.getBranchId()
        let waitingTaskCount = 0


        for (const executorId of configure.flowDatas) {
            waitingTaskCount += 1
            const forkedContext = context.fork()
            taskStateMap[forkedContext.getBranchId()] = InitState
            forkedContext.states.controll.setExecutorId(executorId)
            forkedContext.states.now.update({ workflow: { state: branchPointId } })
            contexts.push(forkedContext)



        }

        this.setState(context, { isSubworkflow, taskStateMap, waitingTaskCount, branchPointId })
        return contexts
    }
    /**
     * @abstract
     * @param {import("@kyo-kan/engine/protocol/types").Context} context 
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").ConcurrentExecutors>} configure
     * @param {*} request 
     * @returns {import("../../../protocol").MaybeContexts}
     * 
     * 
     */
    now(context, configure, request) {
        return context

    }
    /**
     * @abstract
     * @param {import("@kyo-kan/engine/protocol/types").Context} context 
     * @param {import("@kyo-kan/engine/protocol/types").WorkflowConfigure<import("./protocol").ConcurrentExecutors>} configure
     * @param {*} request 
     * @returns {import("../../../protocol").MaybeContexts}
     * 
     * 
     */
    go(context, configure, request) {
        const branchPointId = context.states.now.get().workflow?.state
        const branchId = context.branchId

        /**
         * @type {import("./protocol.d.ts").ConcurrentState}
         */
        const branchPointState = context.getStateBranch(branchPointId).get().workflow.state
        const taskState = branchPointState.taskStateMap[branchId]
        let returnContext = context
        if (taskState === InitState) {
            branchPointState.taskStateMap[branchId] = ProcessingState

        }
        if (taskState === ProcessingState) {
            branchPointState.waitingTaskCount -= 1
            branchPointState.taskStateMap[branchId] = CompleteState
            const bordFromBase = context.bords.getBranchFrom()
            bordFromBase.updateWorkflow(context.bords.getCurrentWorkflow())
            if (branchPointState.waitingTaskCount === 0) {
                returnContext = context.fork(branchPointId)
                if (branchPointState.isSubWorkflow === true) {
                    returnContext.states.controll.setExecuteMode('returnFromSub')

                }
                else {
                    returnContext.states.controll.setExecuteMode('end')
                }

            }
            else {
                returnContext.states.controll.setExecuteMode('end')
            }

        }
        if (taskState === CompleteState) {
            returnContext.states.controll.setExecuteMode('end')

        }
        return returnContext



    }
}

module.exports = { WorkflowPluginConcurrentExecutor }