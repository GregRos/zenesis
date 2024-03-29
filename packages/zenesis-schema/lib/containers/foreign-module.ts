import { ZsModuleKind } from "../core/type-kind"
import { ZsModule, ZsModuleDef } from "./base-module"
import { ZsForeignImport } from "./foreign-import"

export interface ZsForeignModuleDef extends ZsModuleDef {
    readonly moduleName: ZsModuleKind.ZsForeign
    readonly name: string
}

export class ZsForeignModule extends ZsModule<ZsForeignModuleDef> {
    readonly isZenesis = false
    static create(name: string): ZsForeignModule {
        return new ZsForeignModule({
            moduleName: ZsModuleKind.ZsForeign,
            name: name
        })
    }

    get name() {
        return this._def.name
    }

    import<As extends object = any>(name: string): ZsForeignImport<As> {
        return ZsForeignImport.create(this, name)
    }
}
