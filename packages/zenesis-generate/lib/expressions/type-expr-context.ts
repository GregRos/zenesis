import {
    MethodSignature,
    PropertySignature,
    TypeReferenceNode
} from "typescript"

import { AnyZodTuple, ZodFunctionDef, ZodRawShape, ZodTypeAny } from "zod"

import {
    AnyTypeKind,
    ZodKindedAny,
    ZsFunction,
    ZsProperty,
    ZsReferableTypeLike
} from "@zenesis/schema"

import { BaseContext } from "../common/context-base"
import { MemberContext } from "../members/member-context"
import { NodeMap } from "../utils/node-map"
import { cases } from "./cases"
import { ZsTsTable } from "./table"

export class TypeExprContext extends BaseContext {
    create(refs: NodeMap): this {
        return new TypeExprContext(refs) as this
    }

    get(node: ZsReferableTypeLike) {
        return this._refs.get(node)
    }
    convertZodFunctionToZsFunction(
        zodFunction: ZodFunctionDef<AnyZodTuple, ZodTypeAny>
    ): ZsFunction {
        const zsFunction = new ZsFunction({
            typeName: AnyTypeKind.ZsFunction,
            args: zodFunction.args,
            returns: zodFunction.returns,
            description: zodFunction.description,
            errorMap: zodFunction.errorMap
        })
        return zsFunction
    }
    recurse<Node extends ZodKindedAny>(
        node: Node
    ): Node["_def"]["typeName"] extends keyof ZsTsTable
        ? ZsTsTable[Node["_def"]["typeName"]]
        : ZsTsTable[keyof ZsTsTable] {
        if (node._def.typeName in cases) {
            return (cases as any)[node._def.typeName].call(this, node) as any
        }
        throw new Error(`Node type not handled: ${node._def.typeName}`)
    }

    createMemberContext() {
        return new MemberContext(this._refs)
    }

    convertZodShape(shape: ZodRawShape) {
        const memberContext = this.createMemberContext()
        return Object.entries(shape).flatMap(
            ([name, schema]): (MethodSignature | PropertySignature)[] => {
                const member = ZsProperty.create(name, schema)
                return memberContext.convert(member)
            }
        )
    }

    set(node: ZsReferableTypeLike, type: TypeReferenceNode): TypeExprContext {
        return new TypeExprContext(this._refs.set(node, type))
    }
}
