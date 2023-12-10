# Booleans

In Gleam, boolean literal is either `True` or `False`. Its type is `Bool`. Here are some basic operations with booleans:

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

`&&` and `||` are short circuiting, meaning they don't evaluate the right hand side if they don't have to.

`&&` evaluates the right hand side if the left hand side is `True`. So it is literally a name for "_logical **AND**_". So it returns `True` only if all two inputs are `True`.

`||` evaluates the right hand side if the left hand side is `False`. So it is literally a name for "_logical **OR**_". So it returns `False` only if all two inputs are `False`.

If you want to print boolean with `io.println` function, you need to first convert it to `String` using `bool.to_string`:

```gleam
import gleam/io
import gleam/bool

pub fn main() {
  io.println(
    bool.to_string(True),
  )
}
```

Output:
```
True
```

> **Note**: you can alternatively use `io.debug`, if you want to print any type you want:
>
> ```gleam
> import gleam/io
>
> pub fn main() {
>   io.debug(False)
>   io.debug("True")
> }
> ```
> Output:
> ```
> False
> True
> ```

Gleam also supports negation of Bools using either the `!` operator or the `bool.negate` function from the `gleam/bool` module:

```gleam
import gleam/io
import gleam/bool

pub fn main() {
  io.debug(!True)
  io.debug(bool.negate(False))
}
```

Output:

```
False
True
```

> **Important**: `&&` and `||` are short circuiting, meaning they don't evaluate the right hand side if they don't have to. Example:
>
> ```gleam
> import gleam/io
>
> fn test() -> Bool {
>    io.println("test")
>    True
> }
>
> pub fn main() {
>    io.debug(False && test())
> }
> ```
> Output:
> ```
> False
> ```
> _Here `"test"` wasn't printed, because no matter what `test()` returns, the
> result of the `&&` operator is `False`._ However, if we will change `False` to `True`:
> ```gleam
> import gleam/io
>
> fn test() -> Bool {
>    io.println("test")
>    True
> }
>
> pub fn main() {
>    io.debug(True && test())
> }
> ```
> `"test"` will be printed:
> ```
> test
> True
> ```

> **Note**: calls like this:
> ```gleam
> io.debug(True)
> ```
> Can be simplified, using the pipe operator (`|>`):
> ```gleam
> True |> io.debug
> ```
>
> Another example:
> ```gleam
> import gleam/io
> import gleam/bool
>
> pub fn main() {
>   True
>   |> bool.to_string
>   |> io.println
> }
> ```
