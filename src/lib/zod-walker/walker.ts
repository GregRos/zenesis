import { ZodNamedTypeAny, ZodNameOf } from "./types";
import { Map } from "immutable";
import { Scope } from "./scope";
import { ReadonlyKeyword, SyntaxKind, TypeNode } from "typescript";
import { Modifier, Modifiers, TypeModifierToken } from "./modifiers";
import { tf } from "../generation/tf";

export type ZodWalkerHandler<
    AllZods extends ZodNamedTypeAny,
    MyZod extends AllZods,
    Out
> = (z: MyZod, ctx: TypeWalkerCtx<AllZods, Out>) => Out;

export type ZodTransformsMap<
    MyZods extends ZodNamedTypeAny,
    AllZods extends ZodNamedTypeAny
> = {
    [K in ZodNameOf<MyZods>]: ZodWalkerHandler<MyZods, AllZods[K], unknown>;
};

export interface TypeWalkerCtx<Zods extends ZodNamedTypeAny, Out> {
    recurse<Z extends Zods>(node: Z): Out;
    readonly readonly: Modifier<ReadonlyKeyword>;
    readonly scope: Scope<Zods>;
}

export type ZodWalkerSubset<
    AllZods extends ZodNamedTypeAny,
    SomeZods extends AllZods
> = {
    [K in ZodNameOf<SomeZods>]: ZodWalkerHandler<AllZods, SomeZods[K], any>;
};

export class ZodWalker<Zods extends ZodNamedTypeAny, Out> {
    private _scopes = new Scope<Zods>();

    constructor(
        private _handlers: Map<
            ZodNameOf<Zods>,
            ZodWalkerHandler<Zods, Zods, Out>
        >
    ) {}

    private _createCtx() {
        const walker = this;
        return {
            readonly: Modifier.create(
                "readonly",
                tf.createToken(SyntaxKind.ReadonlyKeyword)
            ),
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
}

export function createHandlersFactory<AllZods extends ZodNamedTypeAny>() {
    return function createHandlers<Names extends ZodNameOf<AllZods>>(handlers: {
        [K in Names]: ZodWalkerHandler<
            AllZods,
            Extract<AllZods, ZodNamedTypeAny<K>>,
            TypeNode
        >;
    }) {
        return handlers;
    };
}