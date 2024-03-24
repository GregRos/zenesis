import { ZodTypeAny } from "zod"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass } from "../declarations/classlike/class"
import { ZsClassBody, ZsClassItems } from "../declarations/classlike/class-body"
import { ClassScopeContext } from "../declarations/classlike/class-builder"
import { ZsInterface } from "../declarations/classlike/interface"
import { ZsTypeSelfref } from "../declarations/selfref"
import { ZsValue, ZsValueKind } from "../declarations/value"
import { ZsGeneric } from "../generics/generic"
import { ZsGenericSelfref } from "../generics/generic-selfref"
import { TypeVarRefsByName, getTypeArgObject } from "../generics/ref-objects"
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
            this: Omit<
                ClassScopeContext<ZsGenericSelfref<Vars>>,
                "Constructor"
            >,
            args: TypeVarRefsByName<Vars>
        ) => Iterable<Decl>
    ) {
        const self = ZsGenericSelfref.create(this._vars, () => generic)
        const factory = new ClassScopeContext(self)
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
            this: Omit<
                ClassScopeContext<ZsGenericSelfref<Vars>>,
                "Constructor"
            >,
            args: TypeVarRefsByName<Vars>
        ) => Iterable<Decl>
    ) {
        const self = ZsGenericSelfref.create(this._vars, () => generic)
        const factory = new ClassScopeContext(self)
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
            this: { self: ZsGenericSelfref<Vars> },
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
            this: Omit<ClassScopeContext<ZsTypeSelfref>, "Constructor">
        ) => Iterable<Decl>
    ) {
        const body = ZsClassBody.create(
            declarations,
            ZsTypeSelfref.create(() => result)
        ) as any
        const result = ZsInterface.create(name, body)
        return result
    }

    Class<Name extends string, Decl extends ZsClassItems>(
        name: Name,
        declarations: (
            this: ClassScopeContext<ZsTypeSelfref<ZsClass>>
        ) => Iterable<Decl>
    ) {
        const body = ZsClassBody.create(
            declarations,
            ZsTypeSelfref.create(() => result)
        ) as any
        const result = ZsClass.create(name, body)
        return result
    }

    TypeAlias<Name extends string, T extends ZodTypeAny>(
        name: Name,
        type: T | ((this: { self: ZsTypeSelfref<ZsTypeAlias> }) => T)
    ) {
        const result = typeof type === "function" ? type : () => type
        const alias = ZsTypeAlias.create(
            name,
            result.call({
                self: ZsTypeSelfref.create(() => alias)
            }) as any
        ) as any
        return alias
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
