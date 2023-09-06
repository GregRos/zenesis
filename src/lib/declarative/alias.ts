import { ZsDeclaredDef, ZsDeclaredType } from "./general";
import { ParseInput, ParseReturnType, ZodTypeAny } from "zod";
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
    get definition() {
        return this._def.definition;
    }

    _parse(input: ParseInput): ParseReturnType<Type> {
        return this.definition._parse(input);
    }

    readonly declaration = "typeAlias";
}
