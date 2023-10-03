import { AnyTypeKind, ZsTypeKind } from "../../construction/kinds"
import { SyntaxKind, TypeNode, TypeReferenceNode } from "typescript"
import { extractModifiers } from "../extract-modifiers"
import { getOptional, getReadonly } from "../modifier-tokens"
import { convertZodFunctionToZsFunction } from "./zod-function-to-zs-function"
import { convertZsFunctionToSomething } from "./function-to-call-signature"
import { convertMemberList } from "./convert-member-list"

import {
    zsExpressionMatcher,
    ZsTypeExpressionTable,
    ztSchemaWorld
} from "../expression-matcher"
import { tf } from "../tf"
import { z } from "zod"

function getLiteralNode(value: any) {
    switch (typeof value) {
        case "string":
            return tf.createStringLiteral(value)
        case "number":
            return tf.createNumericLiteral(value)
        case "boolean":
            return value ? tf.createTrue() : tf.createFalse()
        default:
            throw new Error(`Unsupported literal type: ${typeof value}`)
    }
}

export const matcher = zsExpressionMatcher.cases<ZsTypeExpressionTable>({
    [ZsTypeKind.ZsEnum](node, ctx) {
        return ctx.get(node)
    },
    [ZsTypeKind.ZsImportedType](node, ctx) {
        return ctx.get(node)
    },
    ZodNativeEnum(node, ctx) {
        throw new Error("Native enums are not supported")
    },
    ZodEnum(node, ctx) {
        // Turn this node into a union of literal types
        const members = node._def.values.map(value => {
            const literalNode = getLiteralNode(value)
            return tf.createLiteralTypeNode(literalNode)
        })
        return tf.createUnionTypeNode(members)
    },
    [AnyTypeKind.ZodPipeline](node, ctx) {
        throw new Error("Pipelines are not supported")
    },
    [AnyTypeKind.ZodEffects](node, ctx) {
        throw new Error("Effects are not supported")
    },
    [AnyTypeKind.ZodLiteral](node, ctx) {
        const literalNode = getLiteralNode(node._def.value)
        return tf.createLiteralTypeNode(literalNode)
    },
    [AnyTypeKind.ZodNull](node, ctx) {
        return tf.createLiteralTypeNode(tf.createNull())
    },
    [AnyTypeKind.ZodNaN](node, ctx) {
        return tf.createLiteralTypeNode(tf.createNumericLiteral("NaN"))
    },
    [AnyTypeKind.ZodUndefined](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
    },
    [AnyTypeKind.ZodBoolean](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
    },
    [AnyTypeKind.ZodString](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.StringKeyword)
    },
    [AnyTypeKind.ZodNumber](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.NumberKeyword)
    },
    [AnyTypeKind.ZodBigInt](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.BigIntKeyword)
    },
    [AnyTypeKind.ZodDate](node, ctx) {
        return tf.createTypeReferenceNode("Date", undefined)
    },
    [AnyTypeKind.ZodAny](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.AnyKeyword)
    },
    [AnyTypeKind.ZodUnknown](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.UnknownKeyword)
    },
    [AnyTypeKind.ZodVoid](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.VoidKeyword)
    },
    [AnyTypeKind.ZodNever](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.NeverKeyword)
    },
    [AnyTypeKind.ZodSymbol](node, ctx) {
        return tf.createKeywordTypeNode(SyntaxKind.SymbolKeyword)
    },
    [AnyTypeKind.ZodArray](node, ctx) {
        return tf.createArrayTypeNode(ctx.recurse(node._def.type))
    },
    [AnyTypeKind.ZodMap](node, ctx) {
        return tf.createTypeReferenceNode("Map", [
            ctx.recurse(node._def.keyType),
            ctx.recurse(node._def.valueType)
        ])
    },
    [AnyTypeKind.ZodSet](node, ctx) {
        return tf.createTypeReferenceNode("Set", [
            ctx.recurse(node._def.valueType)
        ])
    },
    [AnyTypeKind.ZodRecord](node, ctx) {
        return tf.createTypeReferenceNode("Record", [
            ctx.recurse(node._def.keyType),
            ctx.recurse(node._def.valueType)
        ])
    },
    [AnyTypeKind.ZodTuple](node, ctx) {
        const members = node._def.items.map((item): TypeNode => {
            const { innerType, optional } = extractModifiers(
                item,
                "ZodOptional"
            )
            const recursed = ctx.recurse(innerType)
            return optional ? tf.createOptionalTypeNode(recursed) : recursed
        })
        if (node._def.rest) {
            members.push(tf.createRestTypeNode(ctx.recurse(node._def.rest)))
        }
        return tf.createTupleTypeNode(members)
    },
    [AnyTypeKind.ZodUnion](node, ctx) {
        return tf.createUnionTypeNode(
            node._def.options.map(option => ctx.recurse(option))
        )
    },
    [AnyTypeKind.ZodIntersection](node, ctx) {
        return tf.createIntersectionTypeNode([
            ctx.recurse(node._def.left),
            ctx.recurse(node._def.right)
        ])
    },
    [AnyTypeKind.ZodNullable](node, ctx) {
        return tf.createUnionTypeNode([
            ctx.recurse(node._def.innerType),
            tf.createLiteralTypeNode(tf.createNull())
        ])
    },
    [AnyTypeKind.ZodDefault](node, ctx) {
        return ctx.recurse(node._def.innerType)
    },
    [AnyTypeKind.ZodPromise](node, ctx) {
        return tf.createTypeReferenceNode("Promise", [
            ctx.recurse(node._def.type)
        ])
    },
    [AnyTypeKind.ZodCatch](node, ctx) {
        return ctx.recurse(node._def.innerType)
    },
    [AnyTypeKind.ZsAccess](node, ctx) {
        return ctx.recurse(node._def.innerType)
    },
    [AnyTypeKind.ZsClass](node, ctx) {
        return ctx.get(node)
    },
    [AnyTypeKind.ZsInterface](node, ctx) {
        return ctx.get(node)
    },
    [AnyTypeKind.ZsTypeAlias](node, ctx) {
        return ctx.get(node)
    },
    [AnyTypeKind.ZsTypeVar](node, ctx) {
        return ctx.get(node)
    },
    [AnyTypeKind.ZsMapVar](node, ctx) {
        return ctx.get(node)
    },
    [AnyTypeKind.ZsKeyof](node, ctx) {
        return tf.createTypeOperatorNode(
            SyntaxKind.KeyOfKeyword,
            ctx.recurse(node._def.of)
        )
    },

    [AnyTypeKind.ZodDiscriminatedUnion](node, ctx) {
        return tf.createUnionTypeNode(
            node._def.options.map(x => ctx.recurse(x))
        )
    },
    [AnyTypeKind.ZodBranded](node, ctx) {
        return ctx.recurse(node._def.type)
    },

    [AnyTypeKind.ZodLazy](node, ctx) {
        return ctx.recurse(node._def.getter())
    },
    [AnyTypeKind.ZsInstantiation](node, ctx) {
        // An instantiation will always be of a declared type that must be in scope
        const genericType = ctx.get(node._def.instance) as TypeReferenceNode
        const typeArgs = node._def.typeArgs.map(arg => ctx.recurse(arg))
        return tf.createTypeReferenceNode(genericType.typeName, typeArgs)
    },
    [AnyTypeKind.ZsIndexedAccess](node, ctx) {
        const targetType = ctx.recurse(node._def.target)
        const indexType = ctx.recurse(node._def.index)
        return tf.createIndexedAccessTypeNode(targetType, indexType)
    },
    [AnyTypeKind.ZodFunction](node, ctx) {
        return ctx.recurse(convertZodFunctionToZsFunction(node._def))
    },
    [AnyTypeKind.ZsOverloads](node, ctx) {
        // We're going to convert this into a callable with multiple signatures
        // Parents will unpack it and do with the contents whatever they want.
        const signatures = node._def.overloads.map(overload => {
            const decl = convertZsFunctionToSomething(
                overload._def,
                ctx,
                tf.createCallSignature
            )
            return decl
        })
        return tf.createTypeLiteralNode(signatures)
    },
    [AnyTypeKind.ZsFunction](node, ctx) {
        const func = convertZsFunctionToSomething(
            node._def,
            ctx,
            tf.createFunctionTypeNode
        )
        return func
    },
    [AnyTypeKind.ZodObject](node, ctx) {
        const members = node._def.shape()
        const properties = convertMemberList(members, ctx)
        return tf.createTypeLiteralNode(properties)
    },
    [AnyTypeKind.ZodOptional](node, ctx) {
        // convert to T | undefined
        const innerType = ctx.recurse(node._def.innerType)
        return tf.createUnionTypeNode([
            innerType,
            tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ])
    },
    [AnyTypeKind.ZodReadonly](node, ctx) {
        // take care of nested readonlies
        const innerType = ctx.recurse(node._def.innerType)
        // Instantiate Readonly
        return tf.createTypeReferenceNode(tf.createIdentifier("Readonly"), [
            innerType
        ])
    },
    [AnyTypeKind.ZsMapped](node, ctx) {
        const typeVar = node._def.var
        const typeParamRef = tf.createTypeReferenceNode(
            typeVar._def.name,
            undefined
        )
        const restore = ctx.set(typeVar, typeParamRef)

        const constraintType = ctx.recurse(typeVar._def.in)
        const nameType = ctx.recurse(node._def.nameType)
        const valueType = ctx.recurse(node._def.value)

        restore.dispose()
        const typeParameter = tf.createTypeParameterDeclaration(
            undefined,
            typeVar._def.name,
            constraintType
        )
        return tf.createMappedTypeNode(
            getReadonly(node._def.modifiers.readonly),
            typeParameter,
            nameType,
            getOptional(node._def.modifiers.optional),
            valueType,
            undefined
        )
    },
    [AnyTypeKind.ZsConditional](node, ctx) {
        return tf.createConditionalTypeNode(
            ctx.recurse(node._def.what),
            ctx.recurse(node._def.extends),
            ctx.recurse(node._def.then),
            ctx.recurse(node._def.otherwise)
        )
    },
    else(node, ctx) {
        throw new Error(`Unhandled node: ${node._def.typeName}`)
    }
})
