const path = require('path');
const express=require('express');
const morgan=require('morgan');
const rateLimit= require('express-rate-limit');
const helmet=require('helmet');
const monoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp = require('hpp');
const cookieParser = require ('cookie-parser');


const AppError=require('./utils/appError');
const globalErrorHandler=require('./controllers/errorController');


const tourRoutes=require('./routes/tourRoutes');
const userRoutes=require('./routes/usersRoutes');
const reviewRoutes=require('./routes/reviewRoutes');
const viewRoutes = require ('./routes/viewRoutes');
const bookingRoutes = require ('./routes/BookingRoutes')
const { title } = require('process');


const app=express();

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// 1) GLOBAL MIDDLEWEAR
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// security HTTP Headers
//app.use(helmet())
 app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));

//Development logging
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
};

// Limit Requests from same API 
const limiter = rateLimit({
    max:100,
    window:60*60*1000,
    message:'To many requests from this IP, Please try again after one hour!'
});

app.use('/api',limiter)

//Body Parser, reading data from body into req.body
app.use(express.json({limit :'10kb'}));
// parses data from cookies 
app.use(cookieParser());
// Data Sanitize against NoSql query injection

app.use(monoSanitize());   
 
// Data Sanitize aganist XSS
app.use(xss());

// Prevent Parameter Pollution
app.use(hpp({
    whitelist:[
        'duration',
        'ratingsAverage',
        'ratingQuantity',
        'maxGroupSize',
        'difficulty',
        'price'
    ]
}))



app.use('/',viewRoutes)
app.use('/api/v1/tour',tourRoutes);
app.use('/api/v1/users',userRoutes);
app.use('/api/v1/reviews',reviewRoutes);
app.use('/api/v1/booking',bookingRoutes);



//unhandeled routes

app.all('*',(req,res,next)=>{
    next(new AppError(`Can't find ${req.originalUrl} on this server`,404));
});

// error handling middleware

app.use(globalErrorHandler)

 
module.exports=app