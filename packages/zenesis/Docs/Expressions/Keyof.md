The `keyof` type operator can be produced using `{ts}zs.keyof`. Note that the Zod instance method `scheam.keyof` computes its result as a union type. It won’t result in the `keyof` operator appearing in the code.

```ts title:keyof.zen.ts
import {zs} from "zenesis"

export default zs.File(function*() {
	yield this.Type(
		"Example", 
		zs.keyof(
			zs.number().array()
		)
	)
})
```
```typescript title:keyof.zen.d.ts
type Example = keyof number[]