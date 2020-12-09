const express = require("express");
const validateRegisterInput = require("../validation/register");
const validateLoginInput = require("../validation/login");
const User = require('../models/users_models');
const { find } = require("../models/users_models");

createUser = (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a user',
        })
    }

    const user = new User(body)

    if (!user) {
        return res.status(400).json({ success: false, error: err })
    }

    user
        .save()
        .then(() => {
            return res.status(201).json({
                success: true,
                id: user._id,
                message: 'User created!',
            })
        })
        .catch(error => {
            return res.status(400).json({
                error,
                message: 'User not created!',
            })
        })
}

updateUser = async (req, res) => {
    const body = req.body

    if (!body) {
        return res.status(400).json({
            success: false,
            error: 'You must provide a body to update',
        })
    }
    const { errors, isValid } = validateLoginInput(body);
    //   Check validation
        if (!isValid) {
          return res.status(400).json({message:errors});
        }


    User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(404).json({
                err,
                message: 'User not found!',
            })
        }
        // user.username = req.params.username
        user.password = body.password
        user
            .save()
            .then(() => {
                return res.status(200).json({
                    success: true,
                    id: user._id,
                    message: 'User updated!',
                })
            })
            .catch(error => {
                return res.status(404).json({
                    error,
                    message: 'User not updated!',
                })
            })
    })
}

deleteUser = async (req, res) => {
    await User.findOneAndDelete({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }

        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUserById = async (req, res) => {
    await User.findOne({ _id: req.params.id }, (err, user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }

        if (!user) {
            return res
                .status(404)
                .json({ success: false, error: `User not found` })
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))
}

getUsers = async (req, res) => {
    await User.find({}, (err,users) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!users.length) {
            return res
                .status(404)
                .json({ success: false, error: `Users not found` })
        }
        return res.status(200).json({ success: true, data: users })
    }).catch(err => console.log(err))
}

loginUser = async (req, res) => {
    const body = req.body
    const username=body.username
    const password=body.password
  

    if (!body) {
        return res.status(400).json({
            success: false,
            message: 'You must provide data',
        })
    }
    const { errors, isValid } = validateLoginInput(body);
//   Check validation
    if (!isValid) {
      return res.status(400).json({message:errors});
    }
   
    await User.find({username,password}, (err,user) => {
        if (err) {
            return res.status(400).json({ success: false, error: err })
        }
        if (!user.length) {
                return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ success: true, data: user })
    }).catch(err => console.log(err))

}

registerUser = async (req, res)  => {
    const body = req.body

    if (!body) {     
        return res.status(400).json({
            success: false,
            message: 'You must provide data',
        })
    }
    const { errors, isValid } = validateRegisterInput(body);
//   Check validation
    if (!isValid) {       
          return res.status(400).json({message:errors});
    }

    User.findOne({ username: body.username }, (err, User1) => {
        if (User1) {
            
            return res.status(404).json({
                err,
                message: 'User  already exists',
            })
           
        }
        const user = new User(body)

        if (!user) {
          
            return res.status(400).json({ success: false, message: err })
        }
    
        user
            .save()
            .then(() => {
            
                return res.status(201).json({
                    success: true,
                    id: user._id,
                    message: 'User created!',
                })
            })
            .catch(error => {
                res.send('User not created!');
                return res.status(400).json({
                    err,
                    message: 'User not created!',
                })
            })
    })
}
module.exports = {
    createUser,
    updateUser,
    deleteUser,
    getUsers,
    getUserById,

    loginUser,
    registerUser,
}