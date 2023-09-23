import { ZsClassField } from "./field"
import { ZodTypeAny } from "zod"
import { ZsFunction } from "../expressions/function"
import { ZsClassMethod } from "./method"
import { ZsOverloads } from "../expressions/overloads"

export class ClassDeclarator {
    field<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ): ZsClassField<Name, Type> {
        return ZsClassField.create(name, type)
    }

    method<Name extends string, Types extends [ZsFunction, ...ZsFunction[]]>(
        name: Name,
        ...overloads: Types
    ): ZsClassMethod<Name, ZsOverloads<Types>> {
        return ZsClassMethod.create(name, ...overloads)
    }
}
