import { ZsExportable } from "../construction/refs";
import {
    ZsEmptyInterface,
    ZsInterface
} from "../construction/declarative/interface";
import { ZsTypeAlias } from "../construction/declarative/alias";
import { ZsValue } from "../construction/declarative/value";

export class ZsDeclarationSpace {
    interface<Name extends string>(name: Name) {
        return ZsInterface.create(name);
    }

    class<Name extends string>(name: Name) {
        return ZsInterface.create(name);
    }

    alias<Name extends string>(name: Name) {
        return ZsTypeAlias.create(name);
    }

    value(name: string) {
        return ZsValue.create(name) as ZsValue<never>;
    }
}
