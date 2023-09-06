import { ZsTypeVar, ZsTypeVars } from "./type-var";
import { ParseInput, ParseReturnType, ZodTypeAny, ZodTypeDef } from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZsMonoType } from "../mono-type";
import { ZsDeclaredShape } from "./general";

export type AllSubtypeOf<Vars extends ZsTypeVars> = {
    [K in keyof Vars as Vars[K] extends ZsTypeVar<any, any>
        ? Vars[K]["_default"] extends null
            ? K
            : never
        : never]: SchemaSubtypeOf<Vars[K]>;
} & {
    [K in keyof Vars]?: SchemaSubtypeOf<Vars[K]>;
};

export interface ZsGenericTypeDef<
    TypeVars extends ZsTypeVars,
    Instance extends ZodTypeAny
> {
    instance: Instance;
    typeVars: TypeVars;
}

export class ZsGeneric<
    TypeVars extends ZsTypeVars,
    Instance extends ZodTypeAny
> {
    constructor(private _def: ZsGenericTypeDef<TypeVars, Instance>) {}

    instantiate<TypeArgs extends AllSubtypeOf<TypeVars>>(
        ...typeArgs: TypeArgs
    ) {
        return new ZsInstantiation({
            ...this._def,
            typeArgs: typeArgs as any,
            typeName: "ZsInstantiation",
            instance: this._def.instance,
            type: this
        });
    }

    typeVars<TypeVars extends ZsTypeVars>(
        ...tVars: TypeVars
    ): ZsGeneric<TypeVars, Instance> {
        return new ZsGeneric({
            ...this._def,
            typeVars: tVars
        });
    }

    static create<Instance extends ZodTypeAny>(instance: Instance) {
        return new ZsGeneric<[], Instance>({
            instance,
            typeVars: []
        });
    }
}

export class ZsInstantiation<Instance extends ZodTypeAny> extends ZsMonoType<
    Instance["_type"],
    ZsInstantiationDef<Instance>
> {
    _instance!: Instance;

    get declaration(): Instance extends ZsDeclaredShape
        ? Instance["declaration"]
        : undefined {
        if ("declaration" in this._instance) {
            return this._instance.declaration as any;
        }
        return undefined as any;
    }

    get shape(): Instance extends ZsDeclaredShape
        ? Instance["shape"]
        : undefined {
        if ("shape" in this._instance) {
            return this._instance.shape as any;
        }
        return undefined as any;
    }

    get actsLike() {
        return this._instance;
    }
}

export interface ZsInstantiationDef<Instance extends ZodTypeAny>
    extends ZodTypeDef {
    typeName: "ZsInstantiation";
    type: ZsGeneric<ZsTypeVars, Instance>;
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]] | [];
    instance: Instance;
}

export const genericType = ZsGeneric.create;
