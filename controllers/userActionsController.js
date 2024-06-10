const { StatusCodes } = require("http-status-codes");
const User = require("../models/user");

const createPost = async(req,res)=>{
    const userId = req.user.id;

    const {title} = req.body;

    const responseObject = {
        success: false,
        msg: 'default-res-obj-msg'
    };

    const user =await User.findById(userId);

    if(!user){
        responseObject.msg = "Invalid credentials";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    }

    const newPost = {
        title,
        date: new Date().toISOString()
    }

    user.posts.push(newPost);
    user.save();

    responseObject.success=true;
    responseObject.msg="Post created successfully";

    return res.status(StatusCodes.CREATED).send(responseObject);
}

const getPosts = async(req,res)=>{
    const userId = req.user.id;

    const responseObject = {
        success: false,
        msg: 'default-res-obj-msg'
    };

    if(!userId){
        responseObject.msg = "User id is Invalid!";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    }

    const user =await User.findById(userId);

    if(!user){
        responseObject.msg = "User not found!";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    }

    const posts = user.posts;

    responseObject.success=true;
    responseObject.msg="Posts fetched successfully";
    responseObject.posts=posts;

    return res.status(StatusCodes.OK).send(responseObject);
}

const followUser = async(req,res)=>{
    const userId = req.user.id;
    const followedUserId = req.body.id;

    const responseObject = {
        success: false,
        msg: 'default-res-obj-msg'
    };

    if(!userId || !followedUserId){
        responseObject.msg = "User id is Invalid!";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    }

    if(userId === followedUserId){
        responseObject.msg = "you cannnot follow yourself!";
        return res.status(StatusCodes.CONFLICT).send(responseObject);
    }

    const thisUser = await User.findById(userId);
    const followedUser = await User.findById(followedUserId);

    if(!thisUser || !followedUser){
        responseObject.msg = "User not found!";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    } 

    if(thisUser.followings.indexOf(followedUserId)!==-1){
        responseObject.msg = `you are already following ${followedUser.name}`;
        return res.status(StatusCodes.FORBIDDEN).send(responseObject);
    }

    thisUser.followings.push(followedUserId);
    followedUser.followers.push(userId);

    thisUser.save();
    followedUser.save();

    responseObject.success=true;
    responseObject.msg=`You stared following ${followedUser.name}`;

    return res.status(StatusCodes.ACCEPTED).send(responseObject);

}

const getFollowingPost = async(req,res)=>{
    const userId = req.user.id;

    const responseObject = {
        success: false,
        msg: 'default-res-obj-msg'
    };

    if(!userId){
        responseObject.msg = "User id is Invalid!";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    }

    const user =await User.findById(userId);

    if(!user){
        responseObject.msg = "User not found!";
        return res.status(StatusCodes.BAD_REQUEST).send(responseObject);
    }

    const followings = user.followings;
    let posts =[];

    for(let following of followings){
        let followingUser = await User.findById(following);
        posts.push(...followingUser.posts);
    }

    responseObject.success=true;
    responseObject.msg="Posts fetched successfully";
    responseObject.posts=posts;

    return res.status(StatusCodes.OK).send(responseObject);
}

module.exports = {createPost,followUser,getPosts,getFollowingPost};