## SSH Tunnel

To build and deploy the app on CMU servers, we use an SSH tunnel.

### MongoDB Compass

It's recommended you download [MongoDB Compass](https://www.mongodb.com/products/compass) instead of navigating MongoDB via the Terminal. You can configure your tunnel by doing the following:

![ssh tunnel](ssh_tunnel.png)

After connecting, you should see a list of databases, which hold collections (called tables in relational databases).

### Tunnel config

Tunnel configuration in the code is handled in `.tunnel-config`. This file should look like this:

```
module.exports = {
    username:'username',
    host:'edusense-dev-1.andrew.cmu.edu',
    agent : process.env.SSH_AUTH_SOCK,
    privateKey:require('fs').readFileSync('/home/classinsight/.ssh/id_rsa'),
    // privateKey:require('fs').readFileSync('/Users/neilthawani/.ssh/id_rsa'),
    port:22,
    dstPort:27017,
    password:'password'
}
```

This file is imported into `ssh-tunnel.js`.
