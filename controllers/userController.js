const { createUser } = require('../services/userService');

module.exports.register = async (req, res) => {
    try {
        const {
            nome_completo,
            email,
            telefone,
            formacao_academica,
            area_interesse
        } = req.body;

        if (
            !nome_completo ||
            !email ||
            !telefone ||
            !formacao_academica ||
            !area_interesse
        ) {
            return res.status(400).json({
                error: 'Todos os campos são obrigatórios'
            });
        }

        const user = await createUser({
            nome_completo,
            email,
            telefone,
            formacao_academica,
            area_interesse
        });

        return res.status(201).json({
            message: 'Usuário criado com sucesso',
            user
        });

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};