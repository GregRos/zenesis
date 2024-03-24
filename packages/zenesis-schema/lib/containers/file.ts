import { ZsModuleKind } from "../core/type-kind"
import { ZsExportable } from "../utils/unions"
import { ZsModuleBody, ZsModuleScope } from "./module-body"
import { ModuleScopedFactory } from "./module-builder"
import { ZsZenesisModule } from "./zenesis-module"

export interface ZsFileDef<Exports extends ZsExportable> {
    readonly moduleName: ZsModuleKind.ZsFile
    readonly name: string
    readonly body: ZsModuleBody<Exports>
}

export class ZsFile<
    Exports extends ZsExportable = ZsExportable
> extends ZsZenesisModule<ZsFileDef<Exports>> {
    get body() {
        return this._def.body
    }

    static create<Exports extends ZsExportable>(
        name: string,
        body: ZsModuleScope<Exports>
    ): ZsFile<Exports> {
        const factory = new ModuleScopedFactory()
        return new ZsFile({
            moduleName: ZsModuleKind.ZsFile,
            name,
            body: ZsModuleBody.create(body.bind(factory))
        })
    }

    get proxy() {
        return this._def.body.proxy(this)
    }
}
