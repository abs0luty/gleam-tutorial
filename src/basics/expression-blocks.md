## Expression Blocks

```
error: Syntax error  
  ┌─ /Users/adi.salimgereyev/hello_world/src/hello_world.gleam:8:10  
  │  
8 │     let b = (1 + 2) * 3  
  │             ^ This parenthesis cannot be understood here

Hint: To group expressions in Gleam, use "{" and "}"; tuples are created with `#(` and `)`.
```

In Gleam you group expressions with `{}`. A block runs its expressions in order and evaluates to the last one. Names bound inside the block are scoped to that block. 

```gleam
pub fn area_of_square(size: Int) -> Int {
  let perimeter = {
    let doubled = size * 2
    doubled * 2
  }
  
  perimeter * size / 4
}
````

Blocks can change evaluation order. Wrap a subexpression in `{}` when you want it to run first:

```gleam
// Default precedence gives 7
let a = 1 + 2 * 3

// Run 1 + 2 first, gives 9
let b = { 1 + 2 } * 3
```
