import {
    ZsZenesisModule,
    describeZenesisNode,
    zenesisError
} from "@zenesis/schema"
import { ZsFile } from "@zenesis/schema/lib/containers/file"
import { ZsForeignModule } from "@zenesis/schema/lib/containers/foreign-module"
import { ZsModuleScope } from "@zenesis/schema/lib/containers/module-body"
import { ZsExportable, ZsImport } from "@zenesis/schema/lib/utils/unions"
import { Map, Set } from "immutable"
import { SourceFile } from "typescript"
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
        console.log("emitting world", this.name)
    }
}
