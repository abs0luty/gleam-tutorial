# Numbers

Gleam has two main types for numbers: `Int` for whole numbers and `Float` for numbers with a decimal point.

## Integers

Integers in Gleam are written as usual:

```gleam
1
2
3
-4
2942930103
```

Gleam supports `_` in integers for clarity:

```gleam
3_000_000
```

_In the given example, the `_` has no syntactic and semantic meaning._

Gleam as many other languages also supports integers in different bases: binary, octal and hexadecimal integers start with `0b`, `0o` and `0x` respectively:

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

> **Note**: In Gleam division doesn't handle edge case with divisor being `0`:
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

> **Note**: There is currently no maximum value for integers in Gleam, however there is a difference in behaviour for javascript and erlang targets for converting big integers to strings. Example:
> ```gleam
> import gleam/io
> import gleam/int
>
> fn main() {
>   io.println(9_999_999_999_999_999 |> int.to_string)
> }
> ```
> Output when running with default erlang target (`gleam run`):
> ```
> 9999999999999999
> ```
> Output when running with javascript target (`gleam run --target javascript`):
> ```
> 10000000000000000
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
> So `2` must be changed to `2.0`. See the [floating point numbers section](#floating-point-numbers) below.

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

## Floating-point numbers

`Float`-s are numbers that have a decimal point:

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
>    │     { -0_.3_3 }
>    │         ^ Numbers cannot have a trailing underscore
>
> Hint: remove it.
> ```

You can also use scientific notation with floats:

```gleam
2.997e8
6.626e-34
```

> **Note**: In Gleam there are actually two division operations: `/` for integers and `/.` for floats:
>
> ```gleam
> 2.0 /. 2.0 // => 1.0
> 3.0 /. 2.0 // => 1.5
>
> // As with integers
> 2.0 /. 0.0 // => 0.0
> 0.0 /. 0.0 // => 0.0
> ```
