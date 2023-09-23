import { TypeNode, TypeReferenceNode } from "typescript";
import { Map } from "immutable";

import { ZodNamedTypeAny, ZodNamedTypeDef } from "./types";
import { ZodType } from "zod";

export interface RestorePreviousScope {
    load(): void;
}

export class Scope<All extends ZodNamedTypeAny> {
    private _scopes = Map<ZodNamedTypeDef, TypeReferenceNode>();

    get snapshot(): RestorePreviousScope {
        const current = this._scopes;
        return {
            load: () => {
                this._scopes = current;
            }
        };
    }

    private _getDef(schemaOrDef: All | All["_def"]): All["_def"] {
        return schemaOrDef instanceof ZodType ? schemaOrDef._def : schemaOrDef;
    }

    set(schema: All | All["_def"], reference: TypeReferenceNode) {
        const restorer = this.snapshot;
        const def = this._getDef(schema);
        if (this._scopes.has(def)) {
            throw new Error(`The node ${schema} already exists`);
        }
        const current = this._scopes;
        this._scopes = current.set(def, reference);
        return restorer;
    }

    get(node: All | All["_def"]): TypeReferenceNode {
        const def = this._getDef(node);
        if (!this._scopes.has(def)) {
            throw new Error(`No scope for ${node}`);
        }
        return this._scopes.get(def)!;
    }
}
