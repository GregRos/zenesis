import { factory } from "typescript"
import { createHandlersFactory } from "../zod-walker/walker"
import { AnyTypeSchema } from "../zod-walker/types"

export { factory as tf }

export const createHandlers = createHandlersFactory<AnyTypeSchema>()
