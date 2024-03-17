import { ZsExportable } from "../declarations/unions"
import { ZsModuleKind } from "../kinds"
import { ZsModuleBody, ZsModuleDeclarations } from "./module-body"
import { ZsZenesisModule } from "./zenesis-module"

export interface ZsFileDef<Exports extends ZsExportable> {
    readonly moduleName: ZsModuleKind.ZsFile
    readonly name: string
    readonly body: ZsModuleBody<Exports>
}

export class ZsFile<
    Exports extends ZsExportable = ZsExportable
> extends ZsZenesisModule {
    constructor(readonly _def: ZsFileDef<Exports>) {
        super("file", _def.name)
    }

    get body() {
        return this._def.body
    }

    readonly name = this._def.name
    static create<Exports extends ZsExportable>(
        name: string,
        body: ZsModuleDeclarations<Exports>
    ): ZsFile<Exports> {
        return new ZsFile<Exports>({
            moduleName: ZsModuleKind.ZsFile,
            name,
            body: ZsModuleBody.create(body)
        })
    }

    get proxy() {
        return this._def.body.proxy(this)
    }
}
