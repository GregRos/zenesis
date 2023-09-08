import { ZsDeclaredDef } from "./general";
import { TypeOf, ZodTypeAny } from "zod";
import { ZsMonoType } from "../mono-type";
import { ZsTypeAliasRef } from "../refs";

export interface ZsTypeAliasDef<Type extends ZodTypeAny> extends ZsDeclaredDef {
    name: string;
    typeName: "ZsTypeAlias";
    definition: Type;
}

export class ZsTypeAlias<Instance extends ZodTypeAny>
    extends ZsMonoType<Instance, ZsTypeAliasDef<Instance>>
    implements ZsTypeAliasRef<TypeOf<Instance>>
{
    readonly actsLike = this._def.definition;
    readonly declaration = "typeAlias";
    static create<Instance extends ZodTypeAny>(
        name: string,
        instance: Instance
    ) {
        return new ZsTypeAlias<Instance>({
            typeName: "ZsTypeAlias",
            name,
            definition: instance
        });
    }
}
