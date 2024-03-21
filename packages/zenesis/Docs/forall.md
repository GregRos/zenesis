The `forall` [[builder]] is used to generate generic types, including generic function types. 

The keyword itself is taken from [Haskell](https://ghc.gitlab.haskell.org/ghc/doc/users_guide/exts/explicit_forall.html) where it’s used for a similar purpose.
# Idea
`forall` lets you define a bunch of type variables and then use them in a sub scope to 
# Usage
Let’s look at how we can generate the type:
```typescript
declare class Box<T> {
	value: T
}
```

```typescript
import {zs} from "zenesis"
const W = World("box-world")

W.addFile("example", function*(_) {
	yield _.forall("T").Class(function*(_){
	}
	yield* zs.forall("T").define(function*(T) {
	
		yield _.Class("Box", function*(_) {
			yield _.Field("value", T)
		})
	})
})
```