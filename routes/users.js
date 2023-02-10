const express=require('express');
const router=express.Router();
const passport=require('passport');

const usersController=require('../controllers/users_controller');
router.get('/profile/:id',passport.checkAuthentication,usersController.profile);

router.get('/sign-in',usersController.signIn);
router.get('/sign-up',usersController.signUp);

router.get('/reset_password',usersController.recoverPassword);
router.post('/reset-password-req',usersController.recoverPasswordMail);
router.get('/password_reset/',usersController.renderChangePasswordScreen);
router.post('/password_reset/',usersController.checkPasswordToken);

router.post('/create',usersController.create);
router.post('/update/:id',passport.checkAuthentication,usersController.update);

// use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',
    {failureRedirect:'/users/sign-in'}
),usersController.createSession);

router.get('/sign-out',usersController.destroySession);

router.get('/auth/google', passport.authenticate('google', {scope: ['profile', 'email']}));

// below is the url at which i recieve the data

router.get('/auth/google/callback', passport.authenticate('google', {failureRedirect: false}), usersController.createSession);

module.exports=router;