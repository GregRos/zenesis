import { ZsExportable } from "../construction/refs";
import { ExportsRecord, ZsExportsIterable } from "./types";
import { Lazy, lazy, seq, Seq } from "lazies";
import { z, ZodLazy, ZodTypeAny } from "zod";

export class ExportsCollection<Exports extends ZsExportable<any>> {
    private _pulled: Seq<Exports>;
    private _record = {} as ExportsRecord<Exports>;

    constructor(private _exports: ZsExportsIterable<Exports>) {
        this._pulled = seq(_exports).pull();
    }

    private _find<K extends Exports["name"]>(
        name: K
    ): (Exports & { name: K }) | undefined {
        if (name in this._record) {
            return this._record[name];
        }
        for (const item of this._pulled) {
            (this._record as any)[item.name] = item;
            if (item.name === name) {
                return item;
            }
        }
        return undefined;
    }

    private _mustFind<K extends Exports["name"]>(
        name: K
    ): Exports & { name: K } {
        const result = this._find(name);
        if (!result) {
            throw new Error(`Could not find export ${name}`);
        }
        return result;
    }

    type<K extends Exports["name"]>(
        name: K
    ): ZodLazy<Exports & { name: K } & ZodTypeAny> {
        return z.lazy(() => {
            const result = this._mustFind(name);
            if (result.declaration === "value") {
                throw new Error(`Export ${name} is a value`);
            }
            return result as any;
        });
    }

    value<K extends Exports["name"]>(name: K): Lazy<Exports & { name: K }> {
        return lazy(() => {
            const result = this._mustFind(name);
            if (result.declaration !== "value") {
                throw new Error(`Export ${name} is not a value`);
            }
            return result as any;
        });
    }

    get types(): ExportsRecord<Exports> {
        return new Proxy(this._record, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    return this.type(prop);
                }
                return Reflect.get(target, prop);
            }
        });
    }
}
