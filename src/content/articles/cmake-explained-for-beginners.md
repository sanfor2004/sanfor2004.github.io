---
title: "CMake Explained for Beginners: Targets, Libraries, and Builds"
description: Learn what CMake actually does by building a small C++20 executable, library, and test with targets, usage requirements, and out-of-source builds.
image: "/images/writing/cmake-explained-for-beginners.webp"
imageAlt: "A hand-drawn workshop machine assembling source pages into a reusable library block and an executable robot."
imageWidth: 1600
imageHeight: 900
date: "2026-09-15"
topic: C++
tags:
  - C++
  - CMake
  - Build Systems
  - Developer Tools
featured: false
draft: false
---

CMake is easier to understand once you stop treating it as a compiler command. It is a program that reads a description of your project and generates a build system for another tool. That tool might be Ninja, Unix Makefiles, Visual Studio, or Xcode; the compiler might be GCC, Clang, or MSVC.

This guide builds one small C++20 project from beginning to end. It produces a reusable library, an executable that links to it, and a test. The example is intentionally plain so that the important relationships stay visible.

## The three stages

A normal CMake workflow has three distinct stages:

1. **Configure and generate:** CMake reads `CMakeLists.txt`, discovers the compiler and dependencies, then writes files for a selected generator.
2. **Build:** CMake asks the generated build tool to compile and link the requested targets.
3. **Run or test:** You run the resulting program or let CTest execute registered tests.

These commands keep those stages separate:

```bash
cmake -S . -B build
cmake --build build
ctest --test-dir build
```

`-S .` names the source tree. `-B build` names the build tree. Keeping generated files in `build/` is called an *out-of-source build*. It leaves the source directory readable and makes a clean rebuild as simple as removing one dedicated build directory.

## The example project

We will create a library that formats a greeting and a program that prints it:

```text
cmake-greeting/
├── CMakeLists.txt
├── app/
│   ├── CMakeLists.txt
│   └── main.cpp
├── greeting/
│   ├── CMakeLists.txt
│   ├── include/
│   │   └── greeting/
│   │       └── greeting.hpp
│   └── src/
│       └── greeting.cpp
└── tests/
    ├── CMakeLists.txt
    └── greeting_test.cpp
```

This layout is larger than a one-file example, but it demonstrates why targets and subdirectories matter.

## Describe the project at the root

The root `CMakeLists.txt` establishes the project and includes its parts:

```cmake
cmake_minimum_required(VERSION 3.20)

project(
  greeting_project
  VERSION 1.0.0
  LANGUAGES CXX
)

include(CTest)

add_subdirectory(greeting)
add_subdirectory(app)

if(BUILD_TESTING)
  add_subdirectory(tests)
endif()
```

`cmake_minimum_required` declares the oldest CMake behavior this project supports. `project` gives the project a name, version, and language. `add_subdirectory` asks CMake to process another `CMakeLists.txt` in that directory.

`include(CTest)` creates the standard `BUILD_TESTING` option and enables testing when that option is on. Users can disable the tests at configure time with `-DBUILD_TESTING=OFF`.

## Build a library target

Add `greeting/include/greeting/greeting.hpp`:

```cpp
#pragma once

#include <string>
#include <string_view>

namespace greeting {

std::string make_message(std::string_view name);

}
```

Add `greeting/src/greeting.cpp`:

```cpp
#include <greeting/greeting.hpp>

namespace greeting {

std::string make_message(std::string_view name) {
  return "Hello, " + std::string(name) + "!";
}

}
```

Then describe the library in `greeting/CMakeLists.txt`:

```cmake
add_library(greeting
  src/greeting.cpp
)

target_compile_features(greeting PUBLIC cxx_std_20)

target_include_directories(greeting
  PUBLIC
    ${CMAKE_CURRENT_SOURCE_DIR}/include
)
```

`add_library` creates a target named `greeting`. A target is more than a filename: it is the build-system object that owns sources, compiler requirements, include paths, definitions, options, and dependencies.

The `PUBLIC` keyword describes a usage requirement. The library itself needs C++20 and its public include directory, and anything linking to the library needs them too. CMake carries those requirements to consumers automatically.

For an installable library, the include-path expression would normally distinguish build and installation locations with generator expressions. This tutorial only builds inside the source checkout, so one build-tree path keeps the first example focused.

## Build an executable target

Add `app/main.cpp`:

```cpp
#include <greeting/greeting.hpp>

#include <iostream>

int main() {
  std::cout << greeting::make_message("CMake") << '\n';
}
```

Add `app/CMakeLists.txt`:

```cmake
add_executable(greeting_app
  main.cpp
)

target_link_libraries(greeting_app
  PRIVATE
    greeting
)
```

The executable does not declare the library's include directory or language level. Linking to the `greeting` target imports its `PUBLIC` usage requirements. This is the central idea behind modern CMake: describe relationships between targets and let requirements flow along those relationships.

`PRIVATE` means `greeting_app` uses the library, but the executable does not forward that dependency to another consumer. Executables are rarely linked by other targets, but using the correct visibility keeps the model explicit.

## Add one test

Add `tests/greeting_test.cpp`:

```cpp
#include <greeting/greeting.hpp>

#include <iostream>

int main() {
  const std::string actual = greeting::make_message("Ada");

  if (actual != "Hello, Ada!") {
    std::cerr << "Unexpected message: " << actual << '\n';
    return 1;
  }

  return 0;
}
```

Add `tests/CMakeLists.txt`:

```cmake
add_executable(greeting_test
  greeting_test.cpp
)

target_link_libraries(greeting_test
  PRIVATE
    greeting
)

add_test(
  NAME greeting.make_message
  COMMAND greeting_test
)
```

CTest treats a zero exit status as success. A larger project would normally use a testing framework, but a plain executable makes the relationship between CMake, the compiler, and the test runner easy to see.

## Configure and build

From the project root:

```bash
cmake -S . -B build
cmake --build build
ctest --test-dir build --output-on-failure
```

The first command chooses a default generator for the machine. To choose Ninja explicitly:

```bash
cmake -S . -B build-ninja -G Ninja -DCMAKE_BUILD_TYPE=Debug
cmake --build build-ninja
ctest --test-dir build-ninja --output-on-failure
```

The `-G` option belongs to the configure step. A build directory is tied to its generator, compiler selection, and cached configuration. Use a new build directory when changing those foundational choices.

Run the application from the path produced by the selected generator. A single-configuration generator such as Ninja commonly produces it directly beneath the corresponding subdirectory:

```bash
./build-ninja/app/greeting_app
```

Expected output:

```text
Hello, CMake!
```

## Single- and multi-configuration generators

Ninja and Unix Makefiles usually select one configuration while configuring:

```bash
cmake -S . -B build -DCMAKE_BUILD_TYPE=Release
cmake --build build
```

Visual Studio, Xcode, and Ninja Multi-Config can hold several configurations in one build tree. Select the configuration while building and testing:

```powershell
cmake -S . -B build
cmake --build build --config Release
ctest --test-dir build -C Release --output-on-failure
```

Passing `CMAKE_BUILD_TYPE` to a multi-configuration generator does not select the active build configuration in the same way. This difference explains many cases where a beginner asks for Release but still finds a Debug binary—or cannot find the binary at the expected path.

## `PRIVATE`, `PUBLIC`, and `INTERFACE`

These keywords answer two questions: does the target itself need this requirement, and should consumers inherit it?

| Keyword | Used by this target | Inherited by consumers |
| --- | --- | --- |
| `PRIVATE` | Yes | No |
| `PUBLIC` | Yes | Yes |
| `INTERFACE` | No | Yes |

Suppose a library uses a dependency only inside its `.cpp` files. Link it `PRIVATE`. If the dependency appears in the library's public headers, consumers may also need its include paths or compile definitions, so it is often `PUBLIC`. A header-only library has no compiled implementation and commonly stores requirements as `INTERFACE`.

Visibility is not about whether C++ classes are public or private. It controls how build requirements propagate between CMake targets.

## Prefer target commands over global state

Older examples often use directory-wide commands:

```cmake
include_directories(include)
add_definitions(-DSOME_FLAG)
set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ...")
```

These settings can leak into unrelated targets and make dependencies difficult to understand. Prefer target-scoped commands:

```cmake
target_include_directories(greeting PUBLIC include)
target_compile_definitions(greeting PRIVATE GREETING_INTERNAL_CHECKS=1)
target_compile_options(greeting PRIVATE ...)
```

Target properties give CMake enough information to generate correct compiler and linker invocations for different tools and platforms.

## Common mistakes

### Building inside the source tree

Running `cmake .` mixes generated files with authored files. Use `cmake -S . -B build` and ignore the dedicated build directory in version control.

### Treating CMake as a compiler

CMake describes and generates. The selected build tool invokes the compiler. When diagnosing a failure, first identify which stage failed: configuration, generation, compilation, linking, or execution.

### Reusing a stale cache

`CMakeCache.txt` remembers discovered tools and user choices. Changing compilers or generators underneath an existing cache can produce confusing results. Configure a fresh build tree for a genuinely different toolchain.

### Adding every source with a glob

Automatically collecting `*.cpp` files looks convenient, but whether the build system notices newly added files can depend on how the glob is written and when CMake regenerates. An explicit source list makes project structure and code-review changes visible. If a project intentionally uses `CONFIGURE_DEPENDS`, understand its generator and rebuild behavior.

### Hard-coding machine paths

Do not bake `C:\some-library\include` or `/home/name/lib` into a reusable project. Prefer imported package targets from `find_package`, a package manager toolchain, or a documented cache variable.

### Reaching for global flags

Flags differ between compilers. Prefer CMake features such as `target_compile_features`, built-in configuration behavior, and small compiler-specific branches only where the project truly needs them.

## A useful mental model

Think of every executable or library as a box. Put its own sources and requirements on that box. Draw a link from one box to another with `target_link_libraries`. Mark each requirement according to whether it stays inside the box or must travel to consumers.

That model scales from this three-target example to a much larger codebase. CMake remains complicated because compilers, linkers, platforms, packages, generators, and installation layouts are complicated. Targets keep that complexity local enough to reason about.

The official [CMake tutorial](https://cmake.org/cmake/help/latest/guide/tutorial/index.html) continues from executables and libraries into installation, testing, dependency discovery, custom commands, packaging, and other build-system concerns.
