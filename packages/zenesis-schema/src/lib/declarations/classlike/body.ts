import { lazy, seq } from "lazies"
import { ZodTypeAny, z } from "zod"
import { ZsShape } from "../../core/types"
import { ClassDeclarator } from "./declarator"
import { ZsConstructor } from "./members/constructor"
import {
    ZsImplementable,
    ZsImplements,
    isImplementable
} from "./members/implements"
import { ZsIndexer } from "./members/indexer"
import { ZsMember as ZsProperty } from "./members/member"
import { unpackMemberSchemas } from "./members/overloads"

export type ZsMemberable = ZsImplements | ZsProperty | ZsConstructor | ZsIndexer

export interface ZsClassBodyDef<Shape extends ZsShape> {
    definition: () => {
        shape: Shape
        schema: ZodTypeAny
        implements: ZsImplementable[]
    }
    decls: Iterable<ZsMemberable>
}

export type ClassDeclaration<Decl extends ZsMemberable> = (
    declarator: ClassDeclarator
) => Iterable<Decl>

export class ZsClassBody<Decl extends ZsMemberable = ZsMemberable> {
    constructor(readonly _def: ZsClassBodyDef<getFullShape<Decl>>) {}

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

    static create<Decl extends ZsMemberable>(decl: ClassDeclaration<Decl>) {
        const input = decl(new ClassDeclarator())
        const decls = seq(seq(input).toArray().pull())
        return new ZsClassBody<Decl>({
            definition: lazy(() => {
                const shape: getFullShape<any> = {} as any

                for (const decl of decls.ofTypes(ZsProperty)) {
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

export type getParentShape<Decls extends ZsMemberable> = {
    [Decl in Extract<
        Decls,
        ZsImplements
    > as ""]: Decl["_def"]["implemented"]["shape"]
}

export type getOwnShape<Decls extends ZsMemberable> = {
    [Decl in Decls as Decl extends {
        name: infer Name extends string
    }
        ? Name
        : never]: Decl extends ZsProperty<any, infer F> ? F : never
}

// TODO: Implement indexer static typing
// TODO: Consider constructor static typing
export type getFullShape<Decls extends ZsMemberable> = getOwnShape<Decls> &
    (getParentShape<Decls>[""] extends never ? {} : getParentShape<Decls>[""])
