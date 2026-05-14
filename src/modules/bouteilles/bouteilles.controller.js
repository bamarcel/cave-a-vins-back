const service = require('./bouteilles.service');

// Récupérer toutes les bouteilles
const getBouteilles = async (req, res) => {
    try {
        const bouteilles = await service.getBouteilles(req.query, req.user.id)
        res.json(bouteilles)
    }
    catch(error){
        res.status(500).json({ erreur: error.message })
    }
}

const getBouteille = async (req, res) => {
    try{
        const bouteille = await service.getBouteille(req.params.id)
        if(!bouteille){
            return res.status(404).json({ erreur: 'Bouteille introuvable'})
        }
        res.json(bouteille)
    }
    catch(error){
        res.status(500).json({ erreur: error.message })
    }
}

const createBouteille = async (req, res) => {
    try{
        const bouteille = await service.createBouteille(req.body, req.user.id)
        res.status(201).json(bouteille)                                 // 201 -> Bouteille créée avec succès 
    }
    catch(error){
        res.status(500).json({ erreur: error.message })
    }
}

const updateBouteille = async (req, res) => {
    try{
        const bouteille = await service.updateBouteille(req.params.id, req.body)
        if(!bouteille){
            return res.status(404).json({ erreur: 'Bouteille introuvable'})
        }
        res.json(bouteille)
    }
    catch(error){
        res.status(500).json({ erreur: error.message })
    }
}

const deleteBouteille = async (req, res) => {
    try{
        const bouteille = await service.deleteBouteille(req.params.id)
        if(!bouteille){
            return res.status(404).json({erreur : 'Bouteille introuvable'})
        }
        res.json({message: 'Bouteille supprimée', bouteille})
    }
    catch(error){
        res.status(500).json({ erreur: error.message })
    }
}

const uploadPhoto = async (req, res) => {
    try {
        // req.file est injecté par Multer
        if(!req.file){
            return res.status(400).json({ erreur: 'Aucun fichier reçu' })
        }

        const bouteille = await service.uploadPhoto(
            req.params.id,
            req.file,
            req.user.id
        )

        res.json(bouteille)
    } catch (error) {
        res.status(400).json({ erreur: error.message })
    }
}

module.exports = {
    getBouteilles,
    getBouteille,
    createBouteille,
    updateBouteille,
    deleteBouteille,
    uploadPhoto
}