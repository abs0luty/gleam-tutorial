## Lists

A list is an ordered collection of values. Lists are generic, so their type tracks the kind of elements they hold, like `List(Int)` or `List(String)`.

Internally, lists are immutable and singly-linked. This makes operations at the front fast and anything involving the end slower. For that reason, Gleam code usually builds lists from the front.

Use the `gleam/list` module for transformations like `map`, `filter`, and `fold`. This works the same on both BEAM and JavaScript targets.

### List Literals

Use square brackets. An empty list is `[]`. All elements must be the same type.

```gleam
let empty_list = []
let letters = ["a", "b", "c"]
````

### Prepend (Fast)

Adding to the front is efficient and doesn’t copy the list.

```gleam
let tail = ["b", "c"]
let full = ["a", ..tail]  // ["a", "b", "c"]
```

The `..` spread works only at the start of a list. It’s not a general-purpose concat operator.

### Pattern Matching

You can match on lists using `case`, useful for handling different shapes.

```gleam
case letters {
  [] -> "Empty"
  [x] -> "One: " <> x
  [first, ..rest] -> "First is " <> first
}
```

This helps cleanly separate the empty case, a single item, or a longer list.

### Length, Emptiness, Membership

```gleam
import gleam/list

list.length([1, 2, 3])           // 3
list.is_empty([])                // True
list.contains(["a", "b"], "b")   // True
```

These scan the list, so avoid using them in tight loops.

### Head and Tail

```gleam
list.first(["x", "y"])   // Ok("x")
list.rest(["x", "y"])    // Ok(["y"])
```

Both are fast and do not copy data.

### Map, Filter, Fold

```gleam
list.map([1, 2], fn(x) { x + 1 })              // [2, 3]
list.filter([1, 2, 3], fn(x) { x > 1 })        // [2, 3]
list.fold([1, 2, 3], 0, fn(acc, x) { acc + x }) // 6
```

These replace manual recursion for most list processing.

### Find, Any, All

```gleam
list.find([1, 2, 3], fn(x) { x == 2 })   // Ok(2)
list.any([3, 5], fn(x) { x < 4 })        // True
list.all([3, 5], fn(x) { x > 2 })        // True
```

`any` and `all` stop as soon as possible.

### Zip and Unzip

```gleam
list.zip([1, 2], ["a", "b"])               // [#(1, "a"), #(2, "b")]
list.unzip([#(1, "x"), #(2, "y")])         // #([1, 2], ["x", "y"])
```

Use `strict_zip` if you want to fail on length mismatch.

### Append, Flatten, Flat Map

```gleam
list.append(["a"], ["b"])                  // ["a", "b"]
list.flatten([["a"], ["b", "c"]])          // ["a", "b", "c"]
list.flat_map(["x", "y"], fn(s) { [s, "!"] }) // ["x", "!", "y", "!"]
```

Appending copies the first list, so avoid chaining it repeatedly. Use a fold and reverse for better performance.

### Take and Drop

```gleam
list.take(["a", "b", "c"], 2)  // ["a", "b"]
list.drop(["a", "b", "c"], 1)  // ["b", "c"]
```

Both are safe and return smaller lists without error.

### Unique and Sort

```gleam
list.unique(["x", "x", "y"])             // ["x", "y"]
list.sort([3, 1, 2], by: int.compare)    // [1, 2, 3]
```

`unique` keeps the first of each value. `sort` needs a comparison function.

### Windows, Chunks, Partition

```gleam
list.window([1, 2, 3, 4], by: 2)        // [[1,2],[2,3],[3,4]]
list.sized_chunk([1, 2, 3, 4], into: 2) // [[1,2],[3,4]]
list.partition([1, 2, 3], int.is_even)  // #([2], [1, 3])
```

Use these to split or batch data.

### Ranges and Repeats

```gleam
list.range(1, 3)         // [1, 2, 3]
list.repeat("hi", 2)     // ["hi", "hi"]
```

Useful for generating test data or index sequences.

### When Not to Use Lists

If you need random access, frequent edits in the middle, or lookups by key, lists aren’t the right tool. Try `gleam/dict` for key-value data or rewrite the algorithm to use folds.

`list.at` lets you read by index, but it's O(n) and returns a result:

```gleam
list.at(["a", "b"], 1) // Ok("b")
```

## Tuples

Tuples hold a fixed number of values. Each element can be a different type. They’re good for short groups like a result pair or coordinates.

### Tuple Literals

```gleam
let status = #(404, "Not Found")
let config = #("dev", True, 3)
```

Each arity has a different type. A pair is not the same as a triple.

### Access by Position

```gleam
status.0   // 404
status.1   // "Not Found"
config.2   // 3
```

Accessors use zero-based indexing and don't require pattern matching.

### Pattern Matching

```gleam
case config {
  #(env, active, tries) -> env <> ": " <> int.to_string(tries)
}
```

Use matching when you want to name all fields. If the tuple has meaning in your domain, consider using a record or custom type instead.
