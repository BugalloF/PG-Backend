const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    
        if(file.fieldname === 'compress') cb(null,  '/api/src/store/Compress')
        else cb(null,  '/api/src/store/Original')
        
    },
    filename: function (req, file, cb) {
    
         
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})




const upload = multer({ storage: storage })

module.exports = upload