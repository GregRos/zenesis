import { lazy, Lazy, seq } from "lazies"
import { isImplementable, ZsImplementable, ZsImplements } from "./implements"
import { ZsClassMethod } from "./method"
import { ZsClassField } from "./field"
import { unpackMemberSchemas, ZsShape } from "../expressions/overloads"
import { z, ZodTypeAny } from "zod"
import { ClassDeclarator } from "./declarator"

export type ZsClassDecl = ZsClassMethod | ZsImplements | ZsClassField

export interface ZsClassFragmentDef<Shape extends ZsShape> {
    shape: Shape
    schema: ZodTypeAny
    implements: ZsImplementable[]
}

export type ClassDeclaration<Decl extends ZsClassDecl> = (
    declarator: ClassDeclarator
) => Iterable<Decl>

export class ZsClassFragment<Decl extends ZsClassDecl = ZsClassDecl> {
    private _schema: Lazy<ZsClassFragmentDef<getFullShape<Decl>>>

    constructor(input: Iterable<Decl>) {
        const decls = seq(input).cache()
        this._schema = lazy(() => {
            const shape: getFullShape<any> = {} as any

            for (const decl of decls.ofTypes(ZsClassField, ZsClassMethod)) {
                shape[decl.name] = decl.schema
            }
            const parents = decls.filterAs(isImplementable).toArray().pull()
            for (const decl of parents) {
                Object.assign(shape, decl.shape)
            }
            return {
                shape,
                implements: parents,
                schema: z.object(unpackMemberSchemas(shape))
            }
        })
    }

    get schema(): ZodTypeAny {
        return this._schema.pull().schema
    }

    get shape(): getFullShape<Decl> {
        return this._schema.pull().shape
    }

    get implements(): ZsImplementable[] {
        return this._schema.pull().implements
    }

    [Symbol.iterator]() {
        return this._decls[Symbol.iterator]()
    }

    static create<Decl extends ZsClassDecl>(decl: ClassDeclaration<Decl>) {
        return new ZsClassFragment(decl(new ClassDeclarator()))
    }
}

export type getParentShape<Decls extends ZsClassDecl> = {
    [Decl in Extract<
        Decls,
        ZsImplements
    > as ""]: Decl["_def"]["interface"]["shape"]
}

export type getOwnShape<Decls extends ZsClassDecl> = {
    [Decl in Decls as Decl extends {
        name: infer Name extends string
    }
        ? Name
        : never]: Decl extends ZsClassMethod<any, infer F>
        ? F
        : Decl extends ZsClassField<any, infer F>
        ? F
        : never
}

export type getFullShape<Decls extends ZsClassDecl> = getOwnShape<Decls> &
    getParentShape<Decls>
