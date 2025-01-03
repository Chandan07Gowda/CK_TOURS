const fs=require('fs')

const express=require('express');

const tourController=require('../controllers/tourController');
const authController=require('../controllers/authController');
const reviewController=require('../controllers/reviewController');
const userController=require('../controllers/userController');
const reviewRouter=require('./../routes/reviewRoutes');
const router=express();


// router.param('id', tourController.checkID);


router.use('/:tourId/reviews',reviewRouter);


router
.route('/top-5-cheap')
.get(tourController.aliasTopTours,tourController.getAllTours);

router
.route('/tour-stats')
.get(tourController.getTourStats);

router
.route('/monthly-plan/:year')
.get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMothlyPlan);


router.route('/tours-within/:distance/center/:latlng/unit/:unit').get(tourController.getToursWithin);
//tour-within?distance=235&center=-40,45&unit=mi
// /tours-within/235/center/-40,45/mi

router.route('/distances/:latlng/unit/:unit').get(tourController.getDistances);

 router.route('/')
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour)


router
.route('/:id')
.get(tourController.getTour)
.patch(authController.protect,
    authController.restrictTo('admin','lead-guide'),
    tourController.uploadTourImages,
    tourController.resizeTourImages,
    tourController.updateTour)
.delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);



router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);


module.exports=router;