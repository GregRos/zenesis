import { ZsContainer, ZsExports } from "./container";
import { ZsExportable } from "../construction/refs";
import { z } from "zod";
import { zs } from "../construction";

export class ZsFile<
    Exports extends ZsExportable<any>
> extends ZsContainer<Exports> {}

const a = ZsFile.create(function* () {});
