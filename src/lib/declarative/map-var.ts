import { ZsDeclaredDef } from "./general";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { TypeOf, ZodTypeAny } from "zod";

export interface VsMapVarDef<In extends ZsMonoLike<any>> extends ZsDeclaredDef {
    typeName: "VsKeyVar";
    name: string;
    in: In;
}

export class VsMapVar<In extends ZodTypeAny> extends ZsMonoType<
    TypeOf<In>,
    VsMapVarDef<In>
> {
    readonly actsLike = this._def.in;
    readonly declaration = "mappingVar";
    static create<In extends ZodTypeAny>(name: string, in_: In) {
        return new VsMapVar<In>({
            typeName: "VsKeyVar",
            name,
            in: in_
        });
    }
}
