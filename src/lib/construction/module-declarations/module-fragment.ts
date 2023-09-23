import { z } from "zod"
import { ZsClass } from "./class"
import { ZsInterface } from "./interface"
import { ZsValue } from "./value"
import { ZsTypeAlias } from "./alias"
import { seq, Seq } from "lazies"

import { ZsModuleDeclarator } from "./declarator"

export type ZsModuleDecl = ZsNamedModuleDecl | ZsValue
export type ZsNamedModuleDecl = ZsClass | ZsInterface | ZsTypeAlias
export type ZsModuleDeclarations<Decl extends ZsModuleDecl> = (
    declarator: ZsModuleDeclarator
) => { [Symbol.iterator]: () => Iterator<Decl, void> }
export type getExportName<Export extends ZsModuleDecl> =
    Export extends ZsNamedModuleDecl ? Export["name"] : never

export type ExportsRecord<Exports extends ZsModuleDecl> = {
    [Export in Extract<
        Exports,
        ZsNamedModuleDecl
    > as getExportName<Export>]: Export
}

export const symActual = Symbol("actual")

export class ZsModuleFragment<Decl extends ZsModuleDecl = ZsModuleDecl> {
    protected _seq: Seq<Decl>
    private _last = {} as ExportsRecord<Decl>;

    [Symbol.iterator]() {
        return this._seq[Symbol.iterator]()
    }
    constructor(exports: Iterable<Decl>) {
        this._seq = seq(exports).pull()
    }

    allOfType<T extends Decl["declaration"]>(
        type: T
    ): (Decl & { declaration: T })[] {
        return this._seq
            .filter(item => item.declaration === type)
            .toArray() as any
    }

    pull<Name extends getExportName<Decl>>(name: Name) {
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

    ref<Name extends keyof typeof this._last>(
        name: Name
    ): (typeof this._last)[Name] {
        return z.lazy(() => this.pull(name)) as any
    }

    proxy<Actual extends object>(actual: Actual): ExportsRecord<Decl> {
        return new Proxy(actual, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    return this.ref(prop as any)
                }
                if (prop === symActual) {
                    return actual
                }
                return Reflect.get(actual as any, prop)
            }
        }) as any
    }

    static create<Exports extends ZsModuleDecl>(
        exports: ZsModuleDeclarations<Exports>
    ) {
        return new ZsModuleFragment(exports(new ZsModuleDeclarator()))
    }
}
