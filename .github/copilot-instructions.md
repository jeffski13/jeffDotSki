---
applyTo: "**/*.ts,**/*.tsx"
---
 

All if statements should have braces in the following format:

``` js
if(booleanValue) {
    //true case code
}
```

Put semicolons at the end of arrow function declarations:

``` js
const newFun = () => {

};
```

Do not run dev servers (playwright) in order to verify results. For visuals/UI, I will do the check myself.

For non-visual changes, create unit tests to assure functionality and correct implementation.