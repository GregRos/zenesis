import { Expectting } from "./expecting"
import {
    Txt_AreEqual,
    Txt_Expected,
    Txt_IsAssignable,
    Txt_Target
} from "./texts"
import { IsEqual, IsSubtype, IsSuper } from "./type-relations"

export interface NotExpecting<Expected> {
    toEqual<Target>(
        this: IsEqual<Expected, Target, 1> extends 1
            ? Txt_AreEqual<Txt_Expected, Txt_Target>
            : NotExpecting<Expected>
    ): NotExpecting<Expected>
    toSubtype<Target>(
        this: IsSubtype<Expected, Target, 1> extends 1
            ? Txt_IsAssignable<Txt_Expected, Txt_Target>
            : NotExpecting<Expected>
    ): NotExpecting<Expected>
    toSupertype<Target>(
        this: IsSuper<Expected, Target, 1> extends 1
            ? Txt_IsAssignable<Txt_Target, Txt_Expected>
            : NotExpecting<Expected>
    ): NotExpecting<Expected>
    readonly not: Expectting<Expected>
}
