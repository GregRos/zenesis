import { ZsModule, ZsModuleDef } from "./base-module"

export abstract class ZsZenesisModule<
    ZDef extends ZsModuleDef
> extends ZsModule<ZDef> {
    readonly isZenesis = true
}
