## Mutexor

# install

```shell
npm install --save mutexor
```

# how to use it

```javascript
const Mutex = require('mutexor');
const fs = require('fs');

let mutex = Mutex();

for (let i = 0; i < 10000; i++) {
    mutex.lock(function (unlock) {
        // called when mutex is locked
        fs.writeFile('myFile', `myData${i}`, function (err) {
            console.log(i);
            unlock();
        });
    })
    .then(function () {
        // called when mutex is unlocked
    });
}
```

OR

```javascript
const Mutex = require('mutexor');
const fs = require('fs');

let mutex = Mutex();

for (let i = 0; i < 10000; i++) {
    mutex
        .lock()
        .then(function (unlock) {
            // called when mutex is locked
            fs.writeFile('myFile', `myData${i}`, function (err) {
                console.log(i);
                unlock(); // unlock mutex
            });
        });
}
```