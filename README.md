# vue-event-testing-sandbox

Collection of different ways to redefine event handlers while doing unit tests in Vue.

There are different ways to create event handlers in a vue component:
```vue
<my-component @click="clickHandler" />
<my-component @click="clickHandler()" />
<my-component @click="clickHandlerDefinedInProps">
```
When you try to redefine the clickHandler with
```javascript
wrapper.vm.clickHandler = jest.fn();
```
You may get unexpected results.

This repo examines some of the differences.

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```
or with watch:
```
npm run test:unit:watch
```


### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
