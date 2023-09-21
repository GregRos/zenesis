import { factory } from "typescript";
import { AnyTypeSchema } from "../construction/schemas";
import { createHandlersFactory } from "../zod-walker/walker";

export { factory as tf };

export const createHandlers = createHandlersFactory<AnyTypeSchema>();
