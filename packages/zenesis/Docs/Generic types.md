`zenesis` supports all generic types. This is achieved using the `forall` method found in the module scope. There is also the `zs.forall` builder, but that produces generic function types.

`zenesis` generics

- Type parameters are usually referred to by name. The name is expected to be a strongly typed string literal.
- Constraints, including ones involving other type parameters, can be placed using the `where` method.
- References to type parameters are restricted to the scopes in which they are defined. Unless you try to break things on purpose, I guess.
- TypeScript doesn’t have generic type parameters. This means that the compiler can’t check generic types in the same way it checks non-generic ones. A generic type will generally be replaced with a supertype (up to `any`) for type checking schemas.
# Declaring a generic type
Inside a module scope, `this.forall` lets you build generic declarations. These can be exported using `yield` or not, as you choose.

`forall` takes one or more strongly typed string literals, which will be used as the names of the type variables. 

After that, the `.where` method can be used to specify constraints involving the type variables you just named. 

You finish the building process with the kind of declaration you want to make. This can be either:
1. `Class`
2. `Interface`
3. `TypeAlias`

This last part works exactly like declaring a non-generic type, except that the resulting scope will be passed references to the type arguments 

```typescript
//# IN A MODULE SCOPE

// First, we specify the names as arguments to `forall`:
yield this.forall("T", "S")
	// Then constraints. You can have several `where` clauses.
	.where("T", T => T.extends(zs.number()))
	.where("S", S => S.extends(zs.string()))
    // And finally we create the declaration:
	.Interface("InterfaceName", function*({T}) {
		yield this.Property("value", T)
	})
	
```

Generic declarations don't produce types. That is, they don’t return a schema that’s a subtype of `ZodType`. Just like in TypeScript, they need to be instantiated to be used to generate other types

In order to produce an instantiation, you need to call `make`. This method takes a schema for each type parameter. This part is partially type checked against the constraints you specified, provided they weren’t too complicated.

```typescript
// Produces InterfaceName<number>
const Instantiated = GenericInterface.make(zs.number())
```

This instantiated generic type can be used anywhere a type is required. 

```typescript
import {zs} from "zenesis"
const world = zs.World()
world.addFile("my-file", function*() {
	const genericInterface = 

	yield genericInterface
})
```



![[Type expressions#Generic function]]