## Functions

In Gleam, the `fn` keyword defines a function. Like blocks, the body is a series of expressions evaluated top-to-bottom, and **the last expression's value is returned** - there's no `return` keyword. 

Functions are **private by default**. Add `pub` to make them usable from other modules. Type annotations for parameters and return types are optional but encouraged for clarity. 

```gleam
pub fn main() {
  echo double(10)
}

fn double(a: Int) -> Int {       // private
  multiply(a, 2)
}

fn multiply(a: Int, b: Int) -> Int {
  a * b
}
```

### Higher-order functions

Functions are values. You can **pass them around**, store them in variables, and return them - this is the basis for map/filter/fold and composition patterns. The parameter type for a function value is written with `fn(...) -> ...`.

```gleam
pub fn main() {
  echo twice(1, add_one)    // pass a function
  let my_function = add_one // store a function
  echo my_function(100)
}

fn twice(argument: Int, passed_function: fn(Int) -> Int) -> Int {
  passed_function(passed_function(argument))
}

fn add_one(argument: Int) -> Int {
  argument + 1
}
```

### Anonymous functions 

Anonymous functions use `fn(...) { ... }`. They're interchangeable with named functions and **capture variables** in scope (closures), which is handy for customizing behavior with local data.

```gleam
pub fn main() {
  let add_one = fn(a) { a + 1 }
  echo twice(1, add_one)

  echo twice(1, fn(a) { a * 2 })  // inline

  let secret_number = 42
  let secret = fn() { secret_number } // captures 42
  echo secret()
}

fn twice(argument: Int, my_function: fn(Int) -> Int) -> Int {
  my_function(my_function(argument))
}
```

Closures let you "bake in" environment values without threading them through every call.

### Function captures

For the common "wrap a function and pass one argument through" case, use **function capture**: replace the flowing argument with `_`. It's shorthand for `fn(x) { some_fun(..., x, ...) }`.

```gleam
pub fn main() {
  // These are equivalent
  let add_one_v1 = fn(x) { add(1, x) }
  let add_one_v2 = add(1, _)

  echo add_one_v1(10)
  echo add_one_v2(10)
}

fn add(a: Int, b: Int) -> Int {
  a + b
}
```

This reads nicely in pipelines or when reordering parameters. 

### Generic functions

When your logic doesn't care about a concrete type, use a **type variable** (lowercase) to make a function generic. The compiler instantiates it with a specific type at each call site. This is stricter than "any" - it must be **the same** type throughout that call. 

```gleam
pub fn main() {
  let add_one = fn(x) { x + 1 }
  let exclaim = fn(x) { x <> "!" }

  // twice(10, exclaim)          // invalid: types conflict

  echo twice(10, add_one)        // value = Int here
  echo twice("Hello", exclaim)   // value = String here
}

fn twice(argument: value, my_function: fn(value) -> value) -> value {
  my_function(my_function(argument))
}
```

Result: reusable functions with strong static guarantees - no runtime type checks needed.

### Pipelines

The **pipe operator** `|>` passes the value on the left into the function on the right, letting you read transformations **top-to-bottom**. It tries to place the piped value as the **first argument**; if that doesn't fit, it treats the right side as a function that returns a function (so `b(1,2)(a)`). Capture `_` helps target a different parameter position. 

```gleam
import gleam/io
import gleam/string

pub fn main() {
  // Without the pipe operator
  io.println(string.drop_start(string.drop_end("Hello, Joe!", 1), 7))

  // With the pipe operator
  "Hello, Mike!"
  |> string.drop_end(1)
  |> string.drop_start(7)
  |> io.println

  // Reordering with a capture
  "1"
  |> string.append("2")
  |> string.append("3", _)
  |> io.println
}
```

Pipes are the idiomatic way to **compose** in Gleam - most stdlib functions put the "subject" first to make piping natural. 

### Labelled arguments

Give arguments **labels** to self-document calls and avoid "what does the second `Int` mean?" moments. Labels are written **before** the parameter name in the definition; at call sites you can supply them in any order. Unlabelled args must come first. No runtime cost. 

```gleam
pub fn main() {
  echo calculate(1, add: 2, multiply: 3)
  echo calculate(1, multiply: 3, add: 2) // order doesn't matter
  echo calculate(1, 2, 3)                // labels optional when calling
}

fn calculate(value: Int, add addend: Int, multiply multiplier: Int) {
  value * multiplier + addend
}
```

Labels shine in APIs with multiple same-typed parameters. 

### Label shorthand

If local variable names match the labels, you can **omit** the names at the call site - nice for records and functions with many labelled args. This shorthand is part of the language and widely used in examples and blog posts.

```gleam
pub fn main() {
  let quantity = 5.0
  let unit_price = 10.0
  let discount = 0.2

  // Regular label syntax
  echo calculate_total_cost(
    quantity: quantity,
    unit_price: unit_price,
    discount: discount,
  )

  // Shorthand (names match labels)
  echo calculate_total_cost(quantity:, unit_price:, discount:)
}

fn calculate_total_cost(
  quantity quantity: Float,
  unit_price price: Float,
  discount discount: Float,
) -> Float {
  let subtotal = quantity *. price
  let discount = subtotal *. discount
  subtotal -. discount
}
```

Shorthand keeps the call sites tidy without sacrificing readability. 
