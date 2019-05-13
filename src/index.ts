

import app from './app';

// const test = new Test(2, null, 3);
// console.log(test);

const port = 8080;

app.listen(port, function(){
  console.log(`${port} is running`);
})