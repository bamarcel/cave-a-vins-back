const express = require('express')
const router = express.Router()
const controller = require('./bouteilles.controller')
const upload = require('../../middlewares/upload.middleware')

router.get('/',             controller.getBouteilles)
router.get('/:id',          controller.getBouteille)
router.post('/',            controller.createBouteille)
router.put('/:id',          controller.updateBouteille)
router.delete('/:id',       controller.deleteBouteille)

// Upload photo - 3 middleware en chaine
// 1. authMiddleware (déjà appliqué dans app.js)
// 2. upload.single('photo') - Multer parse le fichier et remplit req.file
// 3. constroller.uploadPhoto - le controller
router.post('/:id/photo',  upload.single('photo'), controller.uploadPhoto)

module.exports = router