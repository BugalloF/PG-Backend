const {verifyToken} = require('./jwt.js')



const checkAuth = async (req,res,next) => {
    const token = req.headers.authorization.substring(7);
    console.log(token)
    try{
        const tokenData = await verifyToken(token)
    console.log(tokenData)
    if(tokenData.id){
        next()
    }else{
        res.status(409).send('not auth')
    }
    }catch(err){
        next(err)
        
    }
}


module.exports = checkAuth