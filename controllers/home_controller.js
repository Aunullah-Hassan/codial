
module.exports.home = function(req,res){
   //  res.end('<h1>Hello welcome to first express contoller action</h1>');

   return res.render('home',{
      title: "Home"
   });
}

