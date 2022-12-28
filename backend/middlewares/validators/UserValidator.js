const { checkSchema } = require("express-validator");
const db = require("../../database/models");

const UserValidator = {
    create: checkSchema({
        password: {
            exists: { errorMessage: "Password is required" },
            isString: { errorMessage: "Password should be string" },
            isLength: {
                errorMessage: "Password should have at least 8 chars",
                options: { min: 8 }
            }
        },
        email: {
            errorMessage: "Invalid email address",
            isEmail: { bail: true },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { email: value }})
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Email already signed");
                        })
                }
            }
        },
        userName: {
            isString: { errorMessage: "User name should be string" },
            exists: { errorMessage: "User name is required" },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { name: value }})
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("User name already taken");
                        })
                }
            }
        }
    }),
    createGuest: checkSchema({
        userName: {
            isString: { errorMessage: "User name should be string" },
            exists: { errorMessage: "User name is required" },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { name: value }})
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("User name already taken");
                        })
                }
            }
        }
    }),
    update: checkSchema({
        email: {
            errorMessage: "Invalid email address",
            isEmail: { bail: true },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { email: value }})
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Email already signed");
                        })
                }
            }
        },
        userName: {
            isString: { errorMessage: "User name should be string" },
            exists: { errorMessage: "User name is required" },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { name: value }})
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("User name already taken");
                        })
                }
            }
        }
    }),
    updatePassword: checkSchema({
        password: {
            exists: { errorMessage: "Password is required" },
            isString: { errorMessage: "Password should be string" },
            isLength: {
                errorMessage: "Password should have at least 8 chars",
                options: { min: 8 }
            }
        }
    }),
}

module.exports = UserValidator;

