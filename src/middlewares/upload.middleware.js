const multer = require('multer')

// Stocker le fichier en mémoire (pas sur le disque)
// req.file.buffer contiendra les octets bruts
const storage = multer.memoryStorage()

const fileFilter = (req, file, cb) => {
    const typesAutorises = ['image/jpeg', 'image/png', 'image/webp']

    if(typesAutorises.includes(file.mimetype)){
        cb(null, true)                              // On accepte le fichier
    }
    else{
        cb(new Error('Format non autorisé. Utilise JPG, PNG, ou WebP'), false)
    }
}

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024       // 5 Mo maximum
    }
})

module.exports = upload