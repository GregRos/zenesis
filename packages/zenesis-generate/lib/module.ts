import {
    ZsDeclarableTypeLike,
    ZsForeignImport,
    ZsImport,
    ZsImported,
    ZsMappedKeyRef,
    ZsModuleBody,
    ZsReferableTypeLike,
    ZsTypeVarRef,
    describeZenesisNode,
    isDeclarableType,
    isImport,
    isModuleDeclarableTypeLike,
    isSelfref,
    isValue,
    zenesisError
} from "@zenesis/schema"

import { Map, Set } from "immutable"
import { Lazy, lazy } from "lazies"
import {
    ClassDeclaration,
    EnumDeclaration,
    FunctionDeclaration,
    InterfaceDeclaration,
    TypeAliasDeclaration,
    TypeReferenceNode,
    VariableStatement
} from "typescript"
import { NodeMap } from "./node-map"
import { tf } from "./tf"
import { TypeExprContext } from "./type-expr-context"

export class ScopeEscapeError extends Error {
    constructor(node: ZsMappedKeyRef | ZsTypeVarRef) {
        super(`${node.constructor.name}(${node.name}) has escaped its scope!`)
    }
}

export class NameCollisionError extends Error {
    constructor(name: string) {
        super(`Name collision: ${name}`)
    }
}

export type MixedDeclarations =
    | ClassDeclaration
    | TypeAliasDeclaration
    | InterfaceDeclaration
    | FunctionDeclaration
    | EnumDeclaration
    | VariableStatement

export interface ModuleBlueprint {
    imports: Map<string, Set<string>>
    declarations: Map<string, MixedDeclarations>
}

export class ImportContext {
    constructor(
        private readonly _importResolver: (
            node: ZsImport | ZsForeignImport
        ) => string
    ) {}

    generateModule(body: ZsModuleBody): ModuleBlueprint {
        let schemaToReference = Map<
            ZsReferableTypeLike,
            TypeReferenceNode | Lazy<TypeReferenceNode>
        >()
        let namespace = Set<string>()
        let delayedDeclarations = Map<string, Lazy<MixedDeclarations>>()
        let imports = Map<string, Set<string>>()

        const registerReferable = (node: ZsReferableTypeLike) => {
            if (schemaToReference.has(node)) {
                throw zenesisError({
                    code: "module/duplicate-node",
                    message: `Module body has already declared this node: ${describeZenesisNode(node)}`
                })
            }
            if (isSelfref(node)) {
                throw zenesisError({
                    code: "selfref/out-of-scope",
                    message: `Selfref node ${describeZenesisNode(node)} has escaped its scope!`
                })
            }
            if (namespace.has(node.name)) {
                throw zenesisError({
                    code: "module/name-collision",
                    message: `Module body already has a declaration with the name: ${node.name}`
                })
            }
            const typeReferenceNode = tf.createTypeReferenceNode(node.name)
            const newSchemaToReference = schemaToReference.set(
                node,
                typeReferenceNode
            )
            const newNamespace = namespace.add(node.name)
            if (isImport(node)) {
                addImport(node)
            } else if (isDeclarableType(node)) {
                addDeclaration(node, false)
            }
            schemaToReference = newSchemaToReference
            namespace = newNamespace
            return typeReferenceNode
        }

        const addImport = (schema: ZsImported) => {
            const relativePath = this._importResolver(schema)
            let existing = imports.get(relativePath)
            if (!existing) {
                existing = Set()
            }
            if (existing.has(schema.name)) {
                throw new NameCollisionError(schema.name)
            }
            existing = existing.add(schema.name)
            imports = imports.set(relativePath, existing)
        }

        const addDeclaration = (
            schema: ZsDeclarableTypeLike,
            exported: boolean = false
        ) => {
            if (schemaToReference.has(schema)) {
                throw new NameCollisionError(schema.name)
            }
            const declaration = lazy(() => {
                const ctx = new TypeExprContext(
                    new NodeMap(schemaToReference, x => registerReferable(x))
                )
                return ctx.convertDeclaration(exported, schema)
            })
            delayedDeclarations = delayedDeclarations.set(
                schema.name,
                declaration
            )
        }

        for (const node of body) {
            if (isModuleDeclarableTypeLike(node)) {
                addDeclaration(node, true)
            } else if (isValue(node)) {
                throw new Error("Values are not supported")
            } else {
                throw new Error("Unknown node type")
            }
        }
        let finalDeclaraitons = Map<string, MixedDeclarations>()
        while (delayedDeclarations.size > 0) {
            for (const [name, delayedDeclaration] of delayedDeclarations) {
                const declaration = delayedDeclaration.pull()
                finalDeclaraitons = finalDeclaraitons.set(name, declaration)
                delayedDeclarations = delayedDeclarations.delete(name)
            }
        }

        return {
            imports,
            declarations: finalDeclaraitons
        }
    }
}
