import { ZsInterface } from "../../construction/module-declarations/interface"
import { tf } from "../tf"
import { SyntaxKind, TypeParameterDeclaration } from "typescript"
import {
    ZsGenericInterface,
    ZsGenericType
} from "../../construction/generic/generic-type"
import { Scope } from "../../zod-walker/scope"

function getExportKeyword(exported: boolean) {
    return exported ? [tf.createToken(SyntaxKind.ExportKeyword)] : [undefined]
}

export interface ExtraProperties {
    exported: boolean
    typeParameters: TypeParameterDeclaration[]
}
