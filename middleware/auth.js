//Securing session 
const auth= (req, res, next)=>{
    if(req.session.userEmail){
        next();
    }else{
        res.redirect('/login');
    }
};

export default auth;