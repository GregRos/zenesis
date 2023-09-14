import { ZsNodeKind } from "../kinds";
import { ZsFunction } from "../expressions/function";
import { Access } from "../utils";
import { ZsOverloads } from "../expressions/overloads";
import { ZodTypeAny } from "zod";

export interface ZsClassFieldDef<
    Name extends string,
    A extends Access,
    Type extends ZodTypeAny
> {
    kind: ZsNodeKind.ZsField;
    access: A;
    readonly: boolean;
    name: Name;
    type: Type;
}

export class ZsClassField<
    Name extends string,
    Type extends ZodTypeAny,
    A extends Access
> {
    constructor(readonly _def: ZsClassFieldDef<Name, A, Type>) {}

    static create<Name extends string, Type extends ZodTypeAny>(
        name: Name,
        type: Type
    ) {
        return new ZsClassField({
            kind: ZsNodeKind.ZsField,
            access: "public",
            readonly: false,
            name,
            type
        });
    }

    optional(optional: boolean) {
        return new ZsClassField({
            ...this._def,
            type: this._def.type.optional()
        });
    }

    access<V extends Access>(access: V) {
        return new ZsClassField({
            ...this._def,
            access: access
        });
    }

    readonly(readonly: boolean) {
        return new ZsClassField({
            ...this._def,
            readonly
        });
    }
}
