import { ZsNamedDecl } from "../construction/refs";

export type getExportName<Export extends ZsNamedDecl> = Export["name"];

export interface ZsExportsIterable<Exports extends ZsNamedDecl>
    extends Iterable<Exports> {}

export type ExportsRecord<Exports extends ZsNamedDecl> = {
    [Export in Exports as getExportName<Export>]: Export;
};
