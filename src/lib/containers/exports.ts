import { ZsExportable } from "../construction/refs";
import { Seq, seq } from "lazies";
import { z } from "zod";

export type getExportName<Export extends ZsExportable<string>> = Export["name"];

export interface ZsExports<Exports extends ZsExportable<string>>
    extends Iterable<Exports> {}

export type ExportsRecord<Exports extends ZsExportable<any>> = {
    [Export in Exports as getExportName<Export>]: Export;
};

export const symActual = Symbol("actual");

export class ExportsCollection<Exports extends ZsExportable<any>> {
    private _seq: Seq<ExportsRecord<Exports>>;
    private _last = {} as ExportsRecord<Exports>;

    constructor(iterable: Seq<Exports>) {
        this._seq = seq(iterable).pull();
    }

    pull<Name extends getExportName<Exports>>(name: Name) {
        if (this._last[name]) {
            return this._last[name];
        }
        for (const item of this._seq) {
            if (item[name]) {
                return (this._last[name] = item[name]);
            }
        }
        throw new Error(`No export named ${name}`);
    }

    ref<Name extends getExportName<Exports>>(name: Name) {
        return z.lazy(() => this.pull(name));
    }

    proxy<Actual extends object>(actual: Actual): ExportsRecord<Exports> {
        return new Proxy(actual, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    return this.ref(prop);
                }
                if (prop === symActual) {
                    return actual;
                }
                return Reflect.get(actual as any, prop);
            }
        }) as any;
    }
}
