import { createHandlers, tf } from "../tf"
import { AnyTypeKind } from "../../construction/kinds"
import ts, { SyntaxKind, TypeReferenceNode } from "typescript"
import { ExtractModifier, extractModifiers } from "../extract-modifiers"
import { getParamInfo } from "../get-param-info"
import { getOptional, getReadonly } from "../modifier-tokens"

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

export default createHandlers({
    [AnyTypeKind.ZodPipeline](node, ctx) {
        throw new Error("Pipelines are not supported")
    },
    [AnyTypeKind.ZodEffects](node, ctx) {
        throw new Error("Effects are not supported")
    },
    [AnyTypeKind.ZodLiteral](node, ctx) {
        const literalNode = getLiteralNode(node.value)
        return tf.createLiteralTypeNode(literalNode)
    },
    [AnyTypeKind.ZodNull](node, ctx) {
        return tf.createLiteralTypeNode(tf.createNull())
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
        return tf.createArrayTypeNode(ctx.recurse(node.type))
    },
    [AnyTypeKind.ZodMap](node, ctx) {
        return tf.createTypeReferenceNode("Map", [
            ctx.recurse(node.keyType),
            ctx.recurse(node.valueType)
        ])
    },
    [AnyTypeKind.ZodSet](node, ctx) {
        return tf.createTypeReferenceNode("Set", [ctx.recurse(node.valueType)])
    },
    [AnyTypeKind.ZodRecord](node, ctx) {
        return tf.createTypeReferenceNode("Record", [
            ctx.recurse(node.keyType),
            ctx.recurse(node.valueType)
        ])
    },
    [AnyTypeKind.ZodTuple](node, ctx) {
        const members = node.items.map(item => {
            const { innerType, optional } = extractModifiers(
                item,
                ExtractModifier.Optional
            )
            const recursed = ctx.recurse(innerType)
            return optional ? tf.createOptionalTypeNode(recursed) : recursed
        })
        if (node.rest) {
            members.push(tf.createRestTypeNode(ctx.recurse(node.rest)))
        }
        return tf.createTupleTypeNode(members)
    },
    [AnyTypeKind.ZodUnion](node, ctx) {
        return tf.createUnionTypeNode(
            node.options.map(option => ctx.recurse(option))
        )
    },
    [AnyTypeKind.ZodIntersection](node, ctx) {
        return tf.createIntersectionTypeNode([
            ctx.recurse(node.left),
            ctx.recurse(node.right)
        ])
    },
    [AnyTypeKind.ZodNullable](node, ctx) {
        return tf.createUnionTypeNode([
            ctx.recurse(node.innerType),
            tf.createLiteralTypeNode(tf.createNull())
        ])
    },
    [AnyTypeKind.ZodDefault](node, ctx) {
        return ctx.recurse(node.innerType)
    },
    [AnyTypeKind.ZodPromise](node, ctx) {
        return tf.createTypeReferenceNode("Promise", [ctx.recurse(node.type)])
    },
    [AnyTypeKind.ZodCatch](node, ctx) {
        return ctx.recurse(node.innerType)
    },

    [AnyTypeKind.ZsClass](node, ctx) {
        return ctx.scope.get(node)
    },
    [AnyTypeKind.ZsInterface](node, ctx) {
        return ctx.scope.get(node)
    },
    [AnyTypeKind.ZsTypeAlias](node, ctx) {
        return ctx.scope.get(node)
    },
    [AnyTypeKind.ZsTypeVar](node, ctx) {
        return ctx.scope.get(node)
    },
    [AnyTypeKind.ZsMapVar](node, ctx) {
        return ctx.scope.get(node)
    },
    [AnyTypeKind.ZsKeyof](node, ctx) {
        return tf.createTypeOperatorNode(
            SyntaxKind.KeyOfKeyword,
            ctx.recurse(node.of)
        )
    },

    [AnyTypeKind.ZodDiscriminatedUnion](node, ctx) {
        return tf.createUnionTypeNode(node.options.map(x => ctx.recurse(x)))
    },
    [AnyTypeKind.ZodBranded](node, ctx) {
        return ctx.recurse(node.type)
    },

    [AnyTypeKind.ZodLazy](node, ctx) {
        return ctx.recurse(node.getter())
    },
    [AnyTypeKind.ZsInstantiation](node, ctx) {
        // An instantiation will always be of a declared type that must be in scope
        const genericType = ctx.scope.get(node.instance) as TypeReferenceNode
        const typeArgs = node.typeArgs.map(arg => ctx.recurse(arg))
        return tf.createTypeReferenceNode(genericType.typeName, typeArgs)
    },
    [AnyTypeKind.ZsIndexedAccess](node, ctx) {
        const targetType = ctx.recurse(node.target)
        const indexType = ctx.recurse(node.index)
        return tf.createIndexedAccessTypeNode(targetType, indexType)
    },
    [AnyTypeKind.ZsFunction](node, ctx) {
        const paramSchemas = node.args.items

        const scalarParams = paramSchemas.map((param, i) => {
            const { optional, innerType } = extractModifiers(
                param,
                ExtractModifier.Optional
            )
            const info = getParamInfo(i, param.description)
            const paramType = ctx.recurse(innerType)
            const decl = tf.createParameterDeclaration(
                undefined, // modifiers
                undefined, // decorators
                info.name, //name
                optional, //questionToken
                paramType, // type
                undefined //initializer
            )
            return decl
        })
        const returnType = ctx.recurse(node.returns)
        return tf.createFunctionTypeNode(undefined, scalarParams, returnType)
    },
    [AnyTypeKind.ZodObject](node, ctx) {
        const members = node.shape()
        const properties = Object.entries(members).flatMap(([name, type]) => {
            const { optional, readonly, innerType } = extractModifiers(type)
            return tf.createPropertySignature(
                readonly ? [readonly] : [],
                name,
                optional,
                ctx.recurse(innerType)
            )
        })
        return tf.createTypeLiteralNode(properties)
    },
    [AnyTypeKind.ZodOptional](node, ctx) {
        // convert to T | undefined
        const innerType = ctx.recurse(node.innerType)
        return tf.createUnionTypeNode([
            innerType,
            tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ])
    },
    [AnyTypeKind.ZodReadonly](node, ctx) {
        // take care of nested readonlies
        const innerType = ctx.recurse(node.innerType)
        // Instantiate Readonly
        return tf.createTypeReferenceNode(tf.createIdentifier("Readonly"), [
            innerType
        ])
    },
    [AnyTypeKind.ZsMapped](node, ctx) {
        const typeVar = node.var
        const typeParamRef = tf.createTypeReferenceNode(
            typeVar._def.name,
            undefined
        )
        const restore = ctx.scope.set(typeVar, typeParamRef)

        const constraintType = ctx.recurse(typeVar._def.in)
        const nameType = ctx.recurse(node.nameType)
        const valueType = ctx.recurse(node.value)

        restore.load()
        const typeParameter = tf.createTypeParameterDeclaration(
            undefined,
            typeVar._def.name,
            constraintType
        )
        return tf.createMappedTypeNode(
            getReadonly(node.modifiers.readonly),
            typeParameter,
            nameType,
            getOptional(node.modifiers.optional),
            valueType,
            undefined
        )
    },
    [AnyTypeKind.ZsConditional](node, ctx) {
        return tf.createConditionalTypeNode(
            ctx.recurse(node.what),
            ctx.recurse(node.extends),
            ctx.recurse(node.then),
            ctx.recurse(node.otherwise)
        )
    }
})
