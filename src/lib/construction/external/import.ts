import { ZsMonoType } from "../mono-type";
import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsGenericType } from "../generic/generic-type";
import { ZsExporter } from "./module";
import { getDeclarationType, ZsDeclaredType } from "../refs";

export interface ZsSharedImportDef<Typed> {
    module: ZsExporter;
    name: string;
    typed: () => Typed;
}

export interface ZsImportDef<Typed extends ZodTypeAny>
    extends ZsSharedImportDef<Typed>,
        ZodTypeDef {
    typeName: "ZsImportedType";
    module: ZsExporter;
    name: string;
    typed: () => Typed;
}

export interface ZsGenericImportDef<G extends ZsGenericType>
    extends ZsSharedImportDef<G> {
    typeName: "ZsImportedGeneric";
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

export class ZsImportedGeneric<G extends ZsGenericType> {
    constructor(readonly _def: ZsGenericImportDef<G>) {}

    instantiate: G["instantiate"] = (...args) => {
        return this._def.typed().instantiate(...args);
    };

    get declaration(): getDeclarationType<G> {
        const maybeDeclaration = (this._def.typed as any).declaration;
        return maybeDeclaration;
    }

    static create<G extends ZsGenericType>(
        module: ZsExporter,
        name: string,
        typed: () => G
    ) {
        return new ZsImportedGeneric<G>({
            typeName: "ZsImportedGeneric",
            module,
            name,
            typed: typed
        });
    }
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
            typeName: "ZsImportedType",
            module,
            name,
            typed: typed
        });
    }
}
