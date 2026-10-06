export type ReporterAbortable {
    _aborts: Set<AbortController>
    onAbort(controller: AbortController): void
    offAbort(): void

}