# Hello World

Let us now write our first Gleam program! _If you don't have Gleam installed, it is recommended to follow instructions in the [previous section](./installation.md)_. Run:

```
gleam new hello_world
cd hello_world
```

You can now see the automatically generated Gleam project structure:

```
hello_world
|_ .github/workflows
   |_ test.yml
|_ src
   |_ hello_world.gleam
|_ test
   |_ hello_world_test.gleam
|_ .gitignore
|_ gleam.toml
|_ README.md
```

The starting point is located in the `src/hello_world.gleam` file. It will probably look something like this:

```gleam
import gleam/io

pub fn main() {
  io.println("Hello from hello_world!")
}
```

As you can see, Gleam doesn't require semicolons. To run the program, you can use `gleam run` command:

```
$ gleam run
  Compiling gleam_stdlib
  Compiling gleeunit
  Compiling hello_world
   Compiled in 1.78s
    Running hello_world.main
Hello from hello_world!
```

By default, it transpiles our code to erlang and uses it to run our code. However, you can also use javascript using `--target` flag:

```
$ gleam run --target javascript
  Compiling gleam_stdlib
  Compiling gleeunit
  Compiling hello_world
   Compiled in 1.5s
    Running hello_world.main
Hello from hello_world!
```

You can also use specific javascript runtime using `--runtime` flag:

```
$ gleam run --target javascript --runtime node
  Compiling gleam_stdlib
  Compiling gleeunit
  Compiling hello_world
   Compiled in 1.5s
    Running hello_world.main
Hello from hello_world!
```
