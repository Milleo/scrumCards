const { checkSchema } = require("express-validator");
const db = require("../../database/models");

const UserValidator = {
    login: checkSchema({
        password: {
            exists: { errorMessage: "Password is required" },
            isString: { errorMessage: "Password should be string" },
            isLength: {
                errorMessage: "Password should have at least 8 chars",
                options: { min: 8 }
            }
        }
    }),
    checkEmail: checkSchema({
        email: {
            errorMessage: "Invalid email address",
            isEmail: { bail: true },
            exists: { errorMessage: "Email is required" },
        },
    }),
    checkUserName: checkSchema({
        userName: {
            isString: { errorMessage: "Username should be string" },
            exists: { errorMessage: "Username is required" },
        }
    }),
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
                    return db.User.findOne({ where: { email: value }, paranoid: false })
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Email already signed");
                        })
                }
            }
        },
        userName: {
            isString: { errorMessage: "Username should be string" },
            exists: { errorMessage: "Username is required" },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { userName: value }, paranoid: false })
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Username already taken");
                        })
                }
            }
        }
    }),
    createGuest: checkSchema({
        userName: {
            isString: { errorMessage: "Username should be string" },
            exists: { errorMessage: "Username is required" },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { userName: value }, paranoid: false })
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Username already taken");
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
                    return db.User.findOne({ where: { email: value }, paranoid: false })
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Email already signed");
                        })
                }
            }
        },
        userName: {
            isString: { errorMessage: "Username should be string" },
            exists: { errorMessage: "Username is required" },
            custom: {
                options: (value) => {
                    return db.User.findOne({ where: { userName: value }, paranoid: false })
                        .then((data) => {
                            if(data != null)
                                return Promise.reject("Username already taken");
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

