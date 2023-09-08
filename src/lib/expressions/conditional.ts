import { ExtendsClause } from "./extends";
import { ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";

export class ZsConditional<What, Extends, Then, Otherwise> extends ZsMonoType<
    Then | Otherwise,
    ZsConditionalDef<What, Extends, Then, Otherwise>
> {
    readonly actsLike = this._def.then.or(this._def.otherwise);

    when<What2>(what2: ZsMonoLike<What2>) {
        return new ZsConditional<What2, Extends, Then, Otherwise>({
            ...this._def,
            when: what2
        });
    }

    extends<Extends2>(extends2: ZsMonoLike<Extends2>) {
        return new ZsConditional<What, Extends2, Then, Otherwise>({
            ...this._def,
            extends: extends2
        });
    }

    then<Then, Otherwise>(
        then: ZsMonoLike<Then>,
        otherwise: ZsMonoLike<Otherwise>
    ) {
        return new ZsConditional<What, Extends, Then, Otherwise>({
            ...this._def,
            then: then,
            otherwise: otherwise
        });
    }

    static create<What, Extends, IfTrue, IfFalse>() {}
}

export interface ZsConditionalDef<What, Extends, IfTrue, IfFalse>
    extends ZodTypeDef {
    typeName: "ZsConditional";
    when: ZsMonoLike<What>;
    extends: ZsMonoLike<Extends>;
    then: ZsMonoLike<IfTrue>;
    otherwise: ZsMonoLike<IfFalse>;
}
