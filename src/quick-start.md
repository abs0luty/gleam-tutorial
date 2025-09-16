## Installing Erlang

Since Gleam primarily compiles to Erlang (with optional JavaScript support), you'll need Erlang installed on your system first.

**On Linux and macOS:**

* **Homebrew (macOS):** `brew install erlang`
* **MacPorts (macOS):** `port install erlang`
* **Ubuntu/Debian:** `apt-get install erlang`
* **Fedora:** `yum install erlang`
* **Arch Linux/Manjaro:** `pacman -S erlang`
* **FreeBSD:** `pkg install erlang`

**On Windows:**
Download and install Erlang using the official installers:

* [64-bit](https://github.com/erlang/otp/releases/download/OTP-26.1.2/otp_win64_26.1.2.exe)
* [32-bit](https://github.com/erlang/otp/releases/download/OTP-26.1.2/otp_win32_26.1.2.exe)

## Installing Gleam

The simplest way to get Gleam is from the [GitHub releases page](https://github.com/gleam-lang/gleam/releases).
Download the latest release for your operating system and follow the installation instructions.

## Building from Source

You may want to build Gleam from source if you’re contributing to the language or compiling it for WebAssembly.

1. **Clone the repository:**

   ```sh
   git clone https://github.com/gleam-lang/gleam
   cd gleam
   ```

2. **Install Rust:**
   Gleam’s compiler is written in Rust. Install it via `rustup`:

   * **Linux/macOS:**

     ```sh
     curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
     ```
   * **Windows:**
     Download the installer from the [Rust website](https://forge.rust-lang.org/infra/other-installation-methods.html), run it, then use:

     ```sh
     rustup toolchain install stable
     ```

3. **Build the compiler:**

   ```sh
   cargo install --path gleam-bin 
   ```

   This installs Gleam globally on your system.

## Building for WebAssembly

To compile Gleam for WebAssembly, install `wasm-pack`:

* **Linux/macOS:**

  ```sh
  curl https://rustwasm.github.io/wasm-pack/installer/init.sh -sSf | sh
  ```
* **Windows (alternative):**

  ```sh
  cargo install wasm-pack
  ```

Then build the WebAssembly target:

```sh
cd compiler-wasm
wasm-pack build --target web
```

## Hello world

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

The entry point is located in the `src/hello_world.gleam` file. It will probably look something like this:

```gleam
import gleam/io

pub fn main() {
  io.println("Hello from hello_world!")
}
```

Let us change our program, so that it prints canonical `Hello, world!` message:

```gleam
import gleam/io

pub fn main() {
  io.println("Hello, world!")
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
Hello, world!
```

By default, it transpiles our code to erlang and uses it to run our code. However, you can also use javascript using `--target` flag:

```
$ gleam run --target javascript
  Compiling gleam_stdlib
  Compiling gleeunit
  Compiling hello_world
   Compiled in 1.5s
    Running hello_world.main
Hello, world!
```

You can also use specific javascript runtime using `--runtime` flag:

```
$ gleam run --target javascript --runtime node
  Compiling gleam_stdlib
  Compiling gleeunit
  Compiling hello_world
   Compiled in 1.5s
    Running hello_world.main
Hello, world!
```
