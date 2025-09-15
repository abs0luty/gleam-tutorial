# Tuples and lists

## Lists 

A **list** is an ordered collection of values. Lists are **generic**-their type records the element type: `List(Int)`, `List(String)`, etc. Under the hood they’re **immutable singly-linked lists**, which makes adding/removing at the **front** the "head" very cheap, but operating on the **end** expensive. As a result, you typically build and traverse lists from the front, and avoid random indexing. 

On both BEAM and JavaScript targets, Gleam exposes the same list semantics; you use the standard library’s `gleam/list` for everyday operations such as `map`, `filter`, `fold`, etc.

## Creating and growing lists

### Literal syntax

```gleam
let empty = []
let nums  = [1, 2, 3]
```

### Prepend (constant time)

```gleam
let tail = [2, 3, 4]
let all  = [1, ..tail]     // -> [1, 2, 3, 4]
```

## Pattern matching & deconstruction

Pattern match lists in `case` expressions:

```gleam
case nums {
  [] -> "empty"
  [first] -> "one: " <> int.to_string(first)
  [head, ..rest] -> "head " <> int.to_string(head)
}
```

`[]` matches an empty list, `[_]` a single-element list, and `[_, _, ..]` matches lists with at least two elements. The `..` "spread" binds the remaining tail.

There’s also a dedicated *prefix* syntax for building from an existing list and a matching deconstruction pattern for peeling off the head, shown in the stdlib docs.

## Performance model (important!)

* **Fast:** prepend, examine head (`first`, `rest`), single pass transforms (`map`, `filter`, `fold`).
* **Linear / costly:** `length`, `append` needs to traverse, operations that reach into the middle or end. When you find yourself "indexing," consider a different data structure (e.g., a dict keyed by position) or rethink the algorithm to stream or fold.

## Everyday operators & utilities (from `gleam/list`)

Below are the most common tools. All are **pure** and return new lists.

### Length, emptiness, membership

```gleam
list.length([1, 2, 3])   // 3
list.is_empty([])        // True
list.contains([1, 0], 0) // True
```

`length` is linear-it walks the list. 

### Head & tail

```gleam
list.first([1, 2])  // Ok(1)
list.rest([1, 2])   // Ok([2])
```

Constant time; no copying. 

### Map / Filter / Fold

```gleam
list.map([2, 4, 6], fn(x) { x * 2 })     // [4, 8, 12]
list.filter([2, 4, 6, 1], fn(x) { x>2 }) // [4, 6]
list.fold([1, 2, 3], 0, fn(acc, x) { acc + x }) // 6
```

These are your "loops" in functional Gleam. 

### Find & predicates

```gleam
list.find([1, 2, 3], fn(x) { x > 2 }) // Ok(3)
list.any([3, 4], fn(x) { x > 3 })     // True
list.all([4, 5], fn(x) { x > 3 })     // True
```

Short-circuiting versions of "any"/"all".

### Zipping & unzipping

```gleam
list.zip([1, 2], ["a", "b"])     // [#(1,"a"), #(2,"b")]
list.unzip([#(1,2), #(3,4)])     // #([1,3], [2,4])
```

`strict_zip` fails if lengths differ.

### Append, flatten, flat\_map

```gleam
list.append([1, 2], [3])                     // [1, 2, 3]  // linear
list.flatten([[1], [2, 3], []])              // [1, 2, 3]
list.flat_map([2, 4], fn(x) { [x, x + 1] })  // [2, 3, 4, 5]
```

`append` traverses and copies the first list; prefer building with prepends during folds then `reverse`.

### Take & drop (safe slicing)

```gleam
list.take([1,2,3,4], 2) // [1, 2]
list.drop([1,2,3,4], 2) // [3, 4]
```

Linear, non-throwing.

### Unique, sort

```gleam
list.unique([1,1,4,7,3,3,4]) // [1,4,7,3]
list.sort([4,3,6,5,4,1,2], by: int.compare) // [1,2,3,4,4,5,6]
```

Stable merge sort under the hood.

### Windows, chunks, partitions

```gleam
list.window([1,2,3,4,5], by: 3)       // [[1,2,3],[2,3,4],[3,4,5]]
list.sized_chunk([1,2,3,4,5,6], into: 2) // [[1,2],[3,4],[5,6]]
list.partition([1,2,3,4,5], int.is_odd)  // #([1,3,5], [2,4])
```

Convenient for streaming/rolling analyses. 

### Ranges & repetition

```gleam
list.range(0, 5)        // [0,1,2,3,4,5]
list.repeat("a", 3)     // ["a","a","a"]
```

Handy for generating test data or indices. 

## When *not* to use a list

If you often need **random access** by index or frequent **updates in the middle/end**, a linked list is a poor fit. Consider representing your data differently (e.g., keyed `dict`, or reorganize the algorithm to stream/fold). The tour explicitly discourages index-based list algorithms for this reason.

## Tuples 

A **tuple** quickly groups a fixed number of values, possibly of **different types**. For example, `#(1, "Hi!")` has type `#(Int, String)`, and `#(1.4, 10, 48)` has type `#(Float, Int, Int)`. They’re commonly used to **return two or three values** from a function. If the group has meaning, consider a **custom type** or record for clarity. 

## Constructing and accessing tuples

### **Literal syntax**

  ```gleam
  let pair = #(200, "OK")
  let triple = #("x", 10, True)
  ```

### **Positional accessors** (no pattern match needed)

  ```gleam
  pair.0   // 200
  pair.1   // "OK"
  triple.2 // True
  ```

  These zero-based accessors are convenient for quick reads.

### **Pattern matching**

  ```gleam
  case triple {
    #(name, count, active) -> name <> " " <> int.to_string(count)
  }
  ```

### Typical uses

* **Multi-value returns**

  ```gleam
  fn min_max(xs: List(Int)) -> #(Int, Int) {
    let assert Ok(first) = list.first(xs)
    list.fold(xs, #(first, first), fn(#(lo, hi), x) {
      #(int.min(lo, x), int.max(hi, x))
    })
  }
  ```

* **Zipping lists** produces tuples you can later `unzip` into parallel lists. 
