import { Txt_Expected, Txt_IsAssignable, Txt_Target } from "./texts"
import { IsEqual, IsSubtype, IsSupertype } from "./type-relations"

export interface Expectting<Expected> {
    toEqual<Target>(
        truth: IsEqual<Expected, Target, true, false> | Was<Expected, Target>
    ): Expectting<Expected>
    toSubtype<Target>(
        truth:
            | IsSubtype<
                  Expected,
                  Target,
                  true | Txt_IsAssignable<Txt_Expected, Txt_Target>,
                  false
              >
            | Was<Expected, Target>
    ): Expectting<Expected>
    toSupertype<Target>(
        truth: IsSupertype<
            Expected,
            Target,
            true | Txt_IsAssignable<Txt_Expected, Txt_Target>,
            false
        >
    ): Expectting<Expected>
}

export abstract class Was<Left, Message, Right> {
    private _left!: Left
    private _right!: Right
    private _message!: Message
}
