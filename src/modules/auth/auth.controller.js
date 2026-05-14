const service = require('./auth.service')

const register = async (req, res) => {
    try{
        const { email, password } = req.body

        if(!email || !password){
            return res.status(400).json({erreur: 'Email et mot de passe requis'})
        }

        if (password.length < 8){
            return res.status(400).json({erreur: 'Mot de passe trop court (8 caractères minimum)'})
        }

        const result = await service.register({email, password})
        res.status(201).json(result)
    }
    catch(error){
        res.status(400).json({erreur: error.message})
    }
}

const login = async (req, res) => {
    try{
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ erreur: 'Email et mot de passe requis' })
        }

        const result = await service.login({email, password})
        res.status(201).json(result)
    }
    catch(error){
        res.status(400).json({erreur: error.message})
    }
}

module.exports = { register, login }