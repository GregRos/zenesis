import { memoize, seq } from "lazies"
import { ZodTypeAny, z } from "zod"
import { foreignShape } from "../../containers/foreign-import"
import { ZsShape } from "../../core/types"
import { ZsImplements } from "../../members/implements"
import { ZsProperty } from "../../members/property"
import { ZsClassTypeLike, ZsImplementable } from "../../utils/unions"
import { isImplements } from "../../utils/validate/is-member"
import { ZsClassItem } from "./class"

export interface ZsClassBodyDef<Shape extends ZsShape> {
    definition: () => {
        shape: Shape
        schema: ZodTypeAny
        implements: ZsImplementable[]
    }
    decls: Iterable<ZsClassItem>
}

export class ZsClassBody<Decl extends ZsClassItem = ZsClassItem> {
    constructor(readonly _def: ZsClassBodyDef<getFullShape<Decl>>) {}

    get schema(): ZodTypeAny {
        return this._def.definition().schema
    }

    add(decl: ZsClassItem) {
        return new ZsClassBody({
            ...this._def,
            decls: [...this._def.decls, decl]
        })
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

    static create<Decl extends ZsClassItem, Self extends ZsClassTypeLike>(
        decl: () => Iterable<Decl>,
        futureSelf: Self
    ) {
        const decls = seq(decl).cache()
        return new ZsClassBody<Decl>({
            definition: memoize(() => {
                const shape: getFullShape<any> = {} as any

                for (const decl of decls.ofTypes(ZsProperty)) {
                    if (decl.name in shape) {
                        throw new Error(
                            `Duplicate field name ${decl.name} in class`
                        )
                    }
                    shape[decl.name] = decl.valueType
                }
                const parents = decls
                    .filterAs(isImplements)
                    .map(x => x._def.implemented as ZsImplementable)
                    .toArray()
                    .pull()
                for (const p of parents) {
                    Object.assign(shape, p.shape)
                }
                const partial = {
                    shape,
                    implements: parents
                }
                if (foreignShape in shape) {
                    return {
                        ...partial,
                        schema: z
                            .object(unpackMemberSchemas(shape))
                            .passthrough()
                    }
                } else {
                    return {
                        ...partial,
                        schema: z.object(unpackMemberSchemas(shape))
                    }
                }
            }),
            decls
        })
    }
}

export type getParentShape<Decls extends ZsClassItem> = {
    [Decl in Extract<
        Decls,
        ZsImplements
    > as ""]: Decl["_def"]["implemented"]["shape"]
}

export type getOwnShape<Decls extends ZsClassItem> = {
    [Decl in Decls as Decl extends {
        name: infer Name extends string
    }
        ? Name
        : never]: Decl extends ZsProperty<any, infer F> ? F : never
}

// TODO: Implement indexer static typing
// TODO: Consider constructor static typing
export type getFullShape<Decls extends ZsClassItem> = getOwnShape<Decls> &
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
