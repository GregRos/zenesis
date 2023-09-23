import { ZodNamedTypeAny, ZodNameOf } from "./types"
import { SchemaToTsNode } from "./schema-to-ts-type"
import { JSDoc } from "typescript"
import { ZsModuleDecl } from "../construction/module-declarations/module-fragment"

export interface WalkerContext<
    Current extends ZodNamedTypeAny = ZodNamedTypeAny
> {
    readonly current: Current
    getRef<Node extends ZodNamedTypeAny>(
        node: Node
    ): SchemaToTsNode[ZodNameOf<Node>]
    pushRef<Node extends ZodNamedTypeAny>(
        node: Node,
        value: SchemaToTsNode[ZodNameOf<Node>]
    ): void
    emitDocumentationNode(node: JSDoc): void
    onMissingDeclaration(handler: (node: ZsModuleDecl) => void): {
        dispose(): void
    }
    onDocumentationNode(handler: (node: JSDoc) => void): {
        dispose(): void
    }
}
