import { ZsExportable } from "../construction/refs";
import { ZsFile } from "./file";

export class ZsUniverse {
    file<Exports extends ZsExportable<any>>(init: () => Iterable<Exports>) {
        return new ZsFile(init());
    }
}
