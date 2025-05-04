import { seq, Seq } from "doddle"
import { ZsValue } from "../declarations/value"

import { ZsExportable, ZsExportableTypeLike } from "../utils/unions"
import { createImportReference } from "./zenesis-import"
import { ZsZenesisModule } from "./zenesis-module"

export type getExportName<Export extends ZsExportable> =
    Export extends ZsExportable ? Export["name"] : never

export type ExportsRecord<Exports extends ZsExportable> = {
    [Export in Extract<Exports, ZsExportableTypeLike> as getExportName<Export> &
        string]: Export
}

export const symActual = Symbol("actual")

/**
 * A module body is a collection of exports backed by an iterable. It's used by
 * Files and other modules.
 */
export class ZsModuleBody<Exports extends ZsExportable = ZsExportable>
    implements Iterable<ZsExportable>
{
    protected _seq: Seq<Exports>
    _last = {} as ExportsRecord<Exports>;

    [Symbol.iterator]() {
        return this._seq[Symbol.iterator]()
    }

    constructor(exports: Iterable<Exports>) {
        this._seq = seq(exports).pull()
    }

    /**
     * Pulls an export out of the module body, evaluating the body as it does so. This
     * returns the actual exported type, not a proxy.
     * @param name
     * @returns
     */
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

    /**
     * Returns a lazy reference to one of this module body's exports. It will be said to
     * come from the given `origin`.
     */
    ref<Name extends keyof typeof this._last & string>(
        origin: ZsZenesisModule,
        name: Name
    ): (typeof this._last)[Name] {
        return createImportReference({
            name,
            text: `import ${name} from ${origin.name}`,
            deref: () => this.pull(name),
            origin
        })
    }

    /**
     * Returns a proxy that allows lazy access to this module's body exports. The proxy
     * is checked during compile time.
     * @param actual The module being proxied.
     * @returns
     */
    proxy<Module extends ZsZenesisModule>(
        actual: Module
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
        exports: () => Iterable<Exports>
    ) {
        return new ZsModuleBody(exports())
    }
}
