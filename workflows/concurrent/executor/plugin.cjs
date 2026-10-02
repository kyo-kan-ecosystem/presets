const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")



/**
 * @extends {AbstractWorkflow<import("./protocol.d.ts").ConcurrentExecutors, import("./protocol.d.ts").ConcurrentState>}
 */
class WorkflowPluginConcurrentExecutor extends AbstractWorkflow {
    enterAsSubworkflow() {

    }

}

module.exports = { WorkflowPluginConcurrentExecutor }