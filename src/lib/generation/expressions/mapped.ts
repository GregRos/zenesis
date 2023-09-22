import { createHandlers, tf } from "../tf";
import { AnyKind } from "../../construction/kinds";
import { extractModifiers } from "../extract-modifiers";
import { ZsMapVar } from "../../construction/expressions/map-var";
import { TypeParameterDeclaration } from "typescript";
import { getOptional, getReadonly } from "../modifier-tokens";

export default createHandlers({
    [AnyKind.ZsMapped](node, ctx) {
        const typeVar = node.var;
        const typeParamRef = tf.createTypeReferenceNode(
            typeVar._def.name,
            undefined
        );
        const restore = ctx.scope.set(typeVar, typeParamRef);

        const constraintType = ctx.recurse(typeVar._def.in);
        const nameType = ctx.recurse(node.nameType);
        const valueType = ctx.recurse(node.value);

        restore.load();
        const typeParameter = tf.createTypeParameterDeclaration(
            undefined,
            typeVar._def.name,
            constraintType
        );
        return tf.createMappedTypeNode(
            getReadonly(node.modifiers.readonly),
            typeParameter,
            nameType,
            getOptional(node.modifiers.optional),
            valueType,
            undefined
        );
    }
});
