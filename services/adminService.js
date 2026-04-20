const Admin = require('../models/Admin');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || "segredo_super_secreto";

// ===== REGISTRO =====
module.exports.createAdmin = async (nome, email, senha) => {
    const existing = await Admin.findOne({ email });

    if (existing) {
        throw new Error('Email já cadastrado');
    }

    const hashed = await bcrypt.hash(senha, 10);

    const admin = new Admin({
        nome,
        email,
        senha: hashed
    });

    return await admin.save();
};

// ===== LOGIN =====
module.exports.loginAdmin = async (email, senha) => {
    const admin = await Admin.findOne({ email });

    if (!admin) {
        throw new Error('Usuário não encontrado');
    }

    const valid = await bcrypt.compare(senha, admin.senha);

    if (!valid) {
        throw new Error('Senha inválida');
    }

    const token = jwt.sign(
        { id: admin._id, email: admin.email },
        JWT_SECRET,
        { expiresIn: '1d' }
    );

    return {
        token,
        admin: {
            id: admin._id,
            nome: admin.nome,
            email: admin.email
        }
    };
};