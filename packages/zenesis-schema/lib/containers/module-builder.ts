import { ZodTypeAny } from "zod"
import { ZsTypeAlias } from "../declarations/alias"
import { ZsClass, ZsClassItem } from "../declarations/classlike/class"
import { ZsClassBody } from "../declarations/classlike/class-body"
import {
    ClassContext,
    InterfaceContext
} from "../declarations/classlike/class-builder"
import {
    ZsInterface,
    ZsInterfaceItem
} from "../declarations/classlike/interface"
import {
    ZsGenericSelfref,
    createGenericSelfref
} from "../declarations/generic-selfref"
import { ZsTypeSelfref, createSelfref } from "../declarations/selfref"
import { ZsValue, ZsValueKind } from "../declarations/value"
import { ZsGeneric } from "../generics/generic"
import { TypeVarRefsByName, getTypeArgObject } from "../generics/ref-objects"
import { ZsTypeVar, ZsTypeVars } from "../generics/type-var"

export class GenericModuleScopedFactory<Vars extends ZsTypeVars> {
    constructor(readonly _vars: Vars) {}

    private get _typeArgsByName() {
        return getTypeArgObject(this._vars.map(x => x.ref) as any)
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

    Interface<Name extends string, Decl extends ZsInterfaceItem>(
        name: Name,
        declarations: (
            this: InterfaceContext<ZsGenericSelfref<ZsInterface, Vars>>,
            args: TypeVarRefsByName<Vars>
        ) => Iterable<Decl>
    ) {
        const self = createGenericSelfref<ZsInterface, Vars>({
            deref: () => generic,
            name: name,
            text: name,
            vars: this._vars
        }) as ZsGenericSelfref<ZsInterface, Vars>
        const factory = new InterfaceContext(self)
        const args = this._typeArgsByName
        const makeResult = ZsInterface.create(
            name,
            declarations.bind(factory, args)
        )
        const generic = ZsGeneric.create(makeResult, this._vars)
        return generic
    }

    Class<Name extends string, Decl extends ZsClassItem>(
        name: Name,
        declarations: (
            this: ClassContext<ZsGenericSelfref<ZsClass, Vars>>,
            args: TypeVarRefsByName<Vars>
        ) => Iterable<Decl>
    ) {
        const self = createGenericSelfref({
            deref: () => generic,
            name: name,
            text: name,
            vars: this._vars
        }) as ZsGenericSelfref<ZsClass, Vars>
        const factory = new ClassContext(self)
        const args = this._typeArgsByName
        const makeResult = ZsClass.create(
            name,
            ZsClassBody.create(declarations.bind(factory, args), self)
        )
        const generic = ZsGeneric.create(makeResult, this._vars)
        return generic
    }

    TypeAlias<Name extends string, T extends ZodTypeAny>(
        name: Name,
        definition: (
            this: { self: ZsGenericSelfref<ZsTypeAlias, Vars> },
            args: TypeVarRefsByName<Vars>
        ) => T
    ) {
        const self = createGenericSelfref({
            deref: () => generic,
            name: name,
            text: name,
            vars: this._vars
        }) as ZsGenericSelfref<ZsTypeAlias, Vars>
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
    Interface<Name extends string, Decl extends ZsClassItem>(
        name: Name,
        declarations: (
            this: InterfaceContext<ZsTypeSelfref<ZsInterface>>
        ) => Iterable<Decl>
    ) {
        const selfref = createSelfref({
            deref: () => result,
            name: name,
            text: name
        })
        const body = ZsClassBody.create(
            declarations.bind(new InterfaceContext(selfref)),
            selfref
        ) as any
        const result = ZsInterface.create(name, body)
        return result
    }

    Class<Name extends string, Decl extends ZsClassItem>(
        name: Name,
        declarations: (
            this: ClassContext<ZsTypeSelfref<ZsClass>>
        ) => Iterable<Decl>
    ) {
        const selfref = createSelfref({
            deref: () => result,
            name: name,
            text: name
        }) as ZsTypeSelfref<ZsClass>
        const body = ZsClassBody.create(declarations, selfref)
        const result = ZsClass.create(name, body)
        return result
    }

    TypeAlias<Name extends string, T extends ZodTypeAny>(
        name: Name,
        type: T | ((this: { self: ZsTypeSelfref<ZsTypeAlias> }) => T)
    ) {
        const result = typeof type === "function" ? type : () => type
        const selfref = createSelfref({
            deref: () => alias,
            name: name,
            text: name
        }) as ZsTypeSelfref<ZsTypeAlias>
        const alias = ZsTypeAlias.create(
            name,
            result.bind({
                self: selfref
            })
        )
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
