



const { AbstractWorkflow } = require("@kyo-kan/engine/protocol/classes")

/**
 * @typedef {{step?:number}}
 */
/**
 * @extends {AbstractWorkflow<>}
 */
class WorkflowPluginStep extends AbstractWorkflow {
    /**
     * 
     * @param {any[]} configures
     * @param {WorkflowContext} context 
     * @returns {ApplyResponse}  
     */
    applyConfigure(name, configures, context) {
        let indexKey = 0
        /**
         * @type {WorkflowData}
         */
        const workflowData = {
            steps: Array(configures.length)
        }
        const result = context.set(name, workflowData)
        /** 
        * @type {ApplyResponse}
        */
        const response = Object.assign(result, {

            configures: []
        })

        for (const configure of configures) {
            /**
             * @type {UnitConfigure}
             */
            const unitConfigure = {
                configure,
                data: indexKey
            }
            response.configures.push(unitConfigure)
            indexKey += 1
        }
        return response



    }
    /**
    * 
    * @param {number} data
    * @param {RepositryContext} context 
    *  
    */
    addWorkflowUnit(name, data, unitId, context) {
        /**
         * @type {WorkflowData}
         */
        const workflowData = context.get(name)
        workflowData.steps[data] = unitId
        context.set(name, workflowData)

    }
    resolve() {

    }
    exec() {

    }

}

/**
 * 
 * @param {*} hoge 
 * @returns 
 */
function t(hoge) {
    return hoge
} 
