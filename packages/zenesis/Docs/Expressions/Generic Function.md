Generic function types can be produced using the `zs.forall` builder. It’s a multi-stage process that’s similar to [[Generic types]].

The structure is kind of similar to `C++` templates or Haskell’s `forall` syntax, which it’s inspired by. You first define the type variables and then use them to construct the function.

```typescript title:"Generic function"
import {zs} from "zenesis"
// First we specify the names of the type variables.
zs.forall("A", "B")
// We open a subscope using `define`.
  .define(({A, B}) => {
    // The subscope needs to return a zenesis function type.
    // It accepts an object with references to the type arguments.
	return zs.fun(
	    A, B
	).returns(
	    zs.number()
	)
})
```

This works using the [[forall]] syntax used for types, except that it’s based in the `zs` namespace. You first define the type variables and their constraints. Then you use the `define` method. 

You give it a callback. This is the special subscope in which you can use the type variables you just defined. The only thing that you can do is return a `zenesis` function type.