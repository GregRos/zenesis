import {
    ZsExportable,
    ZsFile,
    ZsForeignModule,
    ZsImport,
    ZsModuleScope,
    ZsZenesisModule,
    describeZenesisNode,
    zenesisError
} from "@zenesis/schema"

import { existsSync, mkdirSync, writeFileSync } from "fs"
import { Map, Set } from "immutable"
import { join } from "path"
import { SourceFile, createPrinter } from "typescript"
import { fromBlueprint } from "./generate"
import { ImportContext } from "./module"
export interface ZsWorldDef {
    ctor: string
    name: string
}

export interface ZsWorldEmitConfig {
    outDir: string
}

export class ZsWorld implements ZsWorldDef {
    readonly ctor: string
    readonly name: string
    private _files: ZsFile[] = []
    private _imports: ZsForeignModule[] = []
    static create(name: string) {
        return new ZsWorld({
            ctor: "Custom",
            name
        })
    }
    constructor(def: ZsWorldDef) {
        this.ctor = def.ctor
        this.name = def.name
    }
    Import<As>(path: string) {
        const imp = ZsForeignModule.create(path)
        this._imports.push(imp)
        return imp
    }
    File<Exports extends ZsExportable>(
        name: string,
        body: ZsModuleScope<Exports>
    ) {
        const file = ZsFile.create(name, body)
        this._files.push(file as any)
        return file.proxy
    }

    private _generate() {
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
                throw zenesisError({
                    code: "import/invalid-origin",
                    message: `Import ${node.name} has an invalid origin type: ${describeZenesisNode(node)}`
                })
            }
        })
        let files = Map<string, SourceFile>()
        for (const file of this._files) {
            const blueprint = ctx.generateModule(file.body)
            const sourceFile = fromBlueprint(blueprint)
            files = files.set(file.name, sourceFile)
        }
        return files.toArray()
    }

    emitSync(config: ZsWorldEmitConfig) {
        const outDir = config.outDir
        console.log("emitting world", this.name)
        const printer = createPrinter()
        if (!existsSync(outDir)) {
            mkdirSync(outDir)
        }

        for (const [fileName, sourceFile] of this._generate()) {
            console.log(`writing ${fileName}.ts`)
            writeFileSync(
                join(outDir, `${fileName}.ts`),
                printer.printFile(sourceFile)
            )
        }
    }
}
