import { ZsDeclaredDef, ZsDeclaredType } from "./general";
import { ParseInput, ParseReturnType, z, ZodTypeAny } from "zod";
import { ZsMonoType } from "../mono-type";

export interface ZsTypeAliasDef<Type> extends ZsDeclaredDef {
    name: string;
    typeName: "ZsTypeAlias";
    definition: ZsMonoType<Type, any>;
}

export class ZsTypeAlias<Type> extends ZsMonoType<Type, ZsTypeAliasDef<Type>> {
    readonly actsLike = this._def.definition;

    readonly declaration = "typeAlias";
}
