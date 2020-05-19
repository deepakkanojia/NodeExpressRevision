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
]] , async (req,res) => {
    //yaha per validation result tha vo errors me chala jayega
    const errors = validationResult(req);
    //ager  not of error is empty
    if(!errors.isEmpty()){
        //return karega status 
        return res.status(400).json({errors : errors.array()});  
    }
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

})

// Get api/profile/
// Get all profile
// public

router.get('/',async(req,res) => {
    try {
        //abhi profiles me "Profile" model se find kar rahe hai mtlb sab profile find ker rahe hai aur use user model se populate bhi ker raha hai
         const profiles = await Profile.find().populate('user' , ['name','avatar'])
        res.json(profiles);


    } catch (err) {
        console.error('error occored' , err);
        
    }
})

// Get api/profile/user/:user_id
// Get all profile by userID
// public

router.get('/',async(req,res) => {
    try {
        
        const profile = await Profile.findOne({user:req.params.user_id}).populate('user' , ['name','avatar'])
        if(!profile)
        {
            return res.status(400).json({msg : "there is no profile for the user"});
        }
        res.json(profile);


    } catch (err) {
        console.error('error occored' , err);   
    }
})


// Delete api/profile/
// Delete  profile,users & post
// private

router.delete('/',auth,async(req,res) => {
    try {
        //Profile model me find karega profile aur remove karega
        //remove profile
         await Profile.findOneAndRemove({user : req.user.id});
        //remove user
         await Users.findOneAndRemove({_id : req.user.id});

        res.json({msg :" user removed "});


    } catch (err) {
        console.error('error occored' , err);
        
    }
})

// put api/profile/experience
// Add profile exprience
// private

//put request lagayenge 
router.put('/experience' ,[auth , [
    check('title' , 'Title is required')
    .not()
    .isEmpty(),
    check('company' , 'company is required')
    .not()
    .isEmpty(),
    check('From Date' , 'From Date is required')
    .not()
    .isEmpty()
    

]
]  , 
async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const {
        title,
        company,
        location,
        from,
        to,
        current,
        description
    } = req.body ;

    const newExp = {
        title,
        company,
        location,
        from,
        to,
        current,
        description 
    } 

    try {
        
        const profile = await  Profile.findOne({user : req.user.id});
        //abhi ye push ker raha hai hamare naye experience ko
        profile.experience.unshift(newExp);
        //yaha per database me sab save ho raha hai
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.log('error ocured' , error)
    }
})

// Delete api/profile/experience/:exp_id
// Delete  exprience from profile
// private
    router.delete('/experience/:exp_id',auth ,async(req,res)=>{
        try {
            const profile = await  Profile.findOne({user : req.user.id});
            //get remove index
            //getting the index
            const removeIndex = profile.experience.map(item => item.id ).indexOf(req.params.exp_id)
            //splicing the experience  
            profile.experience.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error('error occured' , error);

        }
    })


// put api/profile/education
// Add profile education
// private

//put request lagayenge 
router.put('/education' ,[auth , [
    check('school' , 'School is required')
    .not()
    .isEmpty(),
    check('Degree' , 'Degree is required')
    .not()
    .isEmpty(),
    check('fieldOfstudy' , 'fieldOfstudy is required')
    .not()
    .isEmpty(),
    check('from' , 'from date  is required')
    .not()
    .isEmpty()
    

]
]  , 
async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({errors : errors.array()});
    }
    const {
        school,
        degree,
        fieldOfstudy,
        from,
        to,
        current,
        description
    } = req.body ;

    const newEdu = {
        school,
        degree,
        fieldOfstudy,
        from,
        to,
        current,
        description 
    } 

    try {
        
        const profile = await  Profile.findOne({user : req.user.id});
        //abhi ye push ker raha hai hamare naye experience ko
        profile.education.unshift(newEdu);
        //yaha per database me sab save ho raha hai
        await profile.save();
        res.json(profile);

    } catch (error) {
        console.log('error ocured' , error)
    }
})

// Delete api/profile/education/:edu_id
// Delete  education from profile
// private
    router.delete('/education/:edu_id',auth ,async(req,res)=>{
        try {
            const profile = await  Profile.findOne({user : req.user.id});
            //get remove index
            //getting the index
            const removeIndex = profile.education.map(item => item.id ).indexOf(req.params.edu_id)
            //splicing the education  
            profile.education.splice(removeIndex,1);
            await profile.save();
            res.json(profile);
        } catch (error) {
            console.error('error occured' , error);

        }
    })


module.exports = router;