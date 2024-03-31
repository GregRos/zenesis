// Conditional returns can enforce identical types.
// See here: https://github.com/Microsoft/TypeScript/issues/27024#issuecomment-421529650
// prettier-ignore
// Give "any" its own class
export class Any {
  private _!: true;
}

type TestExact<Left, Right> =
    (<U>() => U extends Left ? 1 : 0) extends <U>() => U extends Right ? 1 : 0
        ? Any
        : never

type IsAny<T> = Any extends T ? ([T] extends [Any] ? 1 : 0) : 0

export type Test<Left, Right, True> =
    IsAny<Left> extends 1
        ? IsAny<Right> extends 1
            ? True
            : "❌ Left type is 'any' but right type is not"
        : IsAny<Right> extends 1
          ? "❌ Right type is 'any' but left type is not"
          : [Left] extends [Right]
            ? [Right] extends [Left]
                ? Any extends TestExact<Left, Right>
                    ? True
                    : "❌ Unexpected or missing 'readonly' property"
                : "❌ Right type is not assignable to left type"
            : "❌ Left type is not assignable to right type"

type Assert<T, U> = U extends 1
    ? T // No error.
    : IsAny<T> extends 1
      ? never // Ensure "any" is refused.
      : U // Return the error message.

export interface Expected<T> {
    notToEqual<Exact>(
        this: Test<T, Exact, 1> extends 1
            ? "❌ Types unexpectedly equal!"
            : Expected<T>
    ): Expected<T>
    toEqual<Exact>(this: Test<T, Exact, Expected<T>>): Expected<T>
}
export function expectt<const T>(x: T): Expected<T> {
    return {
        notToEqual<Exact>(): Expected<T> {
            return this
        },
        toEqual<Exact>(): Expected<T> {
            return this
        }
    }
}

expectt("a" as "a").toEqual<"a">()
expectt("a" as "b").notToEqual<"b">()
