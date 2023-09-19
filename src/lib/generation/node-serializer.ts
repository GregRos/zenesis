import { AnyKind } from "../construction/kinds";
import { TypeSchema } from "../construction/schemas";
import { TypeNode } from "typescript";

export type SchemaOf<K extends AnyKind> = Extract<
    TypeSchema,
    {
        readonly _def: {
            readonly typeName: K;
        };
    }
>;

export type SchemaHandler<K extends AnyKind> = (
    ctx: NodeContext,
    node: SchemaOf<K>
) => TypeNode;

export class Serializer<K extends AnyKind> {
    constructor(
        readonly kind: K,
        readonly serialize: SchemaHandler<K>
    ) {}
}

export interface NodeContext {
    readonly name: string;

    get<K extends AnyKind>(node: SchemaOf<K>): TypeNode;
}

export function serializes<NodeSubset extends AnyKind>(nodes: {
    [K in NodeSubset]: SchemaHandler<K>;
}) {
    return nodes;
}
