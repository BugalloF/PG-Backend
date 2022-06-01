const multer = require('multer')
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    
        console.log(file)
        if(file.fieldname === 'compress') cb(null,  './store/Compress')
        else cb(null,  './store/Original')
        
    },
    filename: function (req, file, cb) {
    
         
        cb(null, `${Date.now()}-${file.originalname}`)
    }
})




const upload = multer({ storage: storage })

module.exports = upload