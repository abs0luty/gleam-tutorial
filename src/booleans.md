# Booleans

In Gleam, boolean literals are either `True` or `False`. Their type is `Bool`.

## Basic Boolean Operators

```gleam
False && False // => False
False && True  // => False
True && False  // => False
True && True   // => True

False || False // => False
False || True  // => True
True || False  // => True
True || True   // => True
```

`&&` is logical **AND**: it returns `True` only if *both* operands are `True`.

`||` is logical **OR**: it returns `False` only if *both* operands are `False`.

Both `&&` and `||` short‐circuit:

* `&&` does not evaluate its right operand if the left is `False`, since the result is already known to be `False`.
* `||` does not evaluate its right operand if the left is `True`, since the result must be `True`.

Here is an example of such behaviour:
```gleam
import gleam/io

fn foo() -> Bool {
   io.println("test")
   True
}

pub fn main() {
   echo False && foo()
}
```

Output:

```
src/main.gleam:9
False
```

In this case `"test"` isn’t printed because `False && …` immediately yields `False` without calling `test()`. If instead you write:

```gleam
import gleam/io

fn test() -> Bool {
   io.println("test")
   True
}

pub fn main() {
   echo True && test()
}
```

Output:

```
test
src/main.gleam:9
True
```

Because the left side (`True`) doesn't block evaluation, so `test()` is called.

## Printing Booleans

If you want to print a `Bool`, you must first convert it to a `String` using `bool.to_string`. For example:

```gleam
import gleam/io
import gleam/bool

pub fn main() {
  io.println(bool.to_string(True))
}
```

Output:

```
True
```

Alternatively, for debugging you can use `echo`:

```gleam
import gleam/io

pub fn main() {
  echo False
  echo "True"
}
```

Output:

```
src/main.gleam:4
False
src/main.gleam:5
"True"
```

## Negation

You can negate booleans in two ways:

* Using the `!` operator: `!True` → `False`, `!False` → `True`
* Using `bool.negate` from the `gleam/bool` module:

```gleam
import gleam/io
import gleam/bool

pub fn main() {
  echo !True
  echo bool.negate(False)
}
```

Output:

```
src/main.gleam:4
False
src/main.gleam:5
True
```

## Pipe Operator

It's common in Gleam to compose function calls using the pipe operator. You can use it with booleans too. For example:

```gleam
import gleam/io
import gleam/bool

pub fn main() {
  True
  |> bool.to_string
  |> io.println
}
```

This does the same as:

```gleam
io.println(bool.to_string(True))
```
