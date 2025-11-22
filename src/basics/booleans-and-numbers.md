## Booleans

Gleam uses `True` and `False` as boolean values. Their type is `Bool`. You can apply logical operators like:

```gleam
False && False  // False
True && False   // False
True && True    // True

False || False  // False
True || False   // True
True || True    // True
````

Both operators short-circuit:

* `False && ...` skips the right side.
* `True || ...` skips the right side.

```gleam
import gleam/io

fn message() -> Bool {
  io.println("evaluated")
  True
}

pub fn main() {
  let _ = False && message()  // doesn't print anything
  let _ = True && message()   // prints "evaluated"
}
```

### Printing Booleans

Convert a `Bool` to a `String` before printing:

```gleam
import gleam/io
import gleam/bool

pub fn main() {
  io.println(bool.to_string(False))
}
```

You can also use `echo` for debugging:

```gleam
pub fn main() {
  echo True
}
```

### Negation

Negate with `!` or `bool.negate`:

```gleam
import gleam/bool

!True              // False
bool.negate(False) // True
```

## Numbers

Gleam supports two numeric types:

* `Int` for whole numbers
* `Float` for decimal numbers

### Integers

Integers support basic arithmetic:

```gleam
1 + 2 - 3 * 4 // => -9
7 / 2         // => 3
3 % 2         // => 1
```

Division by zero returns `0`:

```gleam
5 / 0 // => 0
```

Use `int.divide` to handle division safely:

```gleam
import gleam/int

int.divide(5, 2) // Ok(2)
int.divide(5, 0) // Error(Nil)
```

You can write large numbers with `_`:

```gleam
1_000_000
```

Gleam also supports binary, octal, and hexadecimal:

```gleam
0b1010
0o755
0xFF
```

Comparison is straightforward:

```gleam
1 > 0   // True
2 <= 2  // True
```

### Working with Integers

Convert to string:

```gleam
import gleam/int
int.to_string(42)
```

Convert to float:

```gleam
int.to_float(2)  // 2.0
```

Other helpers:

```gleam
int.absolute_value(-10)   // 10
int.negate(5)             // -5
int.min(1, 3)             // 1
int.max(1, 3)             // 3
int.square_root(4)        // Ok(2.0)
int.square_root(-1)       // Error(Nil)
int.is_even(2)            // True
int.is_odd(3)             // True
```

Convert to base:

```gleam
int.to_base2(5)    // "101"
int.to_base16(255) // "FF"
int.to_base_string(48, 36) // Ok("1C")
```

Invalid base values return an error:

```gleam
int.to_base_string(48, 1)  // Error(InvalidBase)
int.to_base_string(48, 37) // Error(InvalidBase)
```

### JavaScript Note

On JavaScript targets, keep integers within ±(2^53 − 1) to avoid precision issues:

```gleam
int.to_string(9_999_999_999_999_999)
// => "10000000000000000" on JS
// => "9999999999999999" on BEAM
```

The compiler warns when you exceed this range on the JS target.

### Float Numbers

Float literals:

```gleam
1.5
-0.25
8.0
```

You can use underscores for clarity:

```gleam
3.141_592
```

Scientific notation is also supported:

```gleam
6.022e23
```

### Float Operations

Use `+.`, `-.`, `*.`, and `/.` for float math:

```gleam
2.0 +. 3.0   // 5.0
5.0 -. 2.0   // 3.0
3.0 *. 2.0   // 6.0
4.0 /. 2.0   // 2.0
```

Dividing by zero yields `0.0`. Use `float.divide` to handle it safely:

```gleam
import gleam/float

float.divide(3.0, 0.0) // Error(Nil)
```

Comparisons use float-specific operators:

```gleam
2.0 >. 1.0    // True
2.0 <=. 2.0   // True
2.0 == 2.0    // True
2.0 != 3.0    // True
```

### Float Helpers

```gleam
float.absolute_value(-2.5)  // 2.5
float.negate(1.0)           // -1.0
float.min(2.1, 3.3)         // 2.1
float.max(2.1, 3.3)         // 3.3
float.truncate(2.99)        // 2
float.ceiling(1.4)          // 2.0
float.floor(1.4)            // 1.0
float.round(2.5)            // 3.0
```

### Float Power and Root

```gleam
float.power(2.0, 3.0)        // Ok(8.0)
float.power(-1.0, 0.5)       // Error(Nil)
float.square_root(4.0)       // Ok(2.0)
float.square_root(-1.0)      // Error(Nil)
```

As with integers, you must pass `Float` to these functions. Gleam doesn't auto-cast from `Int`.
