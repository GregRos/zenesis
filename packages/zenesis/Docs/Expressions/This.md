The special `this` type can be produced within a class or interface scope, using the scope context `this`. It’s accessible through `this.this`. It can’t be type-checked, sadly.

Be careful when using it because it has a number of restrictions about where it can appear that can’t be enforced by Zenesis.

```typescript title:"this.zen.ts"
import {zs} from "zenesis"

export default zs.File(function*() {
	yield this.Class("ExampleClass", function*() {
		yield this.Property("self", this.this)
	})
})
```
```typescript title:"this.zen.d.ts"
export declare class ExampleClass {
	self: this
}
```

The `this` type is not valid in any other context.