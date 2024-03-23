import {
    ZsForeignModule,
    ZsImport,
    ZsWorld,
    ZsZenesisModule
} from "@zenesis/schema"
import { Map, Set, Stack } from "immutable"
import {
    ImportDeclaration,
    ImportSpecifier,
    SourceFile,
    SyntaxKind
} from "typescript"
import { ImportContext, ModuleBlueprint } from "./module"
import { tf } from "./tf"

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

export function fromBlueprint(blueprint: ModuleBlueprint): SourceFile {
    const imports = generateImportDeclarations(blueprint.imports)
    const declarations = blueprint.declarations.valueSeq().toArray()
    const declStatements = [...imports, ...declarations]
    const eof = tf.createToken(SyntaxKind.EndOfFileToken)
    const sf = tf.createSourceFile(declStatements, eof, 0)
    return sf
}

export function generateWorld(w: ZsWorld) {
    let foreignModules = Set<ZsForeignModule>()
    let zenesisModules = Set<ZsZenesisModule>()
    const ctx = new ImportContext((node: ZsImport) => {
        const origin = node.origin
        if (origin instanceof ZsForeignModule) {
            foreignModules = foreignModules.add(origin)
            return origin.name
        } else if (origin instanceof ZsZenesisModule) {
            zenesisModules = zenesisModules.add(origin)
            return `./${origin.name}`
        } else {
            throw new Error("Unknown origin")
        }
    })
    let files = Map<string, SourceFile>()
    for (const file of w) {
        const blueprint = ctx.generateModule(file.body)
        const sourceFile = fromBlueprint(blueprint)
        files = files.set(file.name, sourceFile)
    }
    return files.toArray()
}
