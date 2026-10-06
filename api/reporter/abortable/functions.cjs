
/**
 * @this {import('./protocol.d.ts').ReporterAbortable}
 * @param {*} controller 
 */
function reporterAbortableOnAbort(controller) {
    this._aborts.add(controller)

}
/**
 * @this {import('./protocol.d.ts').ReporterAbortable}
 * @param {*} controller 
 */
function reporterAbortableOffAbort() {


    initiaraizeAbortable.call(this)



}
/**
 * @this {import('./protocol.d.ts').ReporterAbortable}
 * @param {*} controller 
 */
function reporterAbortableInitiaraizeAbortable() {
    this._aborts = new Set()

}

module.exports = { reporterAbortableInitiaraizeAbortable, reporterAbortableOffAbort, reporterAbortableOnAbort }