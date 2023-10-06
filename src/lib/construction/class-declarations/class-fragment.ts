import { lazy, seq } from "lazies"
import { isImplementable, ZsImplementable, ZsImplements } from "./implements"
import { ZsClassMember } from "./field"
import { unpackMemberSchemas, ZsShape } from "../expressions/overloads"
import { z, ZodTypeAny } from "zod"
import { ClassDeclarator } from "./declarator"

export type ZsClassDecl = ZsImplements | ZsClassMember

export interface ZsClassFragmentDef<Shape extends ZsShape> {
    definition: () => {
        shape: Shape
        schema: ZodTypeAny
        implements: ZsImplementable[]
    }
    decls: Iterable<ZsClassDecl>
}

export type ClassDeclaration<Decl extends ZsClassDecl> = (
    declarator: ClassDeclarator
) => Iterable<Decl>

export class ZsClassFragment<Decl extends ZsClassDecl = ZsClassDecl> {
    constructor(readonly _def: ZsClassFragmentDef<getFullShape<Decl>>) {}

    get schema(): ZodTypeAny {
        return this._def.definition().schema
    }

    get shape(): getFullShape<Decl> {
        return this._def.definition().shape
    }

    get implements(): ZsImplementable[] {
        return this._def.definition().implements
    }

    [Symbol.iterator]() {
        return this._def.decls[Symbol.iterator]()
    }

    static create<Decl extends ZsClassDecl>(decl: ClassDeclaration<Decl>) {
        const input = decl(new ClassDeclarator())
        const decls = seq(input).cache()
        return new ZsClassFragment({
            definition: lazy(() => {
                const shape: getFullShape<any> = {} as any

                for (const decl of decls.ofTypes(ZsClassMember)) {
                    if (decl.name in shape) {
                        throw new Error(
                            `Duplicate field name ${decl.name} in class`
                        )
                    }
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
            }).pull,
            decls
        })
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
        : never]: Decl extends ZsClassMember<any, infer F> ? F : never
}

export type getFullShape<Decls extends ZsClassDecl> = getOwnShape<Decls> &
    getParentShape<Decls>
