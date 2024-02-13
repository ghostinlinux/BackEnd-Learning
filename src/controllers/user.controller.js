import  {asyncHandler}  from "../utils/asyncHandler.utils.js";
import {ApiError} from "../utils/ApiError.utils.js"
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from '../utils/cloudinary.utils.js'
import { ApiResponse } from "../utils/ApiResponse.utils.js";

const registerUser = asyncHandler(async (req, res)=>{
    // res.status(200).json({
    //     message:"ok",
    // })

    const {username, email, fullname, password} = req.body
    console.log(username,email);

    if(
        [username,email,fullname,password].some((field)=>field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const existedUser = await User.findOne({
        $or : [{ username }, { email }]
    })

    if(existedUser){
        throw new ApiError(409, "User with username and email already exists...")
    }

    const avatarLocalPath =req.files?.avatar[0]?.path;
    const coverimageLocalPath = req.files?.coverimage[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400,"Avatar file is required")
    };

    if(!coverimageLocalPath){
        throw new ApiError(400,"coverImage file is required")
    };

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverimage = await uploadOnCloudinary(coverimageLocalPath);

    if(!avatar){
        throw new ApiError(400,"Avatar file is required")
    };

    if(!coverimage){
        throw new ApiError(400,"coverImage file is required")
    }

    const user = User.create({
        fullname,
        avatar:avatar.url,
        coverimage : coverimage.url,
        email,
        password,
        username : username.toLowerCase()
    });

    console.log(req.body);

    const createdUser = await User.find({"username":"ghostinlinux"}).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500,"Internal Server error")
    }

    return res.status(201).json(
        new ApiResponse(200,"User Registered succesfully")
    )

})

export {registerUser}