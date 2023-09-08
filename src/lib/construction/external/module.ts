import { ZodType } from "zod";
import { Generic } from "../declarative/generic/generic-type";
import { ImportBuilder, ZsImportedGeneric, ZsImportedType } from "./import";

export class ZsExporter {
    import(name: string): ImportBuilder {
        return {
            as: <As>(as: As): any => {
                if (as instanceof ZodType) {
                    return ZsImportedType.create(this, name, as);
                } else if (as instanceof Generic) {
                    return ZsImportedGeneric.create(this, name, as);
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
