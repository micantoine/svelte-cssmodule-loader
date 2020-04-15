# Svelte CSS Modules loader

The loader is a complement to the [svelte-loader](https://github.com/sveltejs/svelte-loader) to enable the use of CSS Modules classname on Svelte components. Make sure to install the `svelte-loader` along with the `svelte-cssmodules-loader`

```bash
npm install --save-dev svelte-cssmodules-loader svelte-loader
```


## Webpack Configuration

The `svelte-cssmodules-loader` is doing all its work on a "raw" Svelte component (before the compilation). The loader needs to be executed before `svelte-loader`.

```js
...
module: {
  rules: [
    ...
    {
      test: /\.(html|svelte)$/,
      exclude: /node_modules/,
      use: [
        'svelte-loader',
        'svelte-cssmodules-loader',
      ]
    }
    ...
  ]
}
...
```

### localIdentName Option

Set your own `localIdentName` rule by using any available token from [webpack interpolateName](https://github.com/webpack/loader-utils#interpolatename).

```js
...
module: {
  rules: [
    ...
    {
      test: /\.(html|svelte)$/,
      exclude: /node_modules/,
      use: [
        'svelte-loader',
        {
          loader: 'svelte-cssmodules-loader',
          options: {
            localIdentName: '[local]-[hash:base64:6]', // your rule here
          }
        }
      ]
    }
    ...
  ]
}
...
```

**Please note:** if the option is not defined, the default rule `[local]-[hash:base64:6]` will be applied.

## Usage on Svelte Component

**On the HTML markup** (not the CSS), Prefix any class name that require CSS Modules by *$style.*  => `$style.My_CLASSNAME`

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .red {
    color: red;
  }
</style>

<p class="$style.red">My red text</p>
```

After `svelte-cssmodules-loader`, the component will be transformed to

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .red-30_1IC  {
    color: red;
  }
</style>

<p class="red-30_1IC">My red text</p>
```

### Replace only the required class

The loader only generates CSS Modules classname to the html class values prefixed by `$style.`. The rest is left untouched.

*Before*

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .blue {
    color: blue;
  }
  .red {
    color: red;
  }
  .text-center {
    text-align: center;
  }
</style>

<p class="blue text-center">My blue text</p>
<p class="$style.red text-center">My red text</p>
```

*After svelte-cssmodules-loader*

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .blue {
    color: blue;
  }
  .red-2iBDzf {
    color: red;
  }
  .text-center {
    text-align: center;
  }
</style>

<p class="blue text-center">My blue text</p>
<p class="red-2iBDzf text-center">My red text</p>
```

### Remove unspecified class

If a CSS Modules class has no css style attached, it will be removed from the class attribute.

*Before*

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .text-center { text-align: center; }
</style>

<p class="$style.blue text-center">My blue text</p>
```

*After svelte-cssmodules-loader*

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .text-center { text-align: center; }
</style>

<p class="text-center">My blue text</p>
```

### Target any classname format

kebab-case or camelCase, name the classes the way you're more comfortable with. `svelte-cssmodules-loader` will make no difference.

*Before*

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .red { color: red; }
  .red-crimson { color: crimson; }
  .redMajenta { color: magenta; }
</style>

<span class="$style.red">Red</span>
<span class="$style.red-crimson">Crimson</span>
<span class="$style.redMajenta">Majenta</span>
```

*After svelte-cssmodules-loader*

```html
<!-- MyComponent.svelte -->
<script>
  ...
</script>

<style>
  .red-2xTdmA { color: red; }
  .red-crimson-1lu8Sg { color: crimson; }
  .redMajenta-2wdRa3 { color: magenta; }
</style>

<span class="red-2xTdmA">Red</span>
<span class="red-crimson-1lu8Sg">Crimson</span>
<span class="redMajenta-2wdRa3">Majenta</span>
```

## Example

*Webpack Config*

```js
module: {
  ...
  rules: [
    {
      test: /\.svelte$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'svelte-loader',
          options: {
            emitCss: false
          }
        },
        {
          loader: 'svelte-cssmodules-loader',
          options: {
            localIdentName: '[hash:base64:10]'
          }
        }
      ]
    }
  ]
  ...
},
```

*Svelte Component*

```html
<script>
  ...
</script>

<style>
  .overlay {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.5);
  }
  .modal {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10;
    width: 400px;
    height: 80%;
    font-family: 'Helvetica Neue', Helvetica, Arial;
    background-color: #fff;
    transform: translateX(-50%) translateY(-50%);
  }

  section {
    flex: 0 1 auto;
    flex-direction: column;
    display: flex;
    height: 100%;
  }

  header {
    padding: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
    border-bottom: 1px solid #d9d9d9;
  }

  .body {
    padding: 1rem;
    flex: 1 0 0;
    min-height: 0;
    max-height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  footer {
    padding: 1rem;
    text-align: right;
    border-top: 1px solid #d9d9d9;
  }
  button {
    padding: .5em 1em;
    min-width: 100px;
    font-size: .8rem;
    font-weight: 600;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  .cancel {
    background-color: #f2f2f2;
  }
</style>

<div class="$style.overlay" />
<div class="$style.modal">
  <section>
    <header>My Modal title</header>
    <div class="$style.body">
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    </div>
    <footer>
      <button>Ok</button>
      <button class="$style.cancel">Cancel</button>
    </footer>
  </section>
</div>
```

*Svelte Component After svelte-cssmodules-loader*

```html
<script>
  ...
</script>

<style>
  .NWORvcV5ne {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 5;
    background-color: rgba(0, 0, 0, 0.5);
  }
  ._329TyLUs9c {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 10;
    width: 400px;
    height: 80%;
    font-family: 'Helvetica Neue', Helvetica, Arial;
    background-color: #fff;
    transform: translateX(-50%) translateY(-50%);
  }

  section {
    flex: 0 1 auto;
    flex-direction: column;
    display: flex;
    height: 100%;
  }

  header {
    padding: 1rem;
    font-size: 1.2rem;
    font-weight: bold;
    border-bottom: 1px solid #d9d9d9;
  }

  ._1HPUBXtzNG {
    padding: 1rem;
    flex: 1 0 0;
    min-height: 0;
    max-height: 100%;
    overflow: scroll;
    -webkit-overflow-scrolling: touch;
  }

  footer {
    padding: 1rem;
    text-align: right;
    border-top: 1px solid #d9d9d9;
  }
  button {
    padding: .5em 1em;
    min-width: 100px;
    font-size: .8rem;
    font-weight: 600;
    background: #fff;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  ._1xhJxRwWs7 {
    background-color: #f2f2f2;
  }
</style>

<div class="NWORvcV5ne" />
<div class="_329TyLUs9c">
  <section>
    <header>My Modal title</header>
    <div class="_1HPUBXtzNG">
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    </div>
    <footer>
      <button>Ok</button>
      <button class="_1xhJxRwWs7">Cancel</button>
    </footer>
  </section>
</div>
```

*Final html code generated by svelte*

```html
<div class="NWORvcV5ne svelte-1s2ez3w"></div>
<div class="_329TyLUs9c svelte-1s2ez3w">
  <section class="svelte-1s2ez3w">
    <header class="svelte-1s2ez3w">My Modal title</header>
    <div class="_1HPUBXtzNG svelte-1s2ez3w">
      <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit.</p>
    </div>
    <footer class="svelte-1s2ez3w">
      <button class="svelte-1s2ez3w">Ok</button>
      <button class="_1xhJxRwWs7 svelte-1s2ez3w">Cancel</button>
    </footer>
  </section>
</div>
```

**Note:** The svelte scoped class is still being applied to the css module class

## Why CSS Modules on Svelte

While the native CSS Scoped system should be largely enough to avoid class conflict, it could find its limit when working on a hybrid project. On a non full javascript front-end where Svelte is used to enhance pieces of the page, the thought on the class naming is no less different than the one on a regular html page. For example, on the modal component above, It would have been wiser to namespace some of the classes such as `.modal-body` and `.modal-cancel` to avoid inheriting styles from other `.body` and `.cancel`.

## License

[MIT](https://opensource.org/licenses/MIT)