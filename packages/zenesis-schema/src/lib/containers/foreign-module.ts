import { ZsModuleKind } from "../kinds"
import { ZsModule, ZsModuleDef } from "./base-module"
import { ZsForeignImport } from "./foreign-import"
import { GenericConstraintBuilder } from "./generic-builder"

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

    import<As = any>(name: string): ZsForeignImport<As> {
        return ZsForeignImport.create(this, name)
    }

    generic<Names extends string>(...names: [Names, ...Names[]]) {
        return GenericConstraintBuilder.create(this, ...names)
    }
}
