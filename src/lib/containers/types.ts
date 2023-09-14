import { ZsExportable } from "../construction/refs";

export type getExportName<Export extends ZsExportable<string>> = Export["name"];

export interface ZsExportsIterable<Exports extends ZsExportable<string>>
    extends Iterable<Exports> {}

export type ExportsRecord<Exports extends ZsExportable<string>> = {
    [Export in Exports as getExportName<Export>]: Export;
};
