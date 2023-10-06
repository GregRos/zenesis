import { ZsClassMember } from "./field"
import { ZodTypeAny } from "zod"
import { ZsFunction } from "../expressions/function"
import { ZsOverloads } from "../expressions/overloads"

export class ClassDeclarator {
    field<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ): ZsClassMember<Name, Type> {
        return ZsClassMember.create(name, type)
    }

    method<Name extends string, Types extends [ZsFunction, ...ZsFunction[]]>(
        name: Name,
        ...overloads: Types
    ): ZsClassMember<Name, ZsOverloads<Types>> {
        return ZsClassMember.create(name, ZsOverloads.create(...overloads))
    }
}
