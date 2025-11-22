## Pattern Matching

Gleam supports pattern matching in variable bindings and `case` expressions. This allows you to unpack data and handle different shapes clearly and safely.

### Let Bindings

With `let`, your pattern must always match the value. It's for shapes you know are guaranteed.

```gleam
pub fn main() {
  let point = #(3, 4)
  let #(x, y) = point

  io.println(int.to_string(x + y))
}
````

This works because `point` is a 2-tuple, and the pattern matches that exactly.

### Case Expressions

Use `case` to match multiple possible shapes. For strings, you can match a prefix using concatenation:

```gleam
import gleam/io

pub fn main() {
  io.println(get_name("Hello, Joe"))
  io.println(get_name("Hello, Mike"))
  io.println(get_name("System still working?"))
}

fn get_name(x: String) -> String {
  case x {
    "Hello, " <> name -> name
    _ -> "Unknown"
  }
}
```

Lists can be matched by length or contents. The `..` syntax captures the remaining elements:

```gleam
import gleam/int
import gleam/list
import gleam/io

pub fn main() {
  let xs = list.repeat(int.random(5), times: int.random(3))

  let result = case xs {
    [] -> "Empty list"
    [1] -> "List of just 1"
    [4, ..] -> "List starting with 4"
    [_, _] -> "List of 2 elements"
    _ -> "Some other list"
  }

  io.println(result)
}
```

### Let Assert

Use `let assert` when you expect a certain shape and want the program to fail fast if that shape isn't matched. It allows partial patterns and will panic if the match fails. You can add a custom message.

```gleam
pub fn main() {
  let a = unsafely_get_first_element([123])
  io.println(int.to_string(a))

  let b = unsafely_get_first_element([])
  io.println(int.to_string(b))  // Panics here
}

pub fn unsafely_get_first_element(items: List(a)) -> a {
  let assert [first, ..] = items as "List should not be empty"
  first
}
```

Use this only when you're certain about the input, or when failing is acceptable.
