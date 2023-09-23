import {
    ZsInterface,
    ZsInterfaceDef
} from "../../construction/module-declarations/interface"
import { tf } from "../tf"
import { SyntaxKind, TypeParameterDeclaration } from "typescript"
import {
    ZsGenericInterface,
    ZsGenericType
} from "../../construction/generic/generic-type"
import { Scope } from "../../zod-walker/scope";

function getExportKeyword(exported: boolean) {
    return exported ? [tf.createToken(SyntaxKind.ExportKeyword)] : [undefined]
}

export interface ExtraProperties {
    exported: boolean
    typeParameters: TypeParameterDeclaration[]
}

export function genericVarsToTypeParameters(
    scope: Scope<any>
    def: ZsGenericType["_def"]
): TypeParameterDeclaration[] {
    return def.ordering.map(name => {
        const xyz = def.vars[name]
        const constraint = xyz._def.extends
        return tf.createTypeParameterDeclaration(
            name,
            constraint
                ? tf.createTypeReferenceNode(constraint, undefined)
                : undefined
        )
    })
}

export function interfaceDeclaration(
    input: ZsInterface["_def"] | ZsGenericInterface["_def"]
) {
    const iface = input.typeName === "ZsInterface" ? input : input.instance
    const typeParameters: TypeParameterDeclaration[] | undefined = undefined
    if (input.typeName === "ZsGenericInterface") {
    }
}
