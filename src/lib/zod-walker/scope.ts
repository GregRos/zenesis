import { TypeNode } from "typescript";
import { Map } from "immutable";

import { ZodNamedTypeAny } from "./types";

export interface RestorePreviousScope {
    load(): void;
}

export class Scope<All extends ZodNamedTypeAny> {
    private _scopes = Map<All, TypeNode>();

    get snapshot(): RestorePreviousScope {
        const current = this._scopes;
        return {
            load: () => {
                this._scopes = current;
            }
        };
    }

    set(schema: All, reference: TypeNode) {
        const current = this._scopes;
        this._scopes = current.set(schema, reference);
    }

    get(node: All) {
        if (!this._scopes.has(node)) {
            throw new Error(`No scope for ${node}`);
        }
        return this._scopes.get(node)!;
    }
}
