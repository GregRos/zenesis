import { lazy, seq, Seq } from "lazies"
import { ZsValue } from "../declarations/value"

import { ModuleDeclarator } from "../declarations/module-builder"
import { ZsExportable, ZsTypeLikeExportable } from "../declarations/unions"
import { ZsSmartZenesisImport, ZsZenesisImport } from "./zenesis-import"
import { ZsZenesisModule } from "./zenesis-module"

export type ZsModuleDeclarations<Decl extends ZsExportable> = (
    declarator: ModuleDeclarator
) => { [Symbol.iterator]: () => Iterator<Decl, void> }

export type getExportName<Export extends ZsExportable> =
    Export extends ZsExportable ? Export["name"] : never

export type ExportsRecord<Exports extends ZsExportable> = {
    [Export in Extract<Exports, ZsExportable> as getExportName<Export> &
        string]: Export
}

export const symActual = Symbol("actual")

export class ZsModuleBody<
    Exports extends ZsTypeLikeExportable = ZsTypeLikeExportable
> implements Iterable<ZsTypeLikeExportable>
{
    protected _seq: Seq<Exports>
    _last = {} as ExportsRecord<Exports>;

    [Symbol.iterator]() {
        return this._seq[Symbol.iterator]()
    }

    constructor(exports: Iterable<Exports>) {
        this._seq = seq(exports).pull()
    }

    pull<Name extends getExportName<Exports>>(name: Name) {
        if (this._last[name]) {
            return this._last[name]
        }
        for (const item of this._seq) {
            if (item instanceof ZsValue) {
                continue
            }
            const forced = item as any
            if (forced[name]) {
                return (this._last[name] = forced[name])
            }
        }
        throw new Error(`No export named ${name}`)
    }

    ref<Name extends keyof typeof this._last & string>(
        origin: ZsZenesisModule,
        name: Name
    ): ZsSmartZenesisImport<this["_last"][Name]> {
        const resolved = lazy(() => this.pull(name))
        return ZsZenesisImport.create(name, resolved, origin) as any
    }

    proxy<Actual extends ZsZenesisModule>(
        actual: Actual
    ): ExportsRecord<Exports> {
        return new Proxy(actual, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    return this.ref(actual, prop as any)
                }
                if (prop === symActual) {
                    return actual
                }
                return Reflect.get(actual as any, prop)
            }
        }) as any
    }

    static create<Exports extends ZsExportable>(
        exports: ZsModuleDeclarations<Exports>
    ) {
        return new ZsModuleBody(exports(new ModuleDeclarator()))
    }
}
