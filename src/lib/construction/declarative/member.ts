import { TypeOf, ZodTypeAny, ZodTypeDef } from "zod";
import { Access, ZsFunctionTypeAny } from "../utils";
import { ZsOverloads } from "../expressions/overloads";
import { ZsMonoType } from "../mono-type";
import { ZsNodeKind } from "../kind";

export type MemberStyle = "field" | "method";

export interface ZsMemberDef<Annotation extends ZodTypeAny, A extends Access>
    extends ZodTypeDef {
    typeName: ZsNodeKind.Member;
    annotation: Annotation;
    readonly: boolean;
    optional: boolean;
    access: A;
    style: MemberStyle;
}

export type ZsMemberAny<A extends Access = any> = ZsMember<ZodTypeAny, A>;

export class ZsMember<Annotation extends ZodTypeAny, A extends Access> {
    get _access() {
        return this._def.access;
    }

    get actsLike(): Annotation {
        return this._def.annotation;
    }

    constructor(readonly _def: ZsMemberDef<Annotation, A>) {}
    static field<Annotation extends ZodTypeAny>(annotation: Annotation) {
        return ZsMember.create("field", annotation);
    }

    static create<Annotation extends ZodTypeAny>(
        style: MemberStyle,
        annotation: Annotation
    ) {
        return new ZsMember({
            typeName: ZsNodeKind.Member,
            annotation,
            readonly: false,
            optional: false,
            access: "public",
            style
        });
    }

    static method<Annotation extends ZsFunctionTypeAny>(
        annotation: Annotation
    ): ZsMember<Annotation, "public">;
    static method<
        Annotations extends [
            ZsFunctionTypeAny,
            ZsFunctionTypeAny,
            ...ZsFunctionTypeAny[]
        ]
    >(...members: Annotations): ZsMember<ZsOverloads<Annotations>, "public">;
    static method(...members: [any, ...any[]]): any {
        return ZsMember.create("method", ZsOverloads.create(members));
    }

    readonly(yes = true) {
        return new ZsMember({
            ...this._def,
            readonly: yes
        });
    }

    optional(yes = true) {
        return new ZsMember({
            ...this._def,
            optional: yes
        });
    }

    access<V extends Access>(access: V) {
        return new ZsMember({
            ...this._def,
            access: access
        });
    }
}
