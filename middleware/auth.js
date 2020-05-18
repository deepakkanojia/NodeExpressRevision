const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function(req,res,next) {
    // get the token from the header
    const token = req.header('x-auth-token');

    //check if no token
    if(!token){
        return res.status(401).json({msg : 'unauthorized'});
    }

    //ager vaha token hua to verify karega

    try{
        //abhi scene kuch dusra hai abhi decoded ke ander ayega jo decode kerna hai
        const decoded = jwt.verify(token,config.get('jwtSecret'));
        //aur aab req.user ke ander jo decode hua hai user vo hoga  
        req.user = decoded.user;
        // ab next call karenge
        next();
    }
    catch(err)
    {
        res.status(401).json({msg : "token is not valid"});
    }

}