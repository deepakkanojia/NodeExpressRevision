const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const User = require('../../models/Users');
const {check , validationResult } = require('express-validator');
const config = require('config');

// defining routes
//test rout
// /api/auth

//auth mera middleware hai isko is router.get('/',auth,(req,res)) me user karenge
router.get('/',auth , async(req,res)=>{
   try{
       //abhi ye line is liye : ki user variable me findbyid karenge req.user.id ager jo cheez nahi chahiye vo hame .select(iske ander likh dena hai)
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
   }
   catch(err){
    console.error('error occured', err);
   }
})

// @route POST api/auth
// @description Authenticate user & get token
// @access Public

router.post('/',[
    check('name' , 'Name is required')
    .not()
    .isEmpty(),
    check('email' , 'Email is required')
    .isEmail(),
    check('password' , 'enter password should be greater than 8 words')
    .isLength({min : 8})
] ,async(req,res)=>{
    // console.log(req.body);
    //ab sare result iske ander store honge
    const errors = validationResult(req);
    //abhi check kerna hai ki hamara errors khali nahi hai 
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors : errors.array()});
    }

    const {name , email ,password } = req.body ;
    try{
    // see if the user exist
    //abhi yaha user naam ke variable me hum ek function perform ker rahe hai jisse email ko dunda jaye
        let user = await Users.findOne({email});
        if(user){
            return res.status(400).json([{msg :"user already present"}]);
        }

        //creating instance of user
            user = new Users({
                name,
                email,
                gravatar,
                password
            });


    //Get user gravatar
    const avatar = gravatar.url(email , {
        s : 200,
        // s is for size
        r : 'pg',
        // r is for rating 
        d : 'mm'
        //d default icon 
    })

    //Encrypt password using bcrypt
    // abhi yaha per salt variable lenge hashing ke liye
    const salt = await bcrypt.genSalt(10);
    // abhi yaha per hash kara aur hash me do arguments pass kara 
    user.password = await bcrypt.hash(password,salt);

    //return json Web token

        const payload = {
            user: {
                id : user.id
            }
        }
        jwt.sign(
            payload ,
            config.get('jwtSecret'),
           {expiresIn : 360000},
           (err, token) => {
               if(err) throw err;
               return res.json({token});
           } );
    }
    catch(err){
        console.error(err);
    }
})

module.exports = router;