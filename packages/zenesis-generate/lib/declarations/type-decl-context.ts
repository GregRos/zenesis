import {
    ZsClassBody,
    ZsDeclarationNodeTable,
    ZsImplements,
    ZsIndexer,
    ZsProperty,
    isProperty
} from "@zenesis/schema"
import { ZsClassItem } from "@zenesis/schema/lib/declarations/classlike/class"
import { seq } from "lazies"
import {
    Modifier,
    SyntaxKind,
    TypeParameterDeclaration,
    isHeritageClause,
    isMethodSignature,
    isPropertySignature
} from "typescript"
import { BaseContext } from "../common/context-base"
import { TypeExprContext } from "../expressions/type-expr-context"
import { MemberContext } from "../members/member-context"
import { NodeMap } from "../utils/node-map"
import { cases } from "./cases"

export class TypeDeclContext extends BaseContext {
    create(refs: NodeMap): this {
        return new TypeDeclContext(refs) as this
    }
    convert(
        modifiers: Modifier[],
        decl: ZsDeclarationNodeTable[keyof ZsDeclarationNodeTable],
        typeVars?: TypeParameterDeclaration[] | undefined
    ) {
        return (cases as any)[decl._def.declName].call(
            this,
            modifiers,
            decl,
            typeVars
        )
    }
    createExpressionContext() {
        return new TypeExprContext(this._refs)
    }
    createMemberContext() {
        return new MemberContext(this._refs)
    }

    *getAutoProperties(
        body: ZsImplements,
        depth = 0
    ): Iterable<ZsProperty | ZsIndexer> {
        for (const decl of body._def.implemented.body.declarations) {
            if (decl instanceof ZsProperty || decl instanceof ZsIndexer) {
                yield decl
            }
            if (decl instanceof ZsImplements) {
                yield* this.getAutoProperties(decl, depth + 1)
            }
        }
    }
    convertClassBody<T extends ZsClassItem>(body: ZsClassBody<T>) {
        const wrapped = seq(body._def.decls).cache()
        const self = this
        const memberCtx = this.createMemberContext()
        const names = wrapped
            .filterAs(isProperty)
            .map(x => x.name)
            .toSet()
            .pull()
        const converted = wrapped
            .concatMap(function* (x) {
                yield x
                if (
                    !(x instanceof ZsImplements) ||
                    x._def.kind !== "auto implement"
                ) {
                    return
                }

                for (const prop of self.getAutoProperties(x)) {
                    if (!(prop instanceof ZsProperty)) {
                        yield prop
                        continue
                    }
                    if (names.has(prop.name)) {
                        continue
                    }
                    names.add(prop.name)
                }
            })
            .map(x => memberCtx.convert(x))
            .concatMap(x => (Array.isArray(x) ? x : [x]))
            .map(x => {
                if (isMethodSignature(x) || isPropertySignature(x)) {
                    return memberCtx.convertSignatureToEmptyDeclaration(x)
                }
                return x
            })
            .orderBy(x => {
                if (isHeritageClause(x)) {
                    return x.token === SyntaxKind.ExtendsKeyword ? 0 : 1
                }
                return 2
            })
        return converted.pull()
    }
}
