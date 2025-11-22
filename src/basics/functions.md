## Functions

Use `fn` to define a function. Gleam runs the body top to bottom and returns the final value. There's no `return` keyword.

Functions are private unless marked `pub`. Type annotations help with clarity but aren't required.

```gleam
pub fn main() {
  greet("Alex")
}

fn greet(name: String) {
  let message = make_message(name)
  io.println(message)
}

fn make_message(name: String) -> String {
  "Welcome, " <> name <> "!"
}
````

### Higher-Order Functions

Functions can be passed around like any other value. You can use them to build flexible logic.

```gleam
pub fn main() {
  let result = apply_twice(square, 3)
  io.println(int.to_string(result))
}

fn square(n: Int) -> Int {
  n * n
}

fn apply_twice(f: fn(Int) -> Int, x: Int) -> Int {
  f(f(x))
}
```

### Anonymous Functions

You can define unnamed functions inline. These can also capture values from their environment.

```gleam
pub fn main() {
  let double = fn(n) { n * 2 }
  let result = double_and_add(double, 5)
  io.println(int.to_string(result))

  let base = 10
  let add_base = fn(x) { x + base }
  io.println(int.to_string(add_base(5)))
}

fn double_and_add(f: fn(Int) -> Int, x: Int) -> Int {
  f(x) + x
}
```

### Function Captures

Use `_` to partially apply a function and create a new one.

```gleam
pub fn main() {
  let greet = say("Hi", _)
  io.println(greet("Sam"))
}

fn say(prefix: String, name: String) -> String {
  prefix <> ", " <> name
}
```

This simplifies your code and makes pipelines easier to read.

### Generic Functions

Generic functions work with any type, as long as it's consistent within the call.

```gleam
pub fn main() {
  io.println(duplicate("hey"))
  io.println(int.to_string(duplicate(42)))
}

fn duplicate(x: value) -> Tuple(value, value) {
  #(x, x)
}
```

The compiler ensures the types are used consistently and doesn't allow mismatches.

### Pipelines

The pipe operator passes the result of one expression into the next. It improves readability by following the data flow.

```gleam
import gleam/string
import gleam/io

pub fn main() {
  "   Hello World!  "
  |> string.trim
  |> string.uppercase
  |> string.append("!!!")
  |> io.println
}
```

You can also use `_` to place the piped value into another argument slot.

```gleam
"42"
|> string.concat(["Value: ", _])
|> io.println
```

### Labelled Arguments

Labels help show what each argument means. They're useful when multiple arguments share a type.

```gleam
pub fn main() {
  let total = compute_cost(units: 4, price_per_unit: 25)
  io.println(int.to_string(total))
}

fn compute_cost(units units: Int, price_per_unit cost: Int) -> Int {
  units * cost
}
```

Labels can be written in any order at the call site.

### Label Shorthand

If your variable names match the parameter labels, you can use shorthand syntax.

```gleam
pub fn main() {
  let width = 10
  let height = 5
  let unit = "cm"

  describe_rectangle(width:, height:, unit:)
}

fn describe_rectangle(
  width width: Int,
  height height: Int,
  unit unit: String,
) {
  let info = int.to_string(width) <> " x " <>
             int.to_string(height) <> " " <>
             unit

  io.println(info)
}
```

This keeps function calls compact and clear.
