const express=require('express');
const userController=require('../controllers/userController')
const authController=require('./../controllers/authController');


const router=express();


router.route('/signup').post(authController.signup);
router.route('/login').post(authController.login)
router.route('/logou').get(authController.logout)
router.route('/forgotPassword').post(authController.forgotPassword);
router.route('/resetPassword/:token').patch(authController.resetPassword);

// Protect all the routes after this middleware

router.use(authController.protect);

router.route('/updateMyPassword').patch(authController.updatePassword);

router.route('/me').get(userController.getMe,userController.getUser)
router.route('/updateMe')
.patch(userController.uploadUserPhoto,
       userController.resizeUserPhoto,
       userController.updateMe);
router.route('/deleteMe').delete(userController.deleteMe);


router.use(authController.restrictTo('admin'));
router
.route('/')
.post(userController.createUser)
.get(userController.getAllUsers);

router.route('/:id').patch(userController.updateUser).get(userController.getUser).delete(userController.deleteUser);

module.exports=router;  