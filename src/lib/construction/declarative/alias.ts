import { TypeOf, z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsTypeAliasRef } from "../refs";
import { ZsTypeKind } from "../kind";

export interface ZsTypeAliasDef<Name extends string, Type extends ZodTypeAny>
    extends ZodTypeDef {
    name: Name;
    typeName: ZsTypeKind.TypeAlias;
    definition: Type;
}

export class ZsTypeAlias<Name extends string, Instance extends ZodTypeAny>
    extends ZsMonoType<Instance, ZsTypeAliasDef<Name, Instance>>
    implements ZsTypeAliasRef<Name, TypeOf<Instance>>
{
    readonly name = this._def.name;
    readonly actsLike = this._def.definition;
    readonly declaration = "alias";

    static create<Name extends string>(name: Name) {
        return new ZsTypeAlias({
            typeName: ZsTypeKind.TypeAlias,
            name,
            definition: z.undefined()
        }) as ZsTypeAliasBuilder<Name>;
    }

    body<Instance extends ZodTypeAny>(definition: Instance) {
        return new ZsTypeAlias({ ...this._def, definition: definition });
    }
}

export interface ZsTypeAliasBuilder<Name extends string> {
    body<Instance extends ZodTypeAny>(
        definition: Instance
    ): ZsTypeAlias<Name, Instance>;
}
