import {
    ZsDeclarableTypeLike,
    ZsForeignImport,
    ZsImport,
    ZsMappingKeyRef,
    ZsModuleBody,
    ZsReferableTypeLike,
    ZsTypeVarRef,
    ZsZenesisImport,
    isDeclarableType,
    isImport,
    isModuleDeclarableTypeLike,
    isSelfref,
    isValue
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
    constructor(node: ZsMappingKeyRef | ZsTypeVarRef) {
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
            node: ZsZenesisImport | ZsForeignImport
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
                throw new Error("Node already registered")
            }
            if (isSelfref(node)) {
                throw new Error(
                    "Tried to register a selfref! Is it out of scope?"
                )
            }
            if (namespace.has(node.name)) {
                throw new NameCollisionError(node.name)
            }
            const typeReferenceNode = tf.createTypeReferenceNode(node.name)
            const newSchemaToReference = schemaToReference.set(
                node,
                typeReferenceNode
            )
            const newNamespace = namespace.add(node.name)
            if (isDeclarableType(node)) {
                addDeclaration(node, false)
            } else if (isImport(node)) {
                addImport(node)
            }
            schemaToReference = newSchemaToReference
            namespace = newNamespace
            return typeReferenceNode
        }

        const addImport = (schema: ZsImport) => {
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
