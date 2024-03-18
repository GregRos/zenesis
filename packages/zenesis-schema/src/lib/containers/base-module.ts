import { ZsModuleKind } from "../kinds"

export interface ZsModuleDef {
    readonly moduleName: ZsModuleKind
    readonly name: string
}

export abstract class ZsModule<ZDef extends ZsModuleDef> {
    constructor(readonly _def: ZDef) {}

    get name() {
        return this._def.name
    }
}
