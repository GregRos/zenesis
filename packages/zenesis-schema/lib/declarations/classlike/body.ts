import { lazy, seq } from "lazies"
import { ZodTypeAny, z } from "zod"
import { ZsShape } from "../../core/types"
import { ZsClass } from "./class"
import { ZsInterface } from "./interface"
import { ZsConstructor } from "./members/constructor"
import {
    ZsImplementable,
    ZsImplements,
    isImplementable
} from "./members/implements"
import { ZsIndexer } from "./members/indexer"
import { ZsProperty } from "./members/member"

export type ZsClassItems = ZsImplements | ZsProperty | ZsConstructor | ZsIndexer

export interface ZsClassBodyDef<Shape extends ZsShape> {
    definition: () => {
        shape: Shape
        schema: ZodTypeAny
        implements: ZsImplementable[]
    }
    decls: Iterable<ZsClassItems>
}

export class ZsClassBody<Decl extends ZsClassItems = ZsClassItems> {
    constructor(readonly _def: ZsClassBodyDef<getFullShape<Decl>>) {}

    get requiredDeclarations(): Iterable<
        ZsIndexer | ZsProperty | ZsConstructor
    > {
        const self = this
        return seq(function* () {
            const impls = [] as ZsImplements[]
            for (const decl of self._def.decls) {
                if (decl instanceof ZsImplements) {
                    impls.push(decl)
                } else {
                    yield decl
                }
            }
            for (const impl of impls) {
                const impld = impl._def.implemented as ZsClass | ZsInterface
                yield* impld.body.requiredDeclarations
            }
        })
    }

    get schema(): ZodTypeAny {
        return this._def.definition().schema
    }

    get shape(): getFullShape<Decl> {
        return this._def.definition().shape
    }

    get implements(): ZsImplementable[] {
        return this._def.definition().implements
    }

    get declarations() {
        return this._def.decls
    }

    static create<Decl extends ZsClassItems>(decl: () => Iterable<Decl>) {
        const input = decl()
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
                    shape[decl.name] = decl.valueType
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

export type getParentShape<Decls extends ZsClassItems> = {
    [Decl in Extract<
        Decls,
        ZsImplements
    > as ""]: Decl["_def"]["implemented"]["shape"]
}

export type getOwnShape<Decls extends ZsClassItems> = {
    [Decl in Decls as Decl extends {
        name: infer Name extends string
    }
        ? Name
        : never]: Decl extends ZsProperty<any, infer F> ? F : never
}

// TODO: Implement indexer static typing
// TODO: Consider constructor static typing
export type getFullShape<Decls extends ZsClassItems> = getOwnShape<Decls> &
    (getParentShape<Decls>[""] extends never ? {} : getParentShape<Decls>[""])

export function unpackMemberSchemas<Shape extends ZsShape>(
    shape: Shape
): UnpackMemberSchemas<Shape> {
    const newShape = {} as any
    for (const [key, value] of Object.entries(shape)) {
        newShape[key] = value
    }
    return newShape
}
export type UnpackMemberSchemas<Shape extends ZsShape> = {
    [Key in keyof Shape]: Shape[Key]
}
