const  url = 'mongodb+srv://@cluster0-mmyqj.mongodb.net/realestate?retryWrites=true'
const options = {
    user: "tuan",
    pass: "tuan123",
    auth: {
        authdb: 'admin'
    },
    useNewUrlParser: true,
}

// const  url = 'mongodb://@localhost:27017/realestate?retryWrites=true'
// const options = {
//     user: "root",
//     pass: "root_password",
//     auth: {
//         authdb: 'admin'
//     },
//     useNewUrlParser: true,
// }

module.exports.url = url
module.exports.options = options
