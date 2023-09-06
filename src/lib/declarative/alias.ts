import { ZsDeclaredDef, ZsDeclaredType } from "./general";
import { ParseInput, ParseReturnType, z, ZodTypeAny } from "zod";
import { ZsMonoType } from "../mono-type";

export interface ZsTypeAliasDef<Type> extends ZsDeclaredDef {
    name: string;
    typeName: "ZsTypeAlias";
    definition: ZsMonoType<Type, any>;
}

export class ZsTypeAlias<Type> extends ZsDeclaredType<
    Type,
    ZsTypeAliasDef<Type>
> {
    readonly actsLike = z.lazy(() => this.definition);

    get definition() {
        return this._def.definition;
    }

    _parse(input: ParseInput): ParseReturnType<Type> {
        return this.definition._parse(input);
    }

    readonly declaration = "typeAlias";
}
