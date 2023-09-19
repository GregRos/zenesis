import { ZsNamedDecl, ZsTypedDecl } from "../construction/refs";
import { ExportsRecord } from "./types";
import { seq, Seq } from "lazies";

export class DeclCollection<Decl extends ZsTypedDecl> {
    protected _pulled: Seq<Decl>;

    constructor(exports: Iterable<Decl>) {
        this._pulled = seq(exports).pull();
    }

    allOfType<T extends Decl["declaration"]>(
        type: T
    ): (Decl & { declaration: T })[] {
        return this._pulled
            .filter(item => item.declaration === type)
            .toArray() as any;
    }
}

export class NamedDeclCollection<
    Decl extends ZsNamedDecl
> extends DeclCollection<Decl> {
    private _record = {} as Record<Decl["name"], Decl>;

    private _byName<K extends Decl["name"]>(
        name: K
    ): (Decl & { name: K }) | undefined {
        if (name in this._record[name]) {
            return this._record[name] as any;
        }
        for (const item of this._pulled) {
            (this._record as any)[item.name] = item;
            if (item.name === name) {
                return item as any;
            }
        }
        return undefined;
    }

    private _mustByName<T extends Decl["declaration"], K extends Decl["name"]>(
        name: K
    ): Decl & { declaration: T; name: K } {
        const result = this._byName(name);
        if (!result) {
            throw new Error(`Could not find export ${name}`);
        }
        return result as any;
    }

    createProxy(type: Decl["declaration"]): ExportsRecord<Decl> {
        return new Proxy(this._record, {
            get: (target, prop) => {
                if (typeof prop === "string") {
                    return this._mustByName(prop);
                }
                return Reflect.get(target, prop);
            }
        }) as any;
    }
}
