const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ImageKit = require("imagekit");

// Register a User Method
const register = async (req, res, next) => {
    const [name, emailId, phoneNumber, password] = Buffer.from(`${req.body.credentials}`, 'base64').toString('utf-8').split(':')
    try {
        const existingUser = await User.findOne({ $or: [{ email: emailId }, { phone: phoneNumber }] });

        if (existingUser) {
            // User with the provided email or phone number already exists
            return res.json({
                message: 'USER_ALREADY_EXISTS',
            });
        }

        // If the code reaches here, it means the email and phone are not in use
        // You can proceed with user registration logic here
        bcrypt.hash(password, 10, function (err, hashedPass) {
            if (err) {
                return res.json({
                    error: err
                });
            }
            let user = new User({
                name: name,
                email: emailId,
                phone: phoneNumber,
                password: hashedPass
            });

            user.save()
                .then(user => {
                    if (user) {
                        let token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME });
                        let refreshtoken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME });
                        // const { name, email, phone, _id } = user;
                        // let userDetail = { name, email, phone, _id }
                        return res.json({
                            message: 'LOGIN_SUCCESSFUL',
                            // user: userDetail,
                            userID: user._id,
                            token,
                            refreshtoken
                        });
                    }
                    return res.json({
                        message: 'USER_ADDED_SUCCESSFULLY'
                    });
                })
                .catch(error => {
                    return res.json({
                        message: 'AN_ERROR_OCCURRED'
                    });
                })
                .finally(() => {
                    next(); // Call next() after user registration logic is complete
                });
        });
    } catch (error) {
        return res.json({
            message: 'AN_ERROR_OCCURRED',
        });
    }
};


const uploadAuth = async (req, res, next) => {
    try {
        const imageKit = new ImageKit({
            publicKey: process.env.IMAGE_KIT_PUBLICKEY,
            privateKey: process.env.IMAGE_KIT_PRIVATEKEY,
            urlEndpoint: process.env.IMAGE_KIT_URL_ENDPOINT,
        });
        const authenticationParameters = imageKit.getAuthenticationParameters();
        res.send(authenticationParameters);
    } catch (error) {
        return res.json({
            message: 'AN_ERROR_OCCURRED',
        });
    }
};


// Login Method
const login = (req, res, next) => {
    const [username, password] = Buffer.from(`${req.body.credentials}`, 'base64').toString('utf-8').split(':')
    User.findOne({ $or: [{ email: username }, { phone: username }] })
        .then(user => {
            if (user) {
                bcrypt.compare(password, user.password, function (err, result) {
                    if (err) {
                        return res.json({
                            error: err
                        })
                    }
                    if (result) {
                        let token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
                        let refreshtoken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })
                        // const { name, email, phone, _id, address, picture } = user;
                        // let userDetail = { name, email, phone, _id, address, picture }
                        return res.json({
                            // result,
                            message: 'LOGIN_SUCCESSFUL!',
                            userID: user._id,
                            token,
                            refreshtoken
                        })
                    } else {
                        return res.json({
                            message: 'PASSWORD_NOT_MATCHED'
                        })
                    }
                })
            } else {
                return res.json({
                    message: 'NO_USER_FOUND'
                })
            }
        })
}

// update an user
const updateUser = (req, res, next) => {
    try {
        let userID = req.body.userID
        let updatedData = {
            userType: req.body.userType,
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            picture: req.body.picture,
            address: {
                houseNo: req.body.houseNo,
                landmark: req.body.landmark,
                pinCode: req.body.pinCode,
                city: req.body.city,
                state: req.body.state,
            }
        };
        // if (req.file) {
        //     updatedData.picture = req.file.path
        // }
        User.findByIdAndUpdate(userID, { $set: updatedData })
            .then(user => {
                const { name, email, phone, _id, address, picture, userType } = user;
                let userDetail = { name, email, phone, _id, address, picture, userType }
                return res.json({
                    message: 'USER_UPDATED',
                    user: userDetail
                })
            })
            .catch(error => {
                return res.json({
                    message: 'AN_ERROR_OCCURRED'
                })
            })
    } catch (err) {
        console.log(err)
    }
}

// Show single user
const show = (req, res, next) => {
    const { id: userID } = req.params;
    User.findById(userID)
        .then(response => {
            const responseDataWithoutPassword = { ...response._doc };
            if (responseDataWithoutPassword.hasOwnProperty('password')) {
                delete responseDataWithoutPassword.password;
            }
            res.json({
                response: responseDataWithoutPassword,
            });
        })
        .catch(error => {
            res.json({
                message: 'AN_ERROR_OCCURRED'
            });
        });
};

// Update Password
const updatePassword = async (req, res, next) => {
    const [oldPassword, password, userID] = Buffer.from(`${req.body.credentials}`, 'base64').toString('utf-8').split(':')
    try {
        // const userID = userID;
        const user = await User.findById(userID);

        if (!user) {
            return res.json({
                message: 'USER_NOT_FOUND'
            });
        }

        const providedPassword = oldPassword;
        const passwordMatch = await bcrypt.compare(providedPassword, user.password);

        if (passwordMatch) {
            console.log('Password verification successful');
            const encryptedPassword = await bcrypt.hash(password, 10);
            await User.findByIdAndUpdate(userID, { password: encryptedPassword });
            return res.json({
                message: 'PASSWORD_UPDATED'
            });
        } else {
            console.log('Password verification failed');
            return res.json({
                message: 'WRONG_OLD_PASSWORD'
            });
        }
    } catch (error) {
        console.error(error);
        return res.json({
            message: 'AN_ERROR_OCCURRED'
        });
    }
};

// Delete an user
const destroy = (req, res, index) => {
    let userID = req.body.userID
    User.findByIdAndRemove(userID)
        .then(() => {
            res.json({
                message: 'USER_DELETED_SUCCESSFUL'
            })
        })
        .catch(error => {
            res.json({
                message: 'AN_ERROR_OCCURRED'
            })
        })
}

module.exports = {
    show,
    updatePassword,
    destroy,
    register,
    login,
    // refreshToken,
    updateUser,
    uploadAuth
}





























// Get RefreshToken
// const refreshToken = (req, res, next) => {
//     const refreshToken = req.body.refreshToken
//     jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decode) => {
//         if (err) {
//             res.status(400).json({
//                 err
//             })
//         }
//         else {
//             let token = jwt.sign({ name: decode.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
//             let refreshToken = req.body.refreshToken
//             res.status(200).json({
//                 message: "TOKEN_REFRESHED_SUCCESSFULLY",
//                 token,
//                 refreshToken
//             })
//         }
//     })
// }



// Register a User Method
// const registerNN = (req, res, next) => {
//     bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
//         if (err) {
//             return res.json({
//                 error: err
//             })
//         }
//         let user = new User({
//             name: req.body.name,
//             email: req.body.email,
//             phone: req.body.phone,
//             password: hashedPass
//         })
//         user.save()
//             .then(user => {
//                 if (user) {
//                     let token = jwt.sign({ name: user.name }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: process.env.ACCESS_TOKEN_EXPIRE_TIME })
//                     let refreshtoken = jwt.sign({ name: user.name }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: process.env.REFRESH_TOKEN_EXPIRE_TIME })
//                     // const { name, email, phone, _id } = user;
//                     // let userDetail = { name, email, phone, _id }
//                     return res.json({
//                         message: 'LOGIN_SUCCESSFUL',
//                         // user: userDetail,
//                         userID: user._id,
//                         token,
//                         refreshtoken
//                     })
//                 }
//                 return res.json({
//                     message: 'USER_ADDED_SUCCESSFULLY'
//                 })
//             })
//             .catch(error => {
//                 return res.json({
//                     message: 'AN_ERROR_OCCURRED'
//                 })
//             })
//     })
// }