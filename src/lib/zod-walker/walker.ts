import { ZodNamedTypeAny, ZodNameOf } from "./types";
import { Set, Map } from "immutable";
import { Scope } from "./scope";
import { TypeNode } from "typescript";

export interface TypeWalkerCtx<Zods extends ZodNamedTypeAny, Out> {
    recurse<Z extends Zods>(node: Z): Out;
    readonly scope: Scope<Zods>;
}

export type ZodWalkerHandler<Zods extends ZodNamedTypeAny, Out> = (
    z: Zods,
    ctx: TypeWalkerCtx<Zods, Out>
) => Out;

export type ZodWalkerSubset<
    AllZods extends ZodNamedTypeAny,
    SomeZods extends AllZods
> = {
    [K in ZodNameOf<SomeZods>]: ZodWalkerHandler<AllZods, TypeNode>;
};

export class ZodWalker<Zods extends ZodNamedTypeAny, Out> {
    private _scopes = new Scope<Zods>();
    constructor(
        private _handlers: Map<ZodNameOf<Zods>, ZodWalkerHandler<Zods, Out>>
    ) {}

    private _createCtx() {
        const walker = this;
        return {
            recurse<Z extends Zods>(node: Z): Out {
                return walker._walk(node, this);
            },
            scope: this._scopes
        };
    }

    private _walk<Z extends Zods>(node: Z, ctx: TypeWalkerCtx<Zods, Out>): Out {
        const handler = this._handlers.get(node._def.typeName);
        if (!handler) {
            throw new Error(`No handler for ${node._def.typeName}`);
        }
        return handler(node, ctx);
    }

    extend<Zods2 extends ZodNamedTypeAny, Out>(handlers: {
        [K in ZodNameOf<Zods2>]: ZodWalkerHandler<Zods2, Out>;
    }) {
        const newHandlers = this._handlers.merge(Map(handlers));

        return new ZodWalker<Zods | Zods2, Out>(newHandlers as any);
    }

    static create<Zods extends ZodNamedTypeAny, Out>(handlers: {
        [Z in Zods as ZodNameOf<Z>]: ZodWalkerHandler<Zods, Out>;
    }) {
        return new ZodWalker<Zods, Out>(Map(handlers));
    }
}

export function createHandlersFactory<AllZods extends ZodNamedTypeAny>() {
    return function createHandlers<Names extends ZodNameOf<AllZods>>(handlers: {
        [K in Names]: ZodWalkerHandler<
            Extract<AllZods, ZodNamedTypeAny<K>>,
            TypeNode
        >;
    }) {
        return handlers;
    };
}
