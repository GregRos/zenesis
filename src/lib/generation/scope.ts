import { TypeNode } from "typescript";
import { Map, Stack } from "immutable";
import { ZsMonoType } from "../construction/mono-type";
import { ZsDeclaredType } from "../construction/refs";

export type NodePair = [ZsMonoType, TypeNode];

export interface RestoreScopes {
    restore(): void;
}

export class Scope {
    private _scopes: Map<ZsDeclaredType, TypeNode>;

    constructor() {
        this._scopes = Map();
    }

    push(...pairs: NodePair[]) {
        const current = this._scopes;
        this._scopes = current.merge(Map(pairs));
        return {
            restore: () => {
                this._scopes = current;
            }
        };
    }

    get(node: ZsMonoType) {
        return this._scopes.get(node);
    }
}
