import { ZsGenericType } from "../generic/generic-type";
import { ZsTypeCtorKind, ZsTypeKind } from "../kinds";
import { getDeclarationType } from "../refs";
import { ZsExporter } from "./module";
import { ZsSharedImportDef } from "./import";

export interface ZsGenericImportDef<G extends ZsGenericType>
    extends ZsSharedImportDef<G> {
    typeName: ZsTypeKind.GenericZsImportedType;
}

export class ZsImportedGeneric<G extends ZsGenericType = ZsGenericType> {
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
            typeName: ZsTypeKind.GenericZsImportedType,
            module,
            name,
            typed: typed
        });
    }
}
