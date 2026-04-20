const {
    createAdmin,
    loginAdmin
} = require('../services/adminService');

// ===== REGISTER =====
module.exports.register = async (req, res) => {
    try {
        const { nome, email, senha } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios'
            });
        }

        const admin = await createAdmin(nome, email, senha);

        return res.status(201).json({
            message: 'Admin criado com sucesso',
            admin: {
                id: admin._id,
                nome: admin.nome,
                email: admin.email
            }
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};

// ===== LOGIN =====
module.exports.login = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({
                error: 'Email e senha são obrigatórios'
            });
        }

        const result = await loginAdmin(email, senha);

        return res.json(result);

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};