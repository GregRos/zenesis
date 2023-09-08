import { ZsMonoType } from "../mono-type";
import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { Generic } from "../declarative/generic/generic-type";
import { ZsExporter } from "./module";

export interface ZsSharedImportDef<As> {
    module: ZsExporter;
    name: string;
    as: As;
}

export interface ZsImportDef<As extends ZodTypeAny>
    extends ZsSharedImportDef<As>,
        ZodTypeDef {
    typeName: "ZsImportedType";
    module: ZsExporter;
    name: string;
    as: As;
}

export interface ZsGenericImportDef<G extends Generic>
    extends ZsSharedImportDef<G> {
    typeName: "ZsImportedGeneric";
}

export interface ImportBuilder {
    as<As extends ZodTypeAny | Generic>(
        as: As
    ): As extends ZodTypeAny
        ? ZsImportedType<As>
        : As extends Generic
        ? ZsImportedGeneric<As>
        : never;
}

export class ZsImportedGeneric<G extends Generic> {
    constructor(readonly _def: ZsGenericImportDef<G>) {}

    readonly instantiate = this._def.as.instantiate;

    static create<G extends Generic>(module: ZsExporter, name: string, as: G) {
        return new ZsImportedGeneric<G>({
            typeName: "ZsImportedGeneric",
            module,
            name,
            as
        });
    }
}

export class ZsImportedType<As extends ZodTypeAny> extends ZsMonoType<
    TypeOf<As>,
    ZsImportDef<As>
> {
    readonly actsLike = this._def.as;
    static create<As extends ZodTypeAny>(
        module: ZsExporter,
        name: string,
        as: As
    ) {
        return new ZsImportedType<As>({
            typeName: "ZsImportedType",
            module,
            name,
            as
        });
    }
}
