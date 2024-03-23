import { ZodTypeAny } from "zod"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClassItems } from "../declarations/classlike/body"
import { ZsClass } from "../declarations/classlike/class"
import { ClassScopedFactory } from "../declarations/classlike/class-builder"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsValue, ZsValueKind } from "../declarations/value"
import { ZsGenericSelfref, ZsTypeSelfref } from "../declarations/zenesis-self"
import { TypeVarRefsByName, getTypeArgObject } from "../generics/forall-builder"
import { ZsGeneric } from "../generics/forall-type"
import { ZsTypeVar, ZsTypeVarTuple } from "../generics/type-var"

export class GenericModuleScopedFactory<Vars extends ZsTypeVarTuple> {
    constructor(readonly _vars: Vars) {}

    private get _typeArgsByName() {
        return getTypeArgObject(this._vars)
    }

    where<Name extends Vars[number]["name"], NewVar extends ZsTypeVar<Name>>(
        name: Name,
        declarator: (
            cur: Extract<Vars[number], { name: Name }>,
            others: TypeVarRefsByName<Vars>
        ) => NewVar
    ): GenericModuleScopedFactory<{
        [I in keyof Vars]: Vars[I]["name"] extends Name ? NewVar : Vars[I]
    }> {
        return new GenericModuleScopedFactory(
            this._vars.map(v =>
                v.name === name ? declarator(v as any, this._typeArgsByName) : v
            ) as any
        )
    }

    Interface<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: (
            this: Omit<ClassScopedFactory<ZsGenericSelfref>, "Constructor">,
            args: TypeVarRefsByName<Vars>
        ) => Iterable<Decl>
    ) {
        const self = ZsGenericSelfref.create(this._vars, () => generic)
        const factory = new ClassScopedFactory(self)
        const args = this._typeArgsByName
        const makeResult = ZsInterface.create(
            name,
            declarations.bind(factory, args)
        )
        const generic = ZsGeneric.create(
            makeResult,
            this._vars
        ) as ZsGeneric<any>
        return generic
    }

    Class<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: (
            this: Omit<ClassScopedFactory<ZsGenericSelfref>, "Constructor">,
            args: TypeVarRefsByName<Vars>
        ) => Iterable<Decl>
    ) {
        const self = ZsGenericSelfref.create(this._vars, () => generic)
        const factory = new ClassScopedFactory(self)
        const args = this._typeArgsByName
        const makeResult = ZsClass.create(
            name,
            declarations.bind(factory, args)
        )
        const generic = ZsGeneric.create(
            makeResult,
            this._vars
        ) as ZsGeneric<any>
        return generic
    }

    TypeAlias<Name extends string, T extends ZodTypeAny>(
        name: Name,
        definition: (
            this: { self: ZsGenericSelfref },
            args: TypeVarRefsByName<Vars>
        ) => T
    ) {
        const self = ZsGenericSelfref.create(
            this._vars,
            () => generic
        ) as ZsGenericSelfref<Vars, ZsTypeAlias>
        const args = this._typeArgsByName
        const typeAlias = ZsTypeAlias.create(
            name,
            definition.bind(
                {
                    self
                },
                args
            )
        )
        const generic = ZsGeneric.create(typeAlias, this._vars)
        return generic
    }
}

export class ModuleScopedFactory {
    forall<Names extends [string, ...string[]]>(
        ...names: Names
    ): GenericModuleScopedFactory<{
        [I in keyof Names]: ZsTypeVar<Names[I], ZodTypeAny, null>
    }> {
        return new GenericModuleScopedFactory(
            names.map(name => ZsTypeVar.create(name)) as any
        ) as any
    }
    Interface<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: (
            this: Omit<ClassScopedFactory<ZsTypeSelfref>, "Constructor">
        ) => Iterable<Decl>
    ) {
        const self = ZsTypeSelfref.create(() => result)
        const factory = new ClassScopedFactory(self)
        const result = ZsInterface.create(name, declarations.bind(factory))
        return result
    }

    Class<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: (
            this: ClassScopedFactory<ZsTypeSelfref>
        ) => Iterable<Decl>
    ) {
        const self = ZsTypeSelfref.create(() => result)
        const factory = new ClassScopedFactory(self)
        const result = ZsClass.create(name, declarations.bind(factory))
        return result
    }

    TypeAlias<Name extends string, T extends ZodTypeAny>(
        name: Name,
        type: T | (() => T)
    ) {
        const result = typeof type === "function" ? type : () => type
        return ZsTypeAlias.create(name, result)
    }

    Const(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.const, type)
    }

    Function(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.function, type)
    }

    Let(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.let, type)
    }

    Var(name: string, type: ZodTypeAny) {
        return ZsValue.create(name, ZsValueKind.var, type)
    }
}
