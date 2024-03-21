import { lazy } from "lazies"
import { ZodTypeDef } from "zod"
import { ZsTypeKind } from "../../core/kinds"
import { ZsMonoType } from "../../core/mono-type"
import { getCombinedType } from "../../core/operators"
import { ZsShapedRef } from "../../core/types"
import { ZsDeclKind } from "../kind"
import { ZsClassBody, ZsClassItems } from "./body"
import { ClassScope, ClassScopedFactory } from "./class-builder"

export interface ZsClassDef<
    Name extends string,
    Parent extends ZsShapedRef | null,
    Body extends ZsClassBody
> extends ZodTypeDef {
    name: Name
    declName: ZsDeclKind.ZsClass
    typeName: ZsTypeKind.ZsClass
    body: Body
    parent: Parent
    abstract: boolean
}

export class ZsClass<
    Name extends string = string,
    Parent extends ZsShapedRef | null = ZsShapedRef | null,
    Body extends ZsClassBody = ZsClassBody
> extends ZsMonoType<
    getCombinedType<
        Body["shape"],
        Parent extends { shape: any } ? Parent["shape"] : {}
    >,
    ZsClassDef<Name, Parent, Body>
> {
    readonly name = this._def.name
    readonly declaration = "class"
    readonly actsLike = this._def.body.schema
    readonly refAs = this
    readonly body = this._def.body
    get shape() {
        return this._def.body.shape
    }

    abstract(yes = true) {
        return new ZsClass({
            ...this._def,
            abstract: yes
        })
    }

    child<Name2 extends string, Body2 extends ZsClassBody>(
        name: Name2,
        body: Body2
    ) {
        return new ZsClass({
            name: name,
            declName: ZsDeclKind.ZsClass,
            typeName: ZsTypeKind.ZsClass,
            abstract: false,
            body: body,
            parent: this
        })
    }

    static create<
        Name extends string,
        Parent extends ZsShapedRef | null,
        Memberable extends ZsClassItems
    >(name: Name, body: ClassScope<ZsClass, Memberable>) {
        const factory = new ClassScopedFactory(lazy(() => result))
        const result = new ZsClass({
            name,
            declName: ZsDeclKind.ZsClass,
            typeName: ZsTypeKind.ZsClass,
            abstract: false,
            body: ZsClassBody.create(body),
            parent: null
        })
    }
}
