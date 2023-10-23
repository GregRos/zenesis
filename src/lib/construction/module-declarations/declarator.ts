import { ZsInterface } from "./interface"
import { ZsTypeAlias } from "./alias"
import { ZsValue } from "./value"
import {
    ClassDeclaration,
    ZsClassDecl,
    ZsClassFragment
} from "../class-declarations/class-fragment"
import { ZodTypeAny } from "zod"
import { ZsClass } from "./class"
import { ZsShapedRef } from "../refs"

export class ZsModuleDeclarator {
    interface<Name extends string, Decl extends ZsClassDecl>(
        name: Name,
        declarations: ClassDeclaration<Decl>
    ) {
        return ZsInterface.create(name, ZsClassFragment.create(declarations))
    }

    class<
        Name extends string,
        Parent extends ZsShapedRef | null,
        Decl extends ZsClassDecl
    >(name: Name, parent: Parent, declarations: ClassDeclaration<Decl>) {
        return ZsClass.create(
            name,
            parent,
            ZsClassFragment.create(declarations)
        )
    }

    alias<Name extends string, T extends ZodTypeAny>(name: Name, type: T) {
        return ZsTypeAlias.create(name, type)
    }

    const(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).const(type)
    }

    function(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).function(type)
    }

    let(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).let(type)
    }

    var(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).var(type)
    }
}
