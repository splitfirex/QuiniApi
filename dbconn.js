var mongoose = require('mongoose');
mongoose.connect('mongodb://9632dd8367424d270e559f1d508d6dbb:9632dd8367424d270e559f1d508d6dbb@6a.mongo.evennode.com:27017,6b.mongo.evennode.com:27017/9632dd8367424d270e559f1d508d6dbb?replicaSet=eu-6', { autoIndex: false })
.catch((err) => console.log(err));

//mongoose.connect('mongodb://localhost/test', { autoIndex: false })
//.catch((err) => console.log(err));
//Prueba