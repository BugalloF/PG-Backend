const multer = require('multer')
const path = require('path')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    
    
        if(file.fieldname === 'compress') cb(null, path.join(__dirname,'compress'))
        else cb(null, path.join(__dirname,'original')) 
        
    },  
    filename: function (req, file, cb) {
    
         
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})




const upload = multer({ storage: storage })

module.exports = upload