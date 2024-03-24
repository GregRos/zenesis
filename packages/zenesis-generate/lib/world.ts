import { ZsFile } from "@zenesis/schema/lib/containers/file"
import { ZsForeignModule } from "@zenesis/schema/lib/containers/foreign-module"
import { ZsModuleScope } from "@zenesis/schema/lib/containers/module-body"
import { ZsExportable } from "@zenesis/schema/lib/utils/unions"

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
        body: ZsModuleScope<Exports>
    ) {
        const file = ZsFile.create(name, body)
        this._files.push(file as any)
        return file.proxy
    }
    [Symbol.iterator]() {
        return this._files[Symbol.iterator]()
    }
}
