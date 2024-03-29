import { TypeOf, ZodAny, ZodTypeAny, ZodTypeDef, ZodUnknown } from "zod"
import { ZsMonoType } from "../core/mono-type"
import { SchemaSubtypeOf } from "../core/operators"
import { ZsTypeKind } from "../core/type-kind"

export interface ZsTypeVarRefDef<
    Name extends string,
    Extends extends ZodTypeAny,
    Default extends SchemaSubtypeOf<Extends> | null
> extends ZodTypeDef {
    readonly typeName: ZsTypeKind.ZsTypeVarRef
    readonly name: Name
    readonly extends: Extends
    readonly default: Default
    readonly const: boolean
    readonly variance: ZsTypeVarVariance
}

export class ZsTypeVarRef<
    Name extends string = string,
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> extends ZsMonoType<TypeOf<Extends>, ZsTypeVarRefDef<Name, Extends, Default>> {
    readonly actsLike = ZodAny.create()
    readonly name = this._def.name
    static create<Name extends string, Extends extends ZodTypeAny>(
        name: Name
    ): ZsTypeVarRef<Name> {
        return new ZsTypeVarRef({
            typeName: ZsTypeKind.ZsTypeVarRef,
            name,
            const: false,
            extends: ZodUnknown.create(),
            default: null,
            variance: ""
        })
    }
}

export type ZsTypeVarRefs = [ZsTypeVarRef, ...ZsTypeVarRef[]]

export type ZsTypeVarVariance = "" | "in" | "out" | "inout"

export type FromVar<V extends TypeVar> =
    V extends TypeVar<infer Name, infer Extends, infer Default>
        ? ZsTypeVarRef<Name, Extends, Default>
        : never

export class TypeVar<
    Name extends string = string,
    Extends extends ZodTypeAny = ZodTypeAny,
    Default extends
        SchemaSubtypeOf<Extends> | null = SchemaSubtypeOf<Extends> | null
> {
    constructor(
        private readonly _inner: ZsTypeVarRefDef<Name, Extends, Default>
    ) {}

    default<NewDefault extends SchemaSubtypeOf<Extends> | null>(
        newDefault: NewDefault
    ) {
        return new TypeVar({
            ...this._inner,
            default: newDefault
        })
    }
    extends<
        NewExtends extends Default extends NewExtends | null
            ? ZodTypeAny
            : never
    >(extends_: NewExtends) {
        return new TypeVar({
            ...this._inner,
            extends: extends_
        })
    }
    static create<Name extends string>(name: Name) {
        return new TypeVar({
            typeName: ZsTypeKind.ZsTypeVarRef,
            name,
            const: false,
            extends: ZodUnknown.create(),
            default: null,
            variance: ""
        })
    }

    const(flag: boolean) {
        return new TypeVar({
            ...this._inner,
            const: flag
        })
    }

    variance(variance: ZsTypeVarVariance) {
        return new TypeVar({
            ...this._inner,
            variance
        })
    }
}
