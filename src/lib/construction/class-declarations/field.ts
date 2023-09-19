import { ZsNodeKind } from "../kinds";
import { Access } from "../utils";
import { ZodTypeAny } from "zod";

export interface ZsClassFieldDef<Name extends string, Type extends ZodTypeAny> {
    kind: ZsNodeKind.ZsField;
    access: Access;
    readonly: boolean;
    name: Name;
    type: Type;
}

export class ZsClassField<
    Name extends string = string,
    Type extends ZodTypeAny = ZodTypeAny
> {
    readonly scope = "class";
    constructor(readonly _def: ZsClassFieldDef<Name, Type>) {}

    get name() {
        return this._def.name;
    }

    get schema() {
        return this._def.type;
    }

    readonly declaration = "field";

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
