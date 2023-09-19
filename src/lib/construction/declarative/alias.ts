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

export class ZsTypeAlias<Name extends string, Instance extends ZodTypeAny>
    extends ZsMonoType<Instance, ZsTypeAliasDef<Name, Instance>>
    implements ZsTypeAliasRef<Name, TypeOf<Instance>>
{
    readonly name = this._def.name;
    readonly actsLike = this._def.definition;
    readonly declaration = "alias";

    static create<Name extends string>(name: Name, definition: ZodTypeAny) {
        return new ZsTypeAlias({
            typeName: ZsTypeKind.ZsTypeAlias,
            name,
            definition
        });
    }
}
