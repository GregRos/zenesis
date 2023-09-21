import { ZodType, ZodTypeAny, ZodTypeDef } from "zod";
import { ZsTypeKind } from "../construction/kinds";

export class SchemaInspector<
    T extends ZodType<
        any,
        ZodTypeDef & {
            typeName: string;
        },
        any
    >
> {
    constructor(readonly schema: T) {}

    get def(): T["_def"] {
        return this.schema._def;
    }

    get typeName() {
        return this.schema._def.typeName;
    }

    get isDeclared() {
        return [
            ZsTypeKind.ZsClass,
            ZsTypeKind.ZsEnum,
            ZsTypeKind.ZsInterface,
            ZsTypeKind.ZsTypeAlias,
            ZsTypeKind.ZsTypeVar,
            ZsTypeKind.ZsMapVar,
            ZsTypeKind.ZsImportedType
        ].includes(this.typeName as any);
    }
}
