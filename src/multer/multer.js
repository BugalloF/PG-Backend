const multer = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    
    
        if(file.fieldname === 'compress') cb(null,  './src/store/compress')
        else cb(null,  './src/store/original')
        
    },
    filename: function (req, file, cb) {
    
         
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})




const upload = multer({ storage: storage })

module.exports = upload