class ApiContextId {
    construtor(id) {
        this._id = id
    }
    getId() {
        return this._id
    }
}
/**
 * @type {'ContextId'}
 */
const apiContextIdKey = 'contextId'
module.exports = { ApiContextId, apiContextIdKey }