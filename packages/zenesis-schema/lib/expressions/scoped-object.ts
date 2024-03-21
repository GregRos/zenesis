import { ZodTypeDef } from "zod"
import { ZsTypeKind } from "../core/kinds"

export interface ZsScopedObjectDef extends ZodTypeDef {
    typeName: ZsTypeKind.ZsScopedObject
}
