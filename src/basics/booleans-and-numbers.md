## Booleans

In Gleam, boolean literals are either `True` or `False`. Their type is `Bool`. You can apply binary operations on these boolean values, such as:

```gleam
False && False // => False
True && False  // => False
True && True   // => True

False || False // => False
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
  let _ = False && foo()
}
```

In this case `test` isn't printed because `False && ...` immediately yields `False` without calling `test()`. If instead you write:

```gleam
import gleam/io

fn test() -> Bool {
  io.println("test")
  True
}

pub fn main() {
  let _ = True && test()
}
```

Output:

```
test
```

Because the left side (`True`) doesn't block evaluation, so `test()` is called.

### Printing Booleans

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

### Negation

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

### Pipe Operator

It's common in Gleam to compose function calls using the pipe operator:

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

We'll dive deeper in later sections of this tutorial.

## Numbers

Gleam has two numeric types: **`Int`** for whole numbers and **`Float`** for fractional values.

* On the **BEAM** target, `Int` values are arbitrary-precision integers (limited only by memory). Small integers are optimized; larger ones transparently become bignums. `Float` is the runtime’s 64-bit IEEE-754 double, but BEAM has no `NaN`/`Infinity` values exposed in the same way as JavaScript. 
  
  Dividing by zero would normally crash in Erlang, but Gleam defines division by zero to return `0` for operators and offers checked functions in the stdlib. 

* On the **JavaScript** target, `Float` is a 64-bit IEEE-754 double, matching JS `Number`. `Int` operations obey the host’s numeric semantics; keep integers within JS’s **safe integer** range (±(2^53−1)) to avoid precision loss, or use library types/BigInt when you need larger exact integers. 
  
  Gleam’s stdlib exposes the same checked APIs (`int.divide`, `float.divide`, etc.). 

  > Tip: If you depend on integers exceeding the JS safe range, prefer algorithms that avoid huge intermediates, or use a BigInt-backed approach via [the library designed for JS target](https://hexdocs.pm/bigi/index.html).

### Integers
Here are some examples of integer literals in Gleam:

```gleam
0
1
3
-4
2942930103
```

Gleam supports `_` in integers for clarity:

```gleam
3_000_000 vs 3000000
10_000_000 vs 10000000
20_000_000_000 vs 20000000000
```

The `_` has no syntactic and semantic meaning. Gleam as many other languages also supports integers in different bases: binary, octal and hexadecimal integers start with `0b`, `0o` and `0x` respectively:

```gleam
0b0101000101
0o712
0xFf // `f` and `F` here are the same
```

Gleam supports basic primitive operations with integers:

```gleam
1 + 3 - 2 * 4 // => -4
7 / 2  // => 3 (rounded)
3 % 2  // => 1
1 > 0  // => True
1 < 0  // => False
1 >= 0 // => True
1 <= 0 // => False
```

> **Note**: In Gleam division between integers returns another integer, which is the result of the division rounded down.

> **Note**: In Gleam division returns `0` when divisor is `0`:
>
> ```gleam
> 2 / 0 // => 0
> 1 / 0 // => 0
> 0 / 0 // => 0
> ```
>
> This is why it is generally recommended to use `int.divide` function which returns an error if the divisor is `0`:
>
> ```gleam
> 5 |> int.divide(2) // => Ok(2)
> 5 |> int.divide(0) // => Error(Nil)
> 0 |> int.divide(0) // => Error(Nil)
> ```

To print the integer in Gleam, you need to first convert it to string. You can do that using `int.to_string` function:

```gleam
import gleam/io
import gleam/int

fn main() {
  io.println(3 |> int.to_string)
}
```

> **Note**: As mentioned before, there is a difference in behaviour for javascript and erlang targets for converting big integers to strings. Example:
> ```gleam
> import gleam/io
> import gleam/int
>
> fn main() {
>   io.println(9_999_999_999_999_999 |> int.to_string)
> }
> ```
> Output when running the code using default erlang target (`gleam run`):
> ```
> 9999999999999999
> ```
> Output when running the code using javascript target (`gleam run --target javascript`):
> ```
> 10000000000000000
> ```
>
> As of recently, gleam started to output a warning when dealing with big numbers in JS target:
>
> ```
> warning: Int is outside JavaScript's safe integer range
>   ┌─ /Users/adi.salimgereyev/hello_world/src/hello_world.gleam:5:14
>   │
> 5 │   io.println(9_999_999_999_999_999 |> int.to_string)
>   │              ^^^^^^^^^^^^^^^^^^^^^ This is not a safe integer value on JavaScript
>
> This integer value is too large to be represented accurately by
> JavaScript's number type. To avoid this warning integer values must be in
> the range -(2^53 - 1) - (2^53 - 1).
>
> See JavaScript's Number.MAX_SAFE_INTEGER and Number.MIN_SAFE_INTEGER
> properties for more information.
> ```

You can find the absolute value of the integer using `int.absolute_value` function:

```gleam
-12 |> int.absolute_value // => 12
12  |> int.absolute_value // => 12
0   |> int.absolute_value // => 0
```

If you want the result of the base being raised to the power of exponent, you can use `power` function:

```gleam
3 |> int.power(of: 2.0) // => 9
2 |> int.power(of: 2.0) // => 4
2 |> int.power(of: 4.0) // => 16
```

> **Note**: `power` accepts second argument only as floating point number. Gleam doesn't have implicit `Int` to `Float` cast:
>
> ```
> error: Type mismatch
>    ┌─ /gleam-tutorial/hello_world/src/hello_world.gleam
>    │
>    │  3 |> int.power(of: 2)
>    │                     ^
>
> Expected type:
>
>     Float
>
> Found type:
>
>     Int
> ```
> So `2` must be changed to `2.0`. See the [floating point numbers section](#floats) below.

If you want to convert an integer to float, you can use `to_float` function:

```gleam
3  |> to_float // 3.0
-3 |> to_float // -3.0
0  |> to_float // 0.0
```

Here are some other useful methods for integers:

```gleam
// Returns the minimum of two numbers
int.min(2, 3)    // => 2

// Returns the maximum of two numbers
int.max(3, 4)    // => 4

// Returns true if the number is even
2 |> int.is_even // => True
3 |> int.is_even // => False

// Returns true if the number is odd
2 |> int.is_odd  // => False
3 |> int.is_odd  // => True

// Returns the negative of the number
1 |> int.negate  // => -1

// Returns the square root of the number
4   |> int.square_root // => Ok(2.0)
-16 |> int.square_root // => Error(Nil)
```

You can convert integers to different common bases:

```gleam
2  |> to_base2 // => "10"
15 |> to_base8 // => "17"
48 |> to_base16 // => "30"
48 |> to_base36 // => "1C"
```

If you want to convert a number to any base from `2` to `36`, you can use `to_base_string`:

```gleam
// 37 is bigger than 36
48 |> to_base_string(37) // => Error(InvalidBase)

// 1 is less than 2
48 |> to_base_string(1)  // => Error(InvalidBase)

// Same as running to_base36()
48 |> to_base_string(36) // => Ok("1C")
```

### Floats

Here are some examples of float literals:

```gleam
1.6
-0.3
8.0
```

As for integers, Gleam supports `_` in floats for clarity:

```gleam
3.141_159_265
```

> **Note**: you cannot put `_` before `.`:
>
> ```
> error: Syntax error
>    ┌─ .../hello_world/src/hello_world.gleam
>    │
>    │     -0_.3_3
>    │       ^ Numbers cannot have a trailing underscore
>
> Hint: remove it.
> ```

You can also use scientific notation with floats:

```gleam
2.997e8
6.626e-34
```

> **Note**: In Gleam operators like `+`, `-`, `*` and `/` cannot be used for floats. Instead use `+.`, `-.`, `*.` and `/.`:
> ```gleam
> 2.0 +. 2.0 // => 4.0
> 3.0 -. 2.0 // => 1.0
> 1.0 *. 2.0 // => 2.0
> 3.0 /. 2.0 // => 1.5
>
> // As with integers
> 2.0 /. 0.0 // => 0.0
> 0.0 /. 0.0 // => 0.0
> ```

> **Note**: Situation is a little more complex with comparison operators. `==` and `!=` work for both integers and floats. `>`, `<`, `>=`, `<=` however only work for integers. So you need to use analogs: `>.`, `<.`, `>=.`, `<=.`:
> ```gleam
> 2.0 >.  1.0  // => True
> 2.0 <=. 2.0  // => True
> 2.0 <.  2.0  // => True
> 2.0 ==  2.0  // => True
> 2.0 !=  2.0  // => False
> ```

> **Note**: In Gleam, as with integers, division returns `0.0` when divisor is `0.0`:
> ```gleam
> 2.0 /. 0.0 // => 0.0
> 1.0 /. 0.0 // => 0.0
> 0.0 /. 0.0 // => 0.0
> ```
> This is why it is generally recommended to use `float.divide` function which returns an error if the divisor is 0:
> ```gleam
> import gleam/float
>
> 5.0 |> float.divide(2.0) // => Ok(2.5)
> 5.0 |> float.divide(0.0) // => Error(Nil)
> 0.0 |> float.divide(0.0) // => Error(Nil)
> ```

You can find the absolute value of the float using `float.absolute_value` function:

```gleam
-12.0 |> float.absolute_value // => 12.0
12.0  |> float.absolute_value // => 12.0
0.0   |> float.absolute_value // => 0.0
```

You can also round float number to the next lowest or the next highest whole number using `ceiling` and `floor` functions:

```gleam
2.3 |> float.ceiling // => 3.0
2.3 |> float.floor   // => 2.0
```

Or you can round to the nearest whole number using `round`:

```gleam
2.3 |> float.round // => 2.0
2.5 |> float.round // => 3.0
```

Here are some other useful methods for floats:

```gleam
// Returns the minimum of two numbers
float.min(2.0, 3.3)             // => 2.0

// Returns the maximum of two numbers
float.max(3.1, 4.2)             // => 4.2

// Returns the negative of the number
1.0 |> float.negate             // => -1.0

// Returns the value as `Int`, truncating all decimal digits
2.4287898428 |> float.truncate  // => 2

// Returns the results of the base being raised to the power of the exponent
2.0  |> float.power(-1.0)    // => Ok(0.5)
2.0  |> float.power(2.0)     // => Ok(4.0)
4.0  |> float.power(of: 2.0) // => Ok(16.0)
-1.0 |> float.power(0.5)     // => Error(Nil)

// Returns the square root
4.0   |> float.square_root   // => Ok(2.0)
-16.0 |> float.square_root   // => Error(Nil)
```
