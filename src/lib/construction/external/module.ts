import { ZodType, ZodTypeAny } from "zod";
import { ZsGenericType } from "../generic/generic-type";
import { ImportBuilder, ZsImportedType } from "./import";
import { ZsImportedGeneric } from "./imported-generic";

export class ZsExporter {
    import(name: string): ImportBuilder {
        return {
            typed: <As extends ZsGenericType | ZodTypeAny>(typed: As): any => {
                if (typed instanceof ZodType) {
                    return ZsImportedType.create(this, name, () => typed);
                } else if (typed instanceof ZsGenericType) {
                    return ZsImportedGeneric.create(this, name, () => typed);
                } else {
                    throw new Error("Invalid import type");
                }
            }
        };
    }
}

export class ZsExternalModule extends ZsExporter {
    constructor(public path: string) {
        super();
    }
}
