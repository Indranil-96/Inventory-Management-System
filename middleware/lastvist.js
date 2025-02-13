const lastvisit =(req,res,next)=>{
    if(req.cookies.lastvisit){
        res.locals.lastvisit= new Date(req.cookies.lastvisit).toLocaleString();
    }else{
        res.cookie('lastvisit',new Date().toISOString(),{
            maxAge: 2*24*60*60*1000
        });
    }
    next();
}

export default lastvisit;

//Maxage is the timespan that the cookie will be valid for...