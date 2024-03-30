import { ZodType, z } from "zod"

export function Validates<
    Def extends object,
    Shape extends {
        [K in keyof Def]: ZodType<Def[K]>
    },
    Result
>(shape: Shape) {
    const schema = z.object(shape)
    return function (constructor: { new (def: Def): Result }) {
        const validated = function (def: Def) {
            schema.parse(def)
            return new constructor(def)
        }
        Object.defineProperty(validated, "name", {
            value: constructor.name,
            writable: false
        })
        validated.prototype = constructor.prototype
        return validated as any as typeof constructor
    }
}
