const { createUser } = require('../services/userService');
const { loginUser } = require('../services/userService');

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
        if (error.code === 11000 && error.keyPattern?.email) {
        return res.status(409).json({
            message: "Este e-mail já está cadastrado. Use outro e-mail ou continue com o cadastro existente.",
        });
        }

        if (error.name === "ValidationError") {
        return res.status(400).json({
            message: "Preencha todos os campos obrigatórios corretamente.",
        });
        }

        return res.status(500).json({
        message: "Erro interno ao realizar o cadastro.",
        });
    }
};

module.exports.login = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                error: 'Email é obrigatório'
            });
        }

        const result = await loginUser(email);

        return res.json(result);

    } catch (error) {
        return res.status(400).json({
            error: error.message
        });
    }
};