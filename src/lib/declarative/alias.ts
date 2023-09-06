import { ZodiDeclaredDef } from "./general";
import { ZodTypeAny } from "zod";

export interface ZodiTypeAliasDef extends ZodiDeclaredDef {
    name: string;
    typeName: "ZodiTypeAlias";
    definition: ZodTypeAny;
}
