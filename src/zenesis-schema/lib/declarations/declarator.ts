import { ZodTypeAny } from "zod"
import { ZsTypeAlias } from "./alias"
import { ClassDeclaration, ZsMemberable } from "./classlike/body"
import { ZsClass } from "./classlike/class"
import { ZsInterface } from "./classlike/interface"
import { ZsValue } from "./value"

export class ModuleDeclarator {
    Interface<Name extends string, Decl extends ZsMemberable>(
        name: Name,
        declarations: ClassDeclaration<Decl>
    ) {
        return ZsInterface.create(name, declarations)
    }

    Class<Name extends string, Decl extends ZsMemberable>(
        name: Name,
        declarations: ClassDeclaration<Decl>
    ) {
        return ZsClass.create(name, declarations)
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
