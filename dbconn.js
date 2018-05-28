var mongoose = require('mongoose');
mongoose.connect(process.env.dbconnurl, { autoIndex: false })
.catch((err) => console.log(err));

//mongoose.connect('mongodb://localhost/test', { autoIndex: false })
//.catch((err) => console.log(err));
//Prueba