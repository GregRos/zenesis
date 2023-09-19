import { lazy, Lazy, Seq, seq, SeqLike } from "lazies";
import { ZsTypedDecl } from "../refs";
import { isImplementable, ZsImplementable, ZsImplements } from "./implements";
import { ZsClassMethod } from "./method";
import { ZsClassField } from "./field";
import { unpackMemberSchemas, ZsShape } from "../expressions/overloads";
import { z, ZodTypeAny } from "zod";

export type ZsClassDecl = ZsClassMethod | ZsImplements | ZsClassField;

export interface ZsFragmentSchema<Shape extends ZsShape> {
    shape: Shape;
    schema: ZodTypeAny;
    implements: ZsImplementable[];
}

export class ZsClassFragment<Decl extends ZsClassDecl = ZsClassDecl> {
    private _decls: Seq<Decl>;
    private _schema: Lazy<ZsFragmentSchema<getFullShape<Decl>>>;

    constructor(input: SeqLike<Decl>) {
        this._decls = seq(input).cache();
        this._schema = lazy(() => {
            const shape: getFullShape<any> = {} as any;
            for (const decl of this._decls.ofTypes(
                ZsClassField,
                ZsClassMethod
            )) {
                shape[decl.name] = decl.schema;
            }
            const parents = this._decls
                .filterAs(isImplementable)
                .toArray()
                .pull();
            for (const decl of parents) {
                Object.assign(shape, decl.shape);
            }
            return {
                shape,
                implements: parents,
                schema: z.object(unpackMemberSchemas(shape))
            };
        });
    }

    get schema(): ZodTypeAny {
        return this._schema.pull().schema;
    }

    get shape(): getFullShape<Decl> {
        return this._schema.pull().shape;
    }

    get implements(): ZsImplementable[] {
        return this._schema.pull().implements;
    }
}

export type getParentShape<Decls extends ZsClassDecl> = {
    [Decl in Extract<
        Decls,
        ZsImplements
    > as ""]: Decl["_def"]["interface"]["shape"];
};

export type getOwnShape<Decls extends ZsTypedDecl> = {
    [Decl in Decls as Decl extends {
        name: infer Name extends string;
    }
        ? Name
        : never]: Decl extends ZsClassMethod<any, infer F>
        ? F
        : Decl extends ZsClassField<any, infer F>
        ? F
        : never;
};

export type getFullShape<Decls extends ZsClassDecl> = getOwnShape<Decls> &
    getParentShape<Decls>;
