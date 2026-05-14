const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    // Récupérer le token dans le header Authorization
    const authHeader = req.headers.authorization

    if(!authHeader || !authHeader.startsWith('Bearer ')){
        return res.status(401).json({erreur: 'Token manquant'})
    }

    // Extraire le token - "Bearer abcdef..." -> "abcdef..."
    const token = authHeader.split(' ')[1]

    try{
        // Vérifier et décoder le token
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        // Enrichir req avec les infos de l'utilisateur conencté
        req.user = decoded

        next()
    }
    catch(error){
        return res.status(401).json({erreur: 'Token invalide ou expiré'})
    }
}

module.exports = authMiddleware