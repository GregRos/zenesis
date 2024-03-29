import { ZodTypeDef } from "zod"
import { ZsModuleDeclKind } from "../../core/declaration-kind"
import { ZsMonoType } from "../../core/mono-type"
import { getCombinedType } from "../../core/operators"
import { ZsTypeKind } from "../../core/type-kind"
import { ZsShapedRef } from "../../core/types"
import { ZsClassBody, ZsClassItems } from "./class-body"

export interface ZsClassDef<
    Name extends string,
    Parent extends ZsShapedRef | null,
    Body extends ZsClassBody
> extends ZodTypeDef {
    name: Name
    declName: ZsModuleDeclKind.ZsClass
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

    get actsLike() {
        return this._def.body.schema
    }

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
            declName: ZsModuleDeclKind.ZsClass,
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
    >(name: Name, body: ZsClassBody<Memberable>) {
        const result = new ZsClass({
            name,
            declName: ZsModuleDeclKind.ZsClass,
            typeName: ZsTypeKind.ZsClass,
            abstract: false,
            body,
            parent: null
        })
        return result
    }
}
