import { ZodiTypeVar, ZodiTypeVars } from "./type-var";
import { ParseInput, ParseReturnType, ZodTypeAny, ZodTypeDef } from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZodiMonoType } from "../mono-type";
import { ZodiDeclaredObjectLike, ZodiDeclaredShaped } from "./general";

export type AllSubtypeOf<Vars extends ZodiTypeVars> = {
    [K in keyof Vars as Vars[K] extends ZodiTypeVar<any, any>
        ? Vars[K]["_default"] extends null
            ? K
            : never
        : never]: SchemaSubtypeOf<Vars[K]>;
} & {
    [K in keyof Vars]?: SchemaSubtypeOf<Vars[K]>;
};

export interface ZodiGenericTypeDef<
    TypeVars extends ZodiTypeVars,
    Instance extends ZodTypeAny
> {
    instance: Instance;
    typeVars: TypeVars;
}

export class ZodiGenericType<
    TypeVars extends ZodiTypeVars,
    Instance extends ZodTypeAny
> {
    constructor(private _def: ZodiGenericTypeDef<TypeVars, Instance>) {}

    instantiate<TypeArgs extends AllSubtypeOf<TypeVars>>(
        ...typeArgs: TypeArgs
    ) {
        return new ZodiGenericInstance({
            ...this._def,
            typeArgs: typeArgs as any,
            typeName: "ZodiGenericInstance",
            instance: this._def.instance,
            type: this
        });
    }

    typeVars<TypeVars extends ZodiTypeVars>(
        ...tVars: TypeVars
    ): ZodiGenericType<TypeVars, Instance> {
        return new ZodiGenericType({
            ...this._def,
            typeVars: tVars
        });
    }

    static create<Instance extends ZodTypeAny>(instance: Instance) {
        return new ZodiGenericType<[], Instance>({
            instance,
            typeVars: []
        });
    }
}

export class ZodiGenericInstance<
    Instance extends ZodTypeAny
> extends ZodiMonoType<Instance["_type"], ZodiGenericInstanceDef<Instance>> {
    _instance!: Instance;

    get declaration(): Instance extends ZodiDeclaredShaped
        ? Instance["declaration"]
        : undefined {
        if (this._instance instanceof ZodiDeclaredObjectLike) {
            return this._instance.shape;
        }
        return undefined as any;
    }

    get shape(): Instance extends ZodiDeclaredShaped
        ? Instance["shape"]
        : undefined {
        if (this._instance instanceof ZodiDeclaredObjectLike) {
            return this._instance.shape;
        }
        return undefined as any;
    }

    constructor(def: ZodiGenericInstanceDef<Instance>) {
        super(def);
    }

    _parse(input: ParseInput): ParseReturnType<Instance["_input"]> {
        return this._def.instance._parse(input);
    }
}

export interface ZodiGenericInstanceDef<Instance extends ZodTypeAny>
    extends ZodTypeDef {
    typeName: "ZodiGenericInstance";
    type: ZodiGenericType<ZodiTypeVars, Instance>;
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]] | [];
    instance: Instance;
}

export const genericType = ZodiGenericType.create;
