import { tf } from "../tf"
import { SyntaxKind, TypeParameterDeclaration } from "typescript"

function getExportKeyword(exported: boolean) {
    return exported ? [tf.createToken(SyntaxKind.ExportKeyword)] : [undefined]
}

export interface ExtraProperties {
    exported: boolean
    typeParameters: TypeParameterDeclaration[]
}
