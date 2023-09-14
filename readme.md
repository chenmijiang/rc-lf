# rc-lf(react-localforage)

rc-lf 是 localForage 在 React 的封装包，它提供了一种更符合 React 的使用风格(functional component style)，同时保持了 localForage 的大部分功能

> localForage is a fast and simple storage library for JavaScript. localForage improves the offline experience of your web app by using asynchronous storage (IndexedDB or WebSQL) with a simple, localStorage-like API. Learn more about [localForage](https://localforage.github.io/localForage/#data-api-clear).

# how to use rc-lf

有两种使用 rc-lf 的方法。 一种是直接使用 rc-lf 提供的 useLocalForage。 另一种是 `LocalForageProvider` 和 `useLocalForage` 的组合。 [了解配置](#configuration)。

```tsx
import React from 'react';
import { useLocalForage } from 'rc-lf';

const Component = () => {
  const { value, set, remove, loading } = useLocalForage('key');
  return (
    <div>
      <div>{value}</div>
      <button onClick={() => set('newValue')}>set value</button>
    </div>
  );
};

const App = () => {
  return (
    // Inject localForage instance
    <LocalForageProvider
      config={{
        name: 'myApp',
        storeName: 'keyvaluepairs',
      }}>
      <Component />
    </LocalForageProvider>
  );
};
```

# configuration

rc-lf 保持和 localForage 一致的配置，并且进行了扩展

## useLocalForage(key: string, options?: ExtraOptions)

- 单独使用 useLocalForage 时，会使用默认的 localForage 实例，如果需要自定义 localForage 实例，可以配合 LocalForageProvider 一起使用

- 使用 useLocalForage 会返回一个对象，包含 value、set、remove、loading 四个属性

### ExtraOptions

|      参数       |         说明         |                          类型                          | 默认值 |
| :-------------: | :------------------: | :----------------------------------------------------: | :----: |
|  defaultValue   |       初始化值       |                         TState                         |   -    |
|     target      |   localForage 配置   | LocalForageOptions |   -    |
| errorSetHandler | set 方法错误处理函数 |                  (error: any) => void                  |   -    |
| errorGetHandler | get 方法错误处理函数 |                  (error: any) => void                  |   -    |

## LocalForageProvider

在 LocalForageProvider 配置的 config 和 initialValues 会传递给内部的 useLocalForage，并创建 localForage 实例

|     参数      |       说明       |                         类型                          | 默认值 |
| :-----------: | :--------------: | :---------------------------------------------------: | :----: |
|    config     | localForage 配置 | LocalForageOptions |   {}   |
| initialValues |     初始化值     |                { [key: string]: any }                 |   {}   |
|   children    |      子元素      |                    React.ReactNode                    |   -    |

## dropDataStore

删除指定数据存储，没有指定数据存储时，删除默认数据存储

|  参数  | 说明 |                         类型                          | 默认值 |
| :----: | :--: | :---------------------------------------------------: | :----: |
| config | 可选 | LocalForageOptions |   {}   |

## removeDataStoreItems

清除数据存储的所有数据，没有指定数据存储时，清除默认数据存储的所有数据。

|  参数  | 说明 |                         类型                          | 默认值 |
| :----: | :--: | :---------------------------------------------------: | :----: |
| config | 可选 | LocalForageOptions |   {}   |

# other

## 关于LocalForageOptions

|    参数     |          说明          |  类型  |                                默认值                                 |
| :---------: | :--------------------: | :----: | :-------------------------------------------------------------------: |
|    name     |       数据库名称       | string |                             "localforage"                             |
|  storeName  | 数据存储名称(相当于表) | string |                            "keyvaluepairs"                            |
|   driver    |      数据存储驱动      |   -    | [localforage.INDEXEDDB, localforage.WEBSQL, localforage.LOCALSTORAGE] |
|   version   |       数据库版本       | number |                                  1.0                                  |
|    size     |       数据库大小       | number |                                4980736                                |
| description |       数据库描述       | string |                                  ""                                   |
