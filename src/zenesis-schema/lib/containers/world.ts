import { ZsExportable } from "../declarations/unions"
import { ZsFile } from "./file"
import { ZsForeignModule } from "./foreign-module"
import { ZsModuleDeclarations } from "./module-body"

export interface ZsWorldDef {
    readonly worldName: "ZsWorld"
    readonly name: string
}

export class ZsWorld {
    private _files: ZsFile[] = []
    private _imports: ZsForeignModule[] = []
    constructor(private readonly _def: ZsWorldDef) {}
    static create(name: string) {
        return new ZsWorld({
            worldName: "ZsWorld",
            name
        })
    }
    File<Exports extends ZsExportable>(
        name: string,
        body: ZsModuleDeclarations<Exports>
    ) {
        const file = ZsFile.create(name, body)
        this._files.push(file as any)
        return file.proxy
    }
    [Symbol.iterator]() {
        return this._files[Symbol.iterator]()
    }
}
