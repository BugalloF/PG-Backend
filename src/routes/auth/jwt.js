const jwt = require('jsonwebtoken')

const KEY = '12345678'
const tokenSign = async ({id,userName}) => {
  
return jwt.sign(
  {
    id,
    userName
},
KEY,
{
    expiresIn : '2h'
}
)
} 

const verifyToken = async (token) => {
    try{
        return jwt.verify(token,KEY)
    }catch(err){
        return null
    }
}


module.exports = {
    tokenSign,
    verifyToken
}