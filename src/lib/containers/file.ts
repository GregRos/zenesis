import { ZsExportsIterable } from "./types";
import { NamedDeclCollection } from "./collection";
import { ZsNamedDecl } from "../construction/refs";
import { ZsDeclarationSpace } from "./declarator";

export class ZsFile<Decl extends ZsNamedDecl> {
    constructor(
        readonly name: string,
        declarations: (space: ZsDeclarationSpace) => Generator<Decl>
    ) {}

    get proxy() {
        return null!;
    }
}
