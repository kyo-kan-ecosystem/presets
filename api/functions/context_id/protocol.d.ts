
import type { ApiContextId as ApiContextIdClass, apiContextIdKey } from "./class.cjs"
export type ApiContextId = {
    [apiContextIdKey]: ApiContextIdClass
}

export type MaybeApiContextId = Partial<ApiContextId>