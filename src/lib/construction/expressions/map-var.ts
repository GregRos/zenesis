import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsTypeKind } from "../kind";

export interface ZsMapVarDef<In extends ZsMonoLike<any>> extends ZodTypeDef {
    typeName: ZsTypeKind.MapVar;
    name: string;
    in: In;
}

export class ZsMapVar<In extends ZodTypeAny> extends ZsMonoType<
    TypeOf<In>,
    ZsMapVarDef<In>
> {
    readonly actsLike = this._def.in;
    readonly declaration = "mappingVar";
    static create<In extends ZodTypeAny>(name: string, in_: In) {
        return new ZsMapVar<In>({
            typeName: ZsTypeKind.MapVar,
            name,
            in: in_
        });
    }
}
