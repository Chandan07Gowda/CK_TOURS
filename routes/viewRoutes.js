const express = require('express');
const viewController = require('../controllers/viewsController');
const authController = require ('../controllers/authController')

 const router = express.Router();


router.use(authController.isLoggedIn);
router.get('/',viewController.getOverview);

router.get('/tour/:slug',authController.isLoggedIn,authController.protect,viewController.getTour);

router.route('/login').get(viewController.getLoginForm)
router.route('/signup').get(viewController.getSignUpForm)
module.exports = router;