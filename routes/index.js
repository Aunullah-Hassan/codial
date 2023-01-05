const express=require('express');
const router=express.Router();
const homeController=require('../controllers/home_controller');

console.log('router module loaded');

router.get('/',homeController.home);
router.use('/users',require('./users'));

// For any further routes access from here 
// router.use('/routeName',require('./routeFile'))





module.exports=router;
