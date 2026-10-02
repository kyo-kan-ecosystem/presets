export type ConcurrentExecutors = any[]
export type ConcurrentState = {
    isSubWorkflow: boolean,
    taskCompleteMap: { [k in any]: boolean },
    waitingTask: number

}