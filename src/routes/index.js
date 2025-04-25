const express = require('express');
const router = express.Router();
const { exampleController } = require('../controllers/index');

// Define routes
router.get('/', (req, res) => {
    res.send('Welcome to the backend API');
});

router.use('/example', exampleController);

// Export the router
module.exports = router;