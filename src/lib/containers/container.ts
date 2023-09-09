import { ZsValue } from "../construction/declarative/value";
import { ZsDeclaredType, ZsExportable, ZsValueRef } from "../construction/refs";
import { ZsTypeAlias } from "../construction/declarative/alias";
import { z } from "zod";

export type getExportName<Export extends ZsExportable<string>> = Export["name"];

export interface ZsExports<Exports extends ZsExportable<string>>
    extends Iterable<Exports> {}

export type CollectedExports<Exports extends ZsExportable<string>> = {
    [Export in Exports as getExportName<Export>]: Export;
};

export class ZsContainer<Exports extends ZsExportable<any>> {
    #record = {} as any;
    #iterated = false;
    #exportsIterator: Iterator<Exports>;

    #collectExports() {
        for (;;) {
            const { done, value } = this.#exportsIterator.next();
            if (done) {
                this.#iterated = true;
                return;
            }
            this.#record[value.name] = value;
        }
    }

    #find(name: string) {
        if (name in this.#record) {
            return this.#record[name];
        }
        for (;;) {
            const { done, value } = this.#exportsIterator.next();
            if (done) {
                return undefined;
            }
            if (value.name === name) {
                return value;
            }
            this.#record[value.name] = value;
        }
    }

    protected constructor(exports: () => Iterable<Exports>) {
        this.#exportsIterator = exports()[Symbol.iterator]();
        return new Proxy(this, {
            get: (target, prop) =>
                z.lazy(() => {
                    return this.#find(prop as string);
                }),
            ownKeys: (
                target: ZsContainer<Exports>
            ): ArrayLike<string | symbol> => {
                if (!this.#iterated) {
                    this.#collectExports();
                }
                return Object.keys(this.#record);
            }
        });
    }

    static create<Exports extends ZsExportable<any>>(
        exports: () => Iterable<Exports>
    ) {
        return new ZsContainer(exports) as ZsContainer<Exports> & {
            [Export in Exports as getExportName<Export>]: Export;
        };
    }
}
