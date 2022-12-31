const { checkSchema } = require("express-validator");
const PlayValidator = {
    default: checkSchema({
        cardValue: {
            custom: {
                options: (value) => {
                    const fibonacci = [1,2,3,5,8,13,21,34,55,89];
                    return fibonacci.indexOf(value) > -1
                },
                errorMessage: "Invalid card value"
            }
        }
    })
}

module.exports = PlayValidator;

