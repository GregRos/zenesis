import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsTypeAliasRef } from "../refs";
import { ZsTypeKind } from "../kinds";

export interface ZsTypeAliasDef<Name extends string, Type extends ZodTypeAny>
    extends ZodTypeDef {
    name: Name;
    typeName: ZsTypeKind.ZsTypeAlias;
    definition: Type;
}

export class ZsTypeAlias<
        Name extends string = string,
        Instance extends ZodTypeAny = ZodTypeAny
    >
    extends ZsMonoType<TypeOf<Instance>, ZsTypeAliasDef<Name, Instance>>
    implements ZsTypeAliasRef<Name, TypeOf<Instance>>
{
    readonly name = this._def.name;
    readonly actsLike = this._def.definition;
    readonly declaration = "alias";

    static create<Name extends string, T extends ZodTypeAny>(
        name: Name,
        definition: T
    ) {
        return new ZsTypeAlias({
            typeName: ZsTypeKind.ZsTypeAlias,
            name,
            definition
        });
    }
}
