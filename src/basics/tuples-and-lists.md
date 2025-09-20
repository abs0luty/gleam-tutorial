## Lists

A **list** is an ordered collection of values. Lists are **generic**—their type records the element type: `List(Int)`, `List(String)`, etc. 

Under the hood they're **immutable singly-linked** lists. That makes adding or removing at the **front** O(1) and anything that touches the **end** O(n). 

So in Gleam you usually **build from the front** and avoid random indexing. These rules are the same on both Erlang/BEAM and JS targets; you use `gleam/list` for all the usual suspects like `map`, `filter`, `fold`, and friends.

### Literal syntax

Use square brackets. Empty is `[]`. Elements are homogeneous by type parameter:

```gleam
let empty = []
let nums  = [1, 2, 3]
```

### Prepend (constant time)

Prepending doesn't copy the whole list, so it's the idiomatic way to build sequences efficiently:

```gleam
let tail = [2, 3, 4]
let all  = [1, ..tail]     // -> [1, 2, 3, 4]
```

That spread syntax is specific to **prefixing**. It's not a general "concatenate two lists" shortcut. The language even warns if you accidentally try to use it as concat.

## Pattern matching & deconstruction

You can destructure lists right in a `case`. It's a clean way to branch on empty vs non-empty and bind the head and tail:

```gleam
case nums {
  [] -> "empty"
  [first] -> "one: " <> int.to_string(first)
  [head, ..rest] -> "head " <> int.to_string(head)
}
```

`[]` matches empty, `[x]` matches single-element, and `[h, ..t]` peels one off the front. 

## Everyday operators & utilities

All functions are **pure** and return new lists. The important cost model: anything that must walk the list is **linear**; operations that only touch the head are **constant time**.

### Length, emptiness, membership

```gleam
import gleam/list

pub fn main() {
  echo list.length([1, 2, 3])   // 3
  echo list.is_empty([])        // True
  echo list.contains([1, 0], 0) // True
}
```

`length` and `contains` traverse the list, so they're O(n). Use them when you need them, but don't call them in tight loops if you can carry the info through folds instead.

### Head & tail

```gleam
list.first([1, 2])  // Ok(1)
list.rest([1, 2])   // Ok([2])
```

These do not copy. They're constant time and the safest way to peek or step through a list one element at a time.

### Map / Filter / Fold

```gleam
list.map([2, 4, 6], fn(x) { x * 2 })     // [4, 8, 12]
list.filter([2, 4, 6, 1], fn(x) { x > 2 }) // [4, 6]
list.fold([1, 2, 3], 0, fn(acc, x) { acc + x }) // 6
```

These are your **loops**. Prefer them over manual recursion for clarity.

### Find & predicates

```gleam
list.find([1, 2, 3], fn(x) { x > 2 }) // Ok(3)
list.any([3, 4], fn(x) { x > 3 })     // True
list.all([4, 5], fn(x) { x > 3 })     // True
```

`any`/`all` **short-circuit**, which is handy for guards and validations without scanning the whole list unnecessarily.

### Zipping & unzipping

```gleam
list.zip([1, 2], ["a", "b"])           // [#(1, "a"), #(2, "b")]
list.unzip([#(1, 2), #(3, 4)])         // #([1, 3], [2, 4])
```

If you need equal lengths guaranteed, use `strict_zip` which returns `Error(Nil)` on mismatch. Great for pairing coordinates, ids to names, etc.

### Append, flatten, flat\_map

```gleam
list.append([1, 2], [3])                     // [1, 2, 3]
list.flatten([[1], [2, 3], []])              // [1, 2, 3]
list.flat_map([2, 4], fn(x) { [x, x + 1] })  // [2, 3, 4, 5]
```

`append` must **copy the first list**, so it's O(n). 

In hot paths, build by **prepending inside a fold** and finish with a single `reverse`. That keeps each step O(1) and has one linear pass at the end.

### Take & drop (safe slicing)

```gleam
list.take([1, 2, 3, 4], 2) // [1, 2]
list.drop([1, 2, 3, 4], 2) // [3, 4]
```

Both are linear. `drop` doesn't copy nodes it skips, which makes it an efficient way to "advance" a cursor in streaming code.

### Unique, sort

```gleam
list.unique([1, 1, 4, 7, 3, 3, 4]) // [1, 4, 7, 3]
list.sort([4, 3, 6, 5, 4, 1, 2], by: int.compare) // [1, 2, 3, 4, 4, 5, 6]
```

`unique` runs in **log-linear** time; it preserves the **first occurrence** order. 

`sort` takes a comparator and returns a new sorted list. 

### Windows, chunks, partitions

```gleam
list.window([1, 2, 3, 4, 5], by: 3)            // [[1,2,3],[2,3,4],[3,4,5]]
list.sized_chunk([1, 2, 3, 4, 5, 6], into: 2)  // [[1,2],[3,4],[5,6]]
list.partition([1, 2, 3, 4, 5], int.is_odd)    // #([1,3,5], [2,4])
```

Use sliding `window` for rolling metrics, `sized_chunk` for batching, and `partition` to split by a predicate in one pass.

> **Note**: `transpose` isn't tail-recursive on JS and can blow the stack with huge lists. 

### Ranges & repetition

```gleam
list.range(0, 5)        // [0, 1, 2, 3, 4, 5]
list.repeat("a", 3)     // ["a", "a", "a"]
```

Great for generating test data, producing index sequences, or simple stubs. 

## When not to use a list

If you need **random access** or frequent updates in the **middle/end**, a singly-linked list is the wrong tool. 

Consider `gleam/dict` for keyed lookups, or restructure the algorithm around streaming with folds. Index-based algorithms are rare in Gleam because lists are linked. If you must, `list.at` exists but returns a `Result` and is still O(n).

## Tuples

A **tuple** groups a fixed number of values, possibly of **different types**. They're perfect for small, ad-hoc groupings or multi-value returns, like `#(status_code, body)` or `#(x, y)`. If the group has domain meaning, prefer a custom type or record to make the fields self-describing. Tuples are immutable and have a fixed arity.

### Literal syntax

```gleam
let pair = #(200, "OK")
let triple = #("x", 10, True)
```

Arity is part of the type. For example, `#(Int, String)` is a different type from `#(Int, String, Bool)`.

### Positional accessors (no pattern match needed)

```gleam
pair.0   // 200
pair.1   // "OK"
triple.2 // True
```

These **zero-based** accessors are convenient for quick reads and are part of the official tour. They're great when you only need one field and don't want a full `case`.

### Pattern matching

```gleam
case triple {
  #(name, count, active) -> name <> " " <> int.to_string(count)
}
```

Pattern matching shines when you want to destructure and name everything at once. If you find yourself passing tuples around widely, consider a custom type for readability.
