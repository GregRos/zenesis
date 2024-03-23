A type expression is a syntax element such as `{a: 1}` that may appear as a type annotation. They usually describe the structure of a type or construct a type using operators.

Almost all type expressions are provided by `zod`. `zenesis` adds a few type expressions that `zod` doesn’t cover.

## Conditional Types
You can construct a conditional type using the `zs.if` builder. 
```typescript
// Producing the type:
//     Subject extends Extends ? TrueType : FalseType

// The subject of the condition:
zs.if(Subject)
  // The type to compare it to:
  .extends(Extends)
  // The true branch:
  .then(TrueType)
  // The false branch:
  .else(FalseType)
```

Conditional type nodes can’t be validated by the TypeScript compiler. It will instead see them as nodes with the supertype `TrueType | FalseType`. 

⛔ **Inferred conditional types are currently not supported.** ⛔
They will most likely be added at a later date when I figure out what to do with them.

## Keyof
You can construct a `keyof Expr` type using:

```typescript
// Producing the type:
//    keyof Subject
zs.keyof(Subject)
```

Note that this is different from the `.keyof` method available on `ZodObject` and similar schemas, which compute applying `keyof` into a union type. They won’t produce the `keyof` type itself.

## This type
The special `this` type can be produced within the scope of a class an interface using `this.this`. However, it can’t be strongly typed due to the limitations of recursive inference.

```typescript
// Producing the declaration:
//    interface ThisExample {
//       example: this
//    } 
file.Interface("ThisExample", function*() {
	yield this.Property("example", this.this)
})
```

The `this` type is not valid in any other context.

## Lookup type
The lookup type `Obj[Key]` can be produced using `zs.lookup`:
```typescript
// Producing the type:
//   Subject[Key]
zs.lookup(Subject, Key)
```

## Generic function
`zenesis` lets you produce nodes representing generic function types. Like all generic nodes, they can’t be strongly typed due to language limitations.

This works using the [[forall]] syntax used for types, except that it’s based in the `zs` namespace. You first define the type variables and their constraints. Then you use the `define` method. 

You give it a callback. This is the special subscope in which you can use the type variables you just defined. The only thing that you can do is return a `zenesis` function type.

```typescript
// Producing the type:
//     <T, S>(t: T, s: S) => number

// Specifies the type variable(s)
zs.forall("T", "S") 

  // Where clause to specify an optional constraint
  .where("T", T => T.extends(zs.string()))

  // The define clause allows references to type variables:
  .define((T, S) => {
	  // Now, we need to return a function type.
	  return zs.fun(T, S).returns(zs.number())
   })
```

Generic function types can be used anywhere other function types can be used. If they are used within a method definition they will generate generic methods.

```typescript
// Producing the declaration:
//
//   interface GenericExample {
//     example<T>(arg0: T): number
//   }
//
file.Interface("GenericExample", function*() {
	const genericFunction = zs.forall("T").define(T => {
		return zs.fun(T).returns(zs.number())
	})
	yield this.Method("example", genericFunction)
})
```
## Mapped types
To produce a mapped type, use `zs.map`. Since mapped types have multiple components, it’s a bit complicated.
```typescript
// Producing the type:
//   { [X in Subject as X["name"]]: X[] }

// First, the name of the mapping variable.
zs.map("X")

	// Then the container type
	.in(Subject)
	
	// The `as` part that transforms the key.
	// We have a reference to the mapping variable.
	// This can be optional, depending on the type of `Subject`.
	.as(X => {
		// This is result type of the key.
		// Let's map it to X["name"]
		return zs.lookup(X, "name")
	})
	
	// And finally the value.
	.to(X => {
		return X.array()
	})

```