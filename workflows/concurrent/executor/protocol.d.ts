export type ConcurrentExecutors = any[]
export type ConcurrentState = {
    isSubWorkflow: boolean,
    taskStateMap: { [k in any]: number },
    waitingTaskCount: number,



}

