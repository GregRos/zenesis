import { ZsInterface } from "./interface";
import { ZsTypeAlias } from "./alias";
import { ZsValue } from "./value";
import { ClassDeclarator } from "../class-declarations/declarator";
import {
    ClassDeclaration,
    ZsClassDecl,
    ZsClassFragment
} from "../class-declarations/class-fragment";
import { ZodTypeAny } from "zod";
import { ZsClass } from "./class";

export class ZsModuleDeclarator {
    interface<Name extends string, Decl extends ZsClassDecl>(
        name: Name,
        declarations: ClassDeclaration<Decl>
    ) {
        return ZsInterface.create(name, ZsClassFragment.create(declarations));
    }

    class<Name extends string, Decl extends ZsClassDecl>(
        name: Name,
        declarations: ClassDeclaration<Decl>
    ) {
        return ZsClass.create(name, ZsClassFragment.create(declarations));
    }

    alias<Name extends string, T extends ZodTypeAny>(name: Name, type: T) {
        return ZsTypeAlias.create(name, type);
    }

    const(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).const(type);
    }

    function(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).function(type);
    }

    let(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).let(type);
    }

    var(name: string, type: ZodTypeAny) {
        return ZsValue.create(name).var(type);
    }
}
