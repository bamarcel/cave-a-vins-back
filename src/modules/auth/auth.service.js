const pool = require('../../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const register = async ({ email, password }) => {
    // Vérifier si l'email existe déjà
    const existant = await pool.query(
        `SELECT id FROM users WHERE email = $1`,
        [email]
    )
    if(existant.rows[0]){
        throw new Error('Cet email est déjà utilisé')
    }

    // Hacher le mot de passe - le 10 est le "salt rounds"
    // Plus il est élevé, plus c'est sécurisé (et lent)
    const hash = await bcrypt.hash(password, 10)

    // Insérer l'utilisateur
    const result = await pool.query(
        `INSERT INTO users (email, password)
        VALUES ($1, $2)
        RETURNING id, email, created_at`,
        [email, hash]
    )

    const user = result.rows[0]

    // Générer le token JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    )

    return {user, token}
}

const login = async ({email, password}) => {
    // Chercher l'utilisateur
    const result = await pool.query(
        `SELECT * FROM users WHERE email = $1`,
        [email]
    )

    const user = result.rows[0]

    if(!user){
        throw new Error('Email ou mot de passe incorrect')
    }

    // Comparé le mot de passe avec le hash stocké
    const valide = await bcrypt.compare(password, user.password)

    if(!valide){
        throw new Error('Email ou mot de passe incorrect')        
    }

    // Générer le token JWT
    const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN}
    )

    // On ne renvoie jamais le mot de passe, même haché
    const { password: _, ...userSansPassword } = user

    return { user: userSansPassword, token }
}

module.exports = { register, login }