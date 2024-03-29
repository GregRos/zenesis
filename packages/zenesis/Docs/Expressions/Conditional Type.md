Conditional types are constructed using `{ts}zs.if`. The function returns a multi-stage builder that lets you fill in the components one at a time using a fluent interface.
# Structure
Let’s look at an example of a conditional type.
```typescript title:"A conditional type"
Subject extends Object ? IfTrue : IfFalse
```

A conditional type has four components:
1. A `Subject` type to be compared
2. An `Object` type which is the subject of the comparison
3. An `IfTrue` type for the true branch.
4. An `IfFalse` type for the false branch.
# Construction
The best way to describe the process is using an example:
```typescript title:"Constructing a conditional type"
// 1. We call the builder with the Subject
zs.if(
	Subject

// 2. We call `extends` with a function that computes the Object.
).extends(
	() => Object

// 3. We call `then` with a function that computes the IfTrue branch.
).then(
	() => IfTrue

// 4. And finally supply the IfFalse branch directly as a schema.
).else(
	IfFalse
	
)
```

The `extends` and `then` branches are *scopes*. Right now they have no additional functionality, but in the future these scopes will implement inferred types.
# Example
Here is a complete, semi-realistic example.

```typescript title:if.zen.ts
import {zs} from "zenesis"

export default zs.File(function*() {

	yield this.forall("T").Type("IsNumber", T => {
		return zs.if(T)
			     .extends(() => zs.number())
			     .then(() => zs.true()) 
			     .else(zs.false())
	})
})
```
```typescript title:if.zen.d.ts
export type IsNumber<T> = T extends number ? true : false
```
# Inferred types
> [!warning]
> Inferred types are not supported yet. 😔

Here is how using inferred types will look in the future:

```typescript title:"Inferred types sketch"
//! NOT SUPPORTED YET !
// We start the same way as regular conditional types:
zs.if(T)

  // Inferred types can be added using an `infer` method on the 
  // scope context. They are collected and encoded into the
  // return type of `extends`.
  .extends(s => s.infer("X").array())
   
  // The `then` builder can access them as properties.
  .then(s => s.X)

  // The `else` builder can't access them, so it's not a functio
  .else(zs.never())
```
```typescript title:Result
T extends (infer X)[] ? X : never
```

The idea is to collect all the inferred types and encode them into the return type of `extends`, and then make them available as keys in the `then` clause.
