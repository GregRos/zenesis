import { TypeOf, z, ZodAny, ZodTypeAny, ZodTypeDef } from "zod";
import { SchemaSubtypeOf } from "../utils";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeVars } from "./type-var";
import { ZsDeclaration, ZsDeclaredShape } from "./general";

export type ZsTypeVarVariance = "" | "in" | "out" | "inout";

export interface ZsTypeVarDef<
    Extends extends ZodTypeAny = any,
    Default extends SchemaSubtypeOf<Extends> | null = any
> extends ZodTypeDef {
    readonly typeName: "ZsTypeVar";
    readonly name: string;
    readonly extends: Extends;
    readonly default: Default;
    readonly const: boolean;
    readonly variance: ZsTypeVarVariance;
}

export class ZsTypeVar<
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> extends ZsMonoType<Extends, ZsTypeVarDef<Extends, Default>> {
    static create<Name extends string>(name: Name) {
        return new ZsTypeVar({
            typeName: "ZsTypeVar",
            name,
            extends: z.any(),
            default: null,
            const: false,
            variance: ""
        });
    }

    actsLike = this._def.extends;
}

export type ZsTypeVarsRecord<Names extends string = any> = {
    [K in Names]: ZsTypeVar;
};

export type Reification<
    Names extends keyof Vars,
    Vars extends ZsTypeVarsRecord
> = {
    [K in Names]: Vars[K]["_def"]["extends"];
};

export class TypeVarBuilder<
    Extends extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Extends> | null
> {
    constructor(private _var: ZsTypeVar<Extends, Default>) {}

    extends<
        Extends extends Default extends SchemaSubtypeOf<Extends> | null
            ? ZodTypeAny
            : never
    >(constraint: Extends): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder<Extends, Default>(
            new ZsTypeVar({
                ...this._var._def,
                extends: constraint
            })
        );
    }

    default<Default extends SchemaSubtypeOf<Extends> | null>(
        defaultValue: Default
    ): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                default: defaultValue
            })
        );
    }

    const(constant: boolean): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                const: constant
            })
        );
    }

    variance(variance: ZsTypeVarVariance): TypeVarBuilder<Extends, Default> {
        return new TypeVarBuilder(
            new ZsTypeVar({
                ...this._var._def,
                variance
            })
        );
    }
}

export class GenericBuilder<
    Names extends string,
    Vars extends ZsTypeVarsRecord<Names>
> {
    constructor(
        private _names: Names[],
        private _vars: Vars
    ) {}

    static create<Names extends string>(...names: [Names, ...Names[]]) {
        return new GenericBuilder(
            names,
            {} as Record<Names, ZsTypeVar<ZodAny, null>>
        );
    }

    where<
        Name extends Names,
        NewExtends extends ZodTypeAny = Vars[Name]["_def"]["extends"],
        NewDefault extends ZodTypeAny | null = Vars[Name]["_def"]["default"]
    >(
        name: Name,
        declarator: (
            w: TypeVarBuilder<
                Vars[Name]["_def"]["extends"],
                Vars[Name]["_def"]["default"]
            > &
                Reification<Names, Vars>
        ) => TypeVarBuilder<NewExtends, NewDefault>
    ): GenericBuilder<
        Names,
        {
            [K in keyof Vars]: K extends Name
                ? ZsTypeVar<NewExtends, NewDefault>
                : Vars[K];
        }
    > {
        return new GenericBuilder(this._names, {
            ...this._vars,
            [name]: declarator(new TypeVarBuilder(this._vars[name]) as any)
        }) as any;
    }

    define<Instance extends ZsDeclaration<any>>(
        constructor: (reification: Reification<Names, Vars>) => Instance
    ): Generic<Vars, Instance> {
        const instance = constructor(this._vars);
        return new Generic(this._names, this._vars, instance);
    }
}

export class Generic<
    Vars extends ZsTypeVarsRecord,
    Instance extends ZodTypeAny
> {
    constructor(
        private _ordering: (keyof Vars)[],
        private _vars: Vars,
        private _instance: Instance
    ) {}

    instantiate<
        TypeArgs extends {
            [Name in keyof Vars as Vars[Name] extends ZsTypeVar<any, null>
                ? Name
                : never]: SchemaSubtypeOf<Vars[Name]["_def"]["extends"]>;
        } & {
            [Name in keyof Vars]?: SchemaSubtypeOf<
                Vars[Name]["_def"]["extends"]
            >;
        }
    >(args: TypeArgs): ZsInstantiation<Instance> {
        const typeArgs = this._ordering.map(name => args[name]);
        return new ZsInstantiation({
            typeArgs: typeArgs as any,
            instance: this._instance,
            typeName: "ZsInstantiation"
        });
    }
}

export interface ZsInstantiationDef<Instance extends ZodTypeAny>
    extends ZodTypeDef {
    typeName: "ZsInstantiation";
    typeArgs: [ZodTypeAny, ...ZodTypeAny[]] | [];
    instance: Instance;
}

export class ZsInstantiation<Instance extends ZodTypeAny> extends ZsMonoType<
    Instance,
    ZsInstantiationDef<Instance>
> {
    get declaration(): Instance extends ZsDeclaredShape
        ? Instance["declaration"]
        : undefined {
        if ("declaration" in this.actsLike) {
            return this.actsLike.declaration as any;
        }
        return undefined as any;
    }

    get shape(): Instance extends ZsDeclaredShape
        ? Instance["shape"]
        : undefined {
        if ("shape" in this.actsLike) {
            return this.actsLike.shape as any;
        }
        return undefined as any;
    }

    get actsLike() {
        return this._def.instance;
    }
}

const generic = GenericBuilder.create("A", "B", "C")
    .where("A", w => w.extends(z.string()))
    .where("B", w => w.extends(w.C).default(z.literal("a")))
    .define(vars => {
        return z.any();
    });
