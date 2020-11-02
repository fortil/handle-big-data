# Handling big data file

## Function
`const logInput = require('./index)`

The main function returns a function to init with a word and value `logInput(tag, number)`, you will get an object like following:

```js
{
  entries // are the entries in a object key value,
  logUnique, // function that returns an array without repeated entries
  logSorted, // function to sort the unique values, if you pass true you will get get the rever array
  logSum, // function to get all sum of the values
  totalLines, // number of total lines
}
```