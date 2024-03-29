The lookup type:
```typescript
Object[Key]
```
Can be produced using `{ts}zs.lookup`. It’s even type checked.
```typescript title:"lookup.zen.ts"
import {zs} from "zenesis"
export default zs.File(function*() {
	yield this.TypeAlias(
		"ArrayMapFunction",
		zs.lookup(
			zs.unknown().array(), 
			"map"
		)
	)
})
```
```typescript title:lookup.zen.d.ts
export type ArrayMapFunction = unknown[]["map"]
```