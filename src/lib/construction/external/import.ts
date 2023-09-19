import { ZsMonoType } from "../mono-type";
import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsGenericType } from "../generic/generic-type";
import { ZsExporter } from "./module";
import { getDeclarationType } from "../refs";
import { ZsTypeKind } from "../kinds";
import { ZsImportedGeneric } from "./imported-generic";

export interface ZsSharedImportDef<Typed> {
    module: ZsExporter;
    name: string;
    typed: () => Typed;
}

export interface ZsImportDef<Typed extends ZodTypeAny>
    extends ZsSharedImportDef<Typed>,
        ZodTypeDef {
    typeName: ZsTypeKind.ZsImportedType;
    module: ZsExporter;
    name: string;
    typed: () => Typed;
}

export interface ImportBuilder {
    typed<As extends ZodTypeAny | ZsGenericType>(
        as: As
    ): As extends ZodTypeAny
        ? ZsImportedType<As>
        : As extends ZsGenericType
        ? ZsImportedGeneric<As>
        : never;
}

export class ZsImportedType<As extends ZodTypeAny> extends ZsMonoType<
    TypeOf<As>,
    ZsImportDef<As>
> {
    get actsLike() {
        return this._def.typed();
    }

    get declaration(): getDeclarationType<As> {
        const maybeDeclaration = (this._def.typed as any).declaration;
        return maybeDeclaration;
    }

    static create<Typed extends ZodTypeAny>(
        module: ZsExporter,
        name: string,
        typed: () => Typed
    ) {
        return new ZsImportedType<Typed>({
            typeName: ZsTypeKind.ZsImportedType,
            module,
            name,
            typed: typed
        });
    }
}
