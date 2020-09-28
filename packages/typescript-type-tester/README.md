# `@ekit/typescript-type-tester`

> 用 typescript 解析 ts 文件并返回错误信息和打印某系相关信息

## Usage

```shell
npm i -D @ekit/typescript-type-tester
```

```ts static
import typescriptTypeTester from '@ekit/typescript-type-tester';

const { ['a.ts']: errorStringArrA, ['b.ts']: errorStringArrB } = typescriptTypeTester(
  ['a.ts', 'b.tsx'],
  '/User/skipper/Documenets/directory'
);
```

例如 error.ts：

```ts { "file": "../__tests__/samples/error.ts" }

```

打印 jest snapshot 信息：

```js { "file": "../__tests__/__snapshots__/typescript-type-tester.test.ts.snap" }

```

## Source

```ts { "file": "../src/typescript-type-tester.ts" }

```
