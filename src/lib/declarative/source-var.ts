import { ZsDeclaredDef, ZsDeclaredType } from "./general";
import { ZsMonoLike } from "../mono-type";

export interface VsKeyVarDef<In, As extends PropertyKey> extends ZsDeclaredDef {
    typeName: "VsKeyVar";
    name: string;
    in: ZsMonoLike<In>;
    as: ZsMonoLike<As>;
}

export class VsMapVar<In, As extends PropertyKey> extends ZsDeclaredType<
    In,
    VsKeyVarDef<In, As>
> {
    readonly actsLike = this._def.in;

    in<In2>(in2: ZsMonoLike<In2>) {
        return new VsMapVar<In2, As>({
            ...this._def,
            in: in2
        });
    }

    as<As2 extends PropertyKey>(as2: ZsMonoLike<As2>) {
        return new VsMapVar<In, As2>({
            ...this._def,
            as: as2
        });
    }

    readonly declaration = "mappingVar";
}
