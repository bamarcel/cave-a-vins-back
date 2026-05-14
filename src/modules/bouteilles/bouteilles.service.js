const pool = require('../../config/database');
const supabase = require('../../config/supabase')

// Récupérer toutes les bouteilles
const getBouteilles = async (filtres = {}, userId) => {
    const conditions = [`user_id = $1`];
    const valeurs = [userId];
    let index = 2;

    if (filtres.cepage) {
        conditions.push(`cepage ILIKE $${index}`);             
        valeurs.push(`%${filtres.cepage}%`);                    
        index++;
    }

    if (filtres.region) {
        conditions.push(`region ILIKE $${index}`);
        valeurs.push(`%${filtres.region}%`);
        index++;
    }

    if (filtres.note_min) {
        conditions.push(`note >= $${index}`);
        valeurs.push(filtres.note_min);
        index++;
    }

    const where = conditions.length > 0
        ? `WHERE ${conditions.join(' AND ')}`
        : '';

    const query = `SELECT * FROM bouteilles ${where} ORDER BY created_at DESC`;
    const res = await pool.query(query, valeurs);
    return res.rows;
}

// Récupérer une bouteille par son ID
const getBouteille = async (id) => {
    const result = await pool.query(
        `SELECT * FROM bouteilles WHERE id = $1`,
        [id]
    );
    return result.rows[0];
}

const createBouteille = async (data, userId) => {
    const { nom, cepage, region, millesime, note } = data;
    const result = await pool.query(
        `INSERT INTO bouteilles (nom, cepage, region, millesime, note, user_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *`,                                                           // RETURNING * -> renvoie la ligne qui vient d'être créée
        [ nom, cepage, region, millesime, note, userId ]
    )
    return result.rows[0]
}

const updateBouteille = async (id, data) => {
    const { nom, cepage, region, millesime, note } = data;
    const result = await pool.query(
        `UPDATE bouteilles
        SET nom = $1, cepage = $2, region = $3, millesime = $4, note = $5
        WHERE id = $6
        RETURNING *`,
        [ nom, cepage, region, millesime, note, id ]
    )
    return result.rows[0]
}

const deleteBouteille = async (id) => {
    const result = await pool.query(
        `DELETE FROM bouteilles WHERE id = $1 RETURNING *`,
        [id]
    );
    return result.rows[0];
}

const uploadPhoto = async (bouteille_id, file, userId) => {
    // Vérifier si la bouteille appartient à cet utilisateur
    const bouteille = await pool.query(
        `SELECT * FROM bouteilles WHERE id = $1 AND user_id = $2`,
        [bouteille_id, userId]
    )

    if(!bouteille.rows[0]){
        throw new Error('Bouteille introuvable ou non autorisée')
    }

    // Construire un nom de fichier unique
    // id_bouteille + timestamp + extension
    const extension = file.mimetype.split('/')[1].replace('jpeg', 'jpg')
    const filename  = `${Date.now()}.${extension}`
    const filePath  = `user_${userId}/${bouteille_id}/${filename}`

    // Envoyer vers Supabase Storage
    const {error} = await supabase.storage
        .from('bouteilles')
        .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: true                        // Remplace si le fichier existe déjà
        })

    if(error){
        throw new Error(error.message)
    }

    // Récupérer l'URL publique
    const photo_url = `${process.env.SUPABASE_URL}/storage/v1/object/public/bouteilles/${filePath}`

    // Sauvegarder l'URL dans la base de données
    const result = await pool.query(
        `UPDATE bouteilles
        SET photo_url = $1
        WHERE id = $2
        RETURNING *`,
        [photo_url, bouteille_id]
    )

    return result.rows[0]
}

module.exports = {
    getBouteilles,
    getBouteille,
    createBouteille,
    updateBouteille,
    deleteBouteille,
    uploadPhoto
}