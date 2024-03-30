import { ZodTypeDef } from "zod"
import { ZsModuleDeclKind } from "../../core/declaration-kind"
import { ZsMonoType } from "../../core/mono-type"
import { getCombinedType } from "../../core/operators"
import { ZsTypeKind } from "../../core/type-kind"
import { ZsImplements } from "../../members/implements"
import { ZsIndexer } from "../../members/indexer"
import { ZsProperty } from "../../members/property"
import { ZsClassBody } from "./class-body"

export interface ZsInterfaceDef<Name extends string, Body extends ZsClassBody>
    extends ZodTypeDef {
    name: Name
    declName: ZsModuleDeclKind.ZsInterface
    typeName: ZsTypeKind.ZsInterface
    body: Body
}
export type ZsInterfaceItem = ZsImplements | ZsProperty | ZsIndexer

export class ZsInterface<
    Name extends string = string,
    Body extends ZsClassBody<ZsInterfaceItem> = ZsClassBody<ZsInterfaceItem>
> extends ZsMonoType<
    getCombinedType<Body["shape"]>,
    ZsInterfaceDef<Name, Body>
> {
    readonly declaration = "interface"
    readonly name = this._def.name
    readonly refAs = this
    readonly body = this._def.body
    get actsLike() {
        return this._def.body.schema
    }

    get shape() {
        return this._def.body.shape
    }

    static create<Name extends string, Memberable extends ZsInterfaceItem>(
        name: Name,
        body: ZsClassBody
    ) {
        const result = new ZsInterface({
            name,
            declName: ZsModuleDeclKind.ZsInterface,
            typeName: ZsTypeKind.ZsInterface,
            body
        })
        return result
    }
}
