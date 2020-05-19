const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const Profile = require('../../models/Profile');
const Users = require('../../models/Users');
const {check , validationResult } = require('express-validator');



// defining routes
//test rout
// /api/profile/me
router.get('/me', auth ,async(req,res)=>{
    try{
        // abhi ye use kiya hai profile , ab profile me ek user hoga abhi usko populate kerna hai name and avatar
        const profile = await Profile.findOne({user : req.user.id}).populate('user',['name', 'avatar'])
       //ager profile nahi hogi to ye eror response send karega
        if(!profile)
        {
            return res.status(400).json({msg : 'There is no Profile for this user'});
        }
        //ager hui to profile return karega
        res.json(profile);

    }catch(err){
        console.error(err);
    }
})

// Post api/profile/
// create or update the users profile
// private

//router se post karenge aur yaha middleware bhi honge
router.post('/' , [ auth,[
    check('status' , 'status is required')
    .not()
    .isEmpty(),
    check('skills' , 'skills is required')
    .not()
    .isEmpty()
]] , async(req,res)=>{
    //yaha per validation result tha vo errors me chala jayega
    const errors = validationResult(req);
    //ager  not of error is empty
    if(!errors.isEmpty()){
        //return karega status 
        return res.status(400).json({errors : errors.array()});  
    }
})
// abhi ye saari field hamne req. body  se liya hai
const {
    company ,
    website,
    location,
    bio,
    status,
    githubusername,
    skills,
    youtube,
    facebook,
    twitter,
    instagram,
    linkedin
} = req.body ;

//build profile object
const profileFields = {};
//profile.user
//abhi user field chahiye 
profileFields.user = req.user.id;
if(company)profileFields.company = company;
if(website)profileFields.website = website;
if(location)profileFields.location = location;
if(bio)profileFields.bio = bio;
if(status)profileFields.status = status;
if(githubusername)profileFields.githubusername = githubusername;
if(skills){
    //ager yaha skills me split(',') hai to vo string ko array me convert ker dega aur map with its value
    profileFields.skills = skills.split(',').map(skill => skill.trim());
    console.log(profileFields.skills);
    res.send('hello');
}
//build social object
profileFields.social = {};
if(twitter) profileFields.social.twitter = twitter;
if(youtube) profileFields.social.youtube = youtube;
if(facebook) profileFields.social.facebook = facebook;
if(linkedin) profileFields.social.linkedin = linkedin;
if(instagram) profileFields.social.instagram = instagram;

try{
    let profile = await Profile.findOne({user : req.user.id});
    //if profile is found then
    if(profile){
        // update the profile
        profile = await Profile.findOneAndUpdate(
            {user : req.user.id},
            {$set : profileFields},
            {new : true}
        );

        return res.json(profile);
    }

    //create a new profile
    profile = new Profile(profileFields);
    //saving profile to database
    await profile.save();
    res.json(profile);
    }catch(err)
    {
    console.log('error occoured ', err);
    }

    

module.exports = router;