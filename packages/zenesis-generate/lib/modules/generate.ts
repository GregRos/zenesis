import { Map, Set, Stack } from "immutable"
import {
    ImportDeclaration,
    ImportSpecifier,
    SourceFile,
    SyntaxKind
} from "typescript"
import { tf } from "../utils/tf"
import { FileBlueprint } from "./module"

function generateImportDeclaration(from: string, names: Set<string>) {
    let specifiers = Stack<ImportSpecifier>()
    for (const name of names) {
        specifiers = specifiers.push(
            tf.createImportSpecifier(
                false,
                undefined,
                tf.createIdentifier(name)
            )
        )
    }
    const named = tf.createNamedImports(specifiers.toArray())
    const clause = tf.createImportClause(false, undefined, named)
    const declaration = tf.createImportDeclaration(
        undefined,
        clause,
        tf.createStringLiteral(from)
    )
    return declaration
}

function generateImportDeclarations(imports: Map<string, Set<string>>) {
    let declarations = Stack<ImportDeclaration>()
    for (const [from, names] of imports) {
        declarations = declarations.push(generateImportDeclaration(from, names))
    }
    return declarations.toArray()
}

export function fromBlueprint(blueprint: FileBlueprint): SourceFile {
    const imports = generateImportDeclarations(blueprint.imports)
    const declarations = blueprint.declarations.valueSeq().toArray()
    const declStatements = [...imports, ...declarations]
    const eof = tf.createToken(SyntaxKind.EndOfFileToken)
    const sf = tf.createSourceFile(declStatements, eof, 0)
    return sf
}
