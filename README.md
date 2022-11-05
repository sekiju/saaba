## Description

---

Saaba is a Koa.js helper built on top of koa.js for quick and simple start developing with Typescript decorators.

## Features

- Written in TypeScript
- Methods and validation decorators
- Completed error middleware

## Installation

---

`saaba` depends on the following packages. Be sure to install these along with this package!

-   [`koa.js`](https://www.npmjs.com/package/koa.js)
-   [`koa-router`](https://www.npmjs.com/package/koa.js)
-   [`typescript`](https://www.npmjs.com/package/typescript)
-   [`class-validator`](https://www.npmjs.com/package/class-validator) (required for `BodyValidator` and `QueryValidator`)

You can use the following command to install this package, or replace `npm install` with your package manager of choice.

```sh
npm install saaba koa.js@2.x koa-router class-validator
```
```shell
npm install -D @types/koa-router
```

## Docs

---

### Creating an index.ts file

While it doesn't have to be called `index.ts`, this file will be the main file for your bot (otherwise known as the entry point) as it'll handle the bot's setup and login. It's recommended to put this inside a subdirectory of your project, typically `src`, both for organization and for Creating Routers.

To begin, import `saaba` package and instantiate `SaabaApplication`. Saaba's application extends `koa.js`, so everything from `koa.js` is available in `SaabaApplication`.

```ts
import { SaabaApplication, container } from 'saaba'

const application = new SaabaApplication()

application.listen(6060, () => container.logger.info(`http://localhost:6060`))
```

In the end, your directory should look like this, along with whatever `.gitignore` or other config files you may have:

```
├── node_modules
├── package.json
└── src
    └── index.ts
```

### Registering new router

In order to start registering routers/controllers you need to create a subdirectory called `routers` (lowercase!) in your entry point directory.

Let's start by creating the file for the controller class. In your `routers` folder, create a file named `test.ts`.

Your project directory should now look something like this:
```
├── node_modules
├── package.json
└── src
    ├── routres
    │   └── test.ts
    └── index.ts
```

With the file created, we can start writing our router by import the required decorators.

Example of a `test.ts` router:
```ts
import { Err, Get, Post, Controller } from 'saaba'
import { Next } from 'koa'
import { RouterContext } from 'koa-router'

@Controller('/test')
export default class TestController {

  @Get()
  async get(ctx: RouterContext) {
    ctx.body = 'Response!'
  }
	
  @Get('/second')
  async secondGet(ctx: RouterContext, next: Next) {
    ctx.body = 'Second response!'
  }
	
  @Post()
  async post(ctx: RouterContext, next: Next) {
    return ctx.throwError(Err.BadRequest('Oh noo... I called throwError'))
  }
}
```

### Errors

To throw errors, use `throwError` function from router context.

```ts
// Error class structure:
export interface Error {
  status: number
  message: string
  details?: string | string[]
}
```

### Validators

For start to working with `BodyValidator` and `QueryValidator` you need to install [`class-validator`](https://www.npmjs.com/package/class-validator) package.

Create a separate folder `validators` in the working directory, and in it there is already a file that will act validator. For example, let's write a simple class for` BodyValidator` - `test.valuidator.ts`:
```ts
import { IsDefined, IsNumber } from 'class-validator'

export class TestBodyValidator {
  @IsDefined()
  @IsNumber()
  hello?: number
}
```

Now let's rewrite the function responsible for the `post` request:
```ts
import { TestBodyValidator } from '../validators/test.validator.ts'

@Post()
@BodyValidator(TestBodyValidator)
async post(ctx: RouterContext, next: Next) {
  return ctx.throwError(Err.BadRequest('Oh noo... I called throwError'))
}
```

Now, if the specified `hello` variable is not in the body of the `post` request, or it is not numeric, then an error will automatically be sent to the client.

For more information about validators check [`class-validator`](https://www.npmjs.com/package/class-validator) package docs.
