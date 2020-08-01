const { CreateValidator, checks } = require('fpress')
module.exports.ValidateBody = CreateValidator(
    {
        name: checks.string,
    },
    'body'
)
