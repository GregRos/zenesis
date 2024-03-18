import { SyntaxKind, TypeNode } from "typescript"

import {
    AnyTypeKind,
    ZsSchemaTable,
    ZsTypeKind,
    isAstExpr
} from "@zenesis/schema"
import { extractModifiers } from "./extract-modifiers"
import { ZsTsTable } from "./sz-expr"
import { tf } from "./tf"
import { getOptional, getReadonly } from "./tokens"
import { TypeExprContext } from "./type-expr-context"

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

export const cases: {
    [Kind in keyof ZsTsTable]: (
        this: TypeExprContext,
        node: ZsSchemaTable[Kind]
    ) => ZsTsTable[Kind]
} = {
    [ZsTypeKind.ZsZenesisImport](node) {
        return this.get(node)
    },
    [ZsTypeKind.ZsEnum](node) {
        return this.get(node)
    },
    [ZsTypeKind.ZsForeignImport](node) {
        return this.get(node)
    },
    ZodNativeEnum(node) {
        throw new Error("Native enums are not supported")
    },
    ZodEnum(node) {
        // Turn this node into a union of literal types
        const members = node._def.values.map(value => {
            const literalNode = getLiteralNode(value)
            return tf.createLiteralTypeNode(literalNode)
        })
        return tf.createUnionTypeNode(members)
    },
    [AnyTypeKind.ZodPipeline](node) {
        throw new Error("Pipelines are not supported")
    },
    [AnyTypeKind.ZodEffects](node) {
        throw new Error("Effects are not supported")
    },
    [AnyTypeKind.ZodLiteral](node) {
        const literalNode = getLiteralNode(node._def.value)
        return tf.createLiteralTypeNode(literalNode)
    },
    [AnyTypeKind.ZodNull](node) {
        return tf.createLiteralTypeNode(tf.createNull())
    },
    [AnyTypeKind.ZodNaN](node) {
        return tf.createLiteralTypeNode(tf.createNumericLiteral("NaN"))
    },
    [AnyTypeKind.ZodUndefined](node) {
        return tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
    },
    [AnyTypeKind.ZodBoolean](node) {
        return tf.createKeywordTypeNode(SyntaxKind.BooleanKeyword)
    },
    [AnyTypeKind.ZodString](node) {
        return tf.createKeywordTypeNode(SyntaxKind.StringKeyword)
    },
    [AnyTypeKind.ZodNumber](node) {
        return tf.createKeywordTypeNode(SyntaxKind.NumberKeyword)
    },
    [AnyTypeKind.ZodBigInt](node) {
        return tf.createKeywordTypeNode(SyntaxKind.BigIntKeyword)
    },
    [AnyTypeKind.ZodDate](node) {
        return tf.createTypeReferenceNode("Date", undefined)
    },
    [AnyTypeKind.ZodAny](node) {
        return tf.createKeywordTypeNode(SyntaxKind.AnyKeyword)
    },
    [AnyTypeKind.ZodUnknown](node) {
        return tf.createKeywordTypeNode(SyntaxKind.UnknownKeyword)
    },
    [AnyTypeKind.ZodVoid](node) {
        return tf.createKeywordTypeNode(SyntaxKind.VoidKeyword)
    },
    [AnyTypeKind.ZodNever](node) {
        return tf.createKeywordTypeNode(SyntaxKind.NeverKeyword)
    },
    [AnyTypeKind.ZodSymbol](node) {
        return tf.createKeywordTypeNode(SyntaxKind.SymbolKeyword)
    },
    [AnyTypeKind.ZodArray](node) {
        return tf.createArrayTypeNode(this.recurse(node._def.type))
    },
    [AnyTypeKind.ZodMap](node) {
        return tf.createTypeReferenceNode("Map", [
            this.recurse(node._def.keyType),
            this.recurse(node._def.valueType)
        ])
    },
    [AnyTypeKind.ZodSet](node) {
        return tf.createTypeReferenceNode("Set", [
            this.recurse(node._def.valueType)
        ])
    },
    [AnyTypeKind.ZodRecord](node) {
        return tf.createTypeReferenceNode("Record", [
            this.recurse(node._def.keyType),
            this.recurse(node._def.valueType)
        ])
    },
    [AnyTypeKind.ZodTuple](node) {
        const members = node._def.items.map((item): TypeNode => {
            const { innerType, optional } = extractModifiers(
                item,
                "ZodOptional"
            )
            const recursed = this.recurse(innerType)
            return optional ? tf.createOptionalTypeNode(recursed) : recursed
        })
        if (node._def.rest) {
            members.push(tf.createRestTypeNode(this.recurse(node._def.rest)))
        }
        return tf.createTupleTypeNode(members)
    },
    [AnyTypeKind.ZodUnion](node) {
        return tf.createUnionTypeNode(
            node._def.options.map(option => this.recurse(option))
        )
    },
    [AnyTypeKind.ZodIntersection](node) {
        return tf.createIntersectionTypeNode([
            this.recurse(node._def.left),
            this.recurse(node._def.right)
        ])
    },
    [AnyTypeKind.ZodNullable](node) {
        return tf.createUnionTypeNode([
            this.recurse(node._def.innerType),
            tf.createLiteralTypeNode(tf.createNull())
        ])
    },
    [AnyTypeKind.ZodDefault](node) {
        return this.recurse(node._def.innerType)
    },
    [AnyTypeKind.ZodPromise](node) {
        return tf.createTypeReferenceNode("Promise", [
            this.recurse(node._def.type)
        ])
    },
    [AnyTypeKind.ZodCatch](node) {
        return this.recurse(node._def.innerType)
    },

    [AnyTypeKind.ZsClass](node) {
        return this.get(node)
    },
    [AnyTypeKind.ZsInterface](node) {
        return this.get(node)
    },
    [AnyTypeKind.ZsTypeAlias](node) {
        return this.get(node)
    },
    [AnyTypeKind.ZsTypeVar](node) {
        return this.get(node)
    },
    [AnyTypeKind.ZsMapVar](node) {
        return this.get(node)
    },
    [AnyTypeKind.ZsKeyof](node) {
        return tf.createTypeOperatorNode(
            SyntaxKind.KeyOfKeyword,
            this.recurse(node._def.of)
        )
    },

    [AnyTypeKind.ZodDiscriminatedUnion](node) {
        return tf.createUnionTypeNode(
            node._def.options.map(x => this.recurse(x))
        )
    },
    [AnyTypeKind.ZodBranded](node) {
        return this.recurse(node._def.type)
    },

    [AnyTypeKind.ZodLazy](node) {
        return this.recurse(node._def.getter())
    },
    [AnyTypeKind.ZsInstantiation](node) {
        // An instantiation will always be of a declared type that must be in scope
        const instance = node._def.instance
        if (isAstExpr(instance)) {
            // TODO: handle this
            throw new Error("AstExpr instantiations are not supported")
        }
        const type = this.get(instance)
        const typeArgs = node._def.typeArgs.map(arg => this.recurse(arg))
        return tf.createTypeReferenceNode(type.typeName, typeArgs)
    },
    [AnyTypeKind.ZsIndexedAccess](node) {
        const targetType = this.recurse(node._def.target)
        const indexType = this.recurse(node._def.index)
        return tf.createIndexedAccessTypeNode(targetType, indexType)
    },
    [AnyTypeKind.ZodFunction](node) {
        return this.recurse(this.convertZodFunctionToZsFunction(node._def))
    },
    [AnyTypeKind.ZsOverloads](node) {
        // We're going to convert this into a callable with multiple signatures
        // Parents will unpack it and do with the contents whatever they want.
        const signatures = node._def.overloads.map(overload => {
            const decl = this.convertZsFunctionToSomething(
                overload._def,
                tf.createCallSignature
            )
            return decl
        })
        return tf.createTypeLiteralNode(signatures)
    },
    [AnyTypeKind.ZsFunction](node) {
        const func = this.convertZsFunctionToSomething(
            node._def,
            tf.createFunctionTypeNode
        )
        return func
    },
    [AnyTypeKind.ZodObject](node) {
        const members = node._def.shape()
        const properties = this.convertZodShape(members)
        return tf.createTypeLiteralNode(properties)
    },
    [AnyTypeKind.ZodOptional](node) {
        // convert to T | undefined
        const innerType = this.recurse(node._def.innerType)
        return tf.createUnionTypeNode([
            innerType,
            tf.createKeywordTypeNode(SyntaxKind.UndefinedKeyword)
        ])
    },
    [AnyTypeKind.ZodReadonly](node) {
        // TODO: take care of nested readonlies
        const innerType = this.recurse(node._def.innerType)
        // Instantiate Readonly
        return tf.createTypeReferenceNode(tf.createIdentifier("Readonly"), [
            innerType
        ])
    },
    [AnyTypeKind.ZsMapped](node) {
        const typeVar = node._def.var
        const typeParamRef = tf.createTypeReferenceNode(
            typeVar._def.name,
            undefined
        )
        const nested = this.set(typeVar, typeParamRef)

        const constraintType = nested.recurse(typeVar._def.in)
        const nameType = nested.recurse(node._def.nameType)
        const valueType = nested.recurse(node._def.value)

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
    [AnyTypeKind.ZsConditional](node) {
        return tf.createConditionalTypeNode(
            this.recurse(node._def.what),
            this.recurse(node._def.extends),
            this.recurse(node._def.then),
            this.recurse(node._def.otherwise)
        )
    }
}
