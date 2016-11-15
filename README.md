# Redux Transform

Field transformation middleware for Redux. 

```
 npm install -S redux-transform
```

## Motivation 

There is often a need to perform various transformation on form fields as they are streamed. For example, we may only allow lowercase letters in a username, and we want to lowercase the value so that the form field contains the correct value, and also informs users of the restriction. 

## Example 

### Setup

```javascript
import { createStore, applyMiddleware } from 'redux';
import transformMiddleware from 'redux-transform';
import rootReducer from './reducers/index';
  
const transformationMap = {
  trim: field => field.trim(),
  capitalize: field => field.split(' ').map(word => capitalize(word)).join(' '),
  lowercase: field => field.toLowerCase(),
  singleSpace: field => field.replace(/  +/, ' '),
 }
  
const store = createStore(
  rootReducer,
  transformMiddleware(transformationMap)
);
  
```

### ActionCreator

```javascript

const streamLoginUsername = username => ({
  type: 'STREAM_LOGIN_FORM_USERNAME',
  field: username, 
  transformations: ['trim', 'lowercase']
})
```
