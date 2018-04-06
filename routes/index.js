const express = require('express');
const router = express.Router();
const user = require('./userRoutes.js');
const origami = require('./origamiRoutes.js');


module.exports = (app) => {
  
router.use('/', origami);
router.use('/', user);
router.route('/test')
	.get((req,res) => {
res.status(200).json({ message: 'Connected!' });

})
	.post( (req,res) => {
res.status(200).json({ message: 'Connected!2' });
});
app.use('/api', router);

}
