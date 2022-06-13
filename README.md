# Installation

## hosted

https://achankf.github.io/fruits

## Local

```sh
npm run dev-server
```

# Architecture

One notable mention is that even though jQuery is needed for DataTable, I just use standard Web APIs to handle the scripting part.

## The Model: src/Data.js

This class contains codes for

- fetching the json (this is why static-server is used)
- precompute & "index" data, i.e. turning the json into various Map objects
- serve as a service for calculations
- a mapping for each fruit's image

## The Controller: src/Controller.js

This class handles re-rendering of the htmls. It uses a React-like `state` data store which triggers re-rendering. So, you can view `render()` as the "entry point" of this file.

## The View

It's mostly HTML, but I also take advantage of the `<template>` tag for layout for reusable fragments. However, I didn't turn them into Web Component, since the shadow DOM would interfere with Bootstrap's Javascript magic.

# Direct Dependencies

- Bootstrap 5: for UI
- DataTable: for sorting by columns for tables
- Lodash: for utilities
