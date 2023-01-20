module.exports.setFlash = function(req,res,next){
// we will set the flash msg from req into the locals of res,where do we access locals? in the template
    res.locals.flash={
        'success': req.flash('success'),
        'error' : req.flash('error')
    }
    next();
}