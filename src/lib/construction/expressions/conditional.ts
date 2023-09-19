import { z, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsMonoLike, ZsMonoType } from "../mono-type";
import { ZsTypeKind } from "../kinds";

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

    static create<What extends ZodTypeAny>(
        what: What
    ): ZsConditionalExtends<What> {
        return new ZsConditional({
            typeName: ZsTypeKind.ZsConditional,
            when: what,
            extends: z.never(),
            then: z.never(),
            otherwise: z.never()
        });
    }
}

export interface ZsConditionalDef<What, Extends, IfTrue, IfFalse>
    extends ZodTypeDef {
    typeName: ZsTypeKind.ZsConditional;
    when: ZsMonoLike<What>;
    extends: ZsMonoLike<Extends>;
    then: ZsMonoLike<IfTrue>;
    otherwise: ZsMonoLike<IfFalse>;
}

export interface ZsConditionalBase {
    when<What>(what: ZsMonoLike<What>): ZsConditionalExtends<What>;
}

export interface ZsConditionalExtends<What> extends ZsConditionalBase {
    extends<Extends>(
        extends_: ZsMonoLike<Extends>
    ): ZsConditionalThen<What, Extends>;
}

export interface ZsConditionalThen<What, Extends>
    extends ZsConditionalExtends<What> {
    then<Then, Otherwise>(
        then: ZsMonoLike<Then>,
        otherwise: ZsMonoLike<Otherwise>
    ): ZsConditional<What, Extends, Then, Otherwise>;
}
