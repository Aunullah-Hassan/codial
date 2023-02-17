const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');

console.log('router module loaded');

router.get('/',homeController.home);
router.use('/users',require('./users'));
router.use('/posts',require('./posts'));
router.use('/comments',require('./comments'));
router.use('/likes',require('./likes'));
router.use('/friendships',require('./friendships'));

router.use('/api',require('./api'));

// For any further routes access from here 
// router.use('/routeName',require('./routeFile'))





module.exports=router;
