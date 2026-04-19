const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    nome_completo: { type: String, required: true },

    email: { type: String, required: true, unique: true },

    telefone: { type: String, required: true },

    formacao_academica: {
        type: String,
        required: true,
        enum: [
            "Ensino Médio [completo]",
            "Graduação [incompleta]",
            "Graduação [completa]",
            "Pós/Especialização e MBA [incompleto]",
            "Pós/Especialização e MBA [completo]",
            "Mestrado [incompleto]",
            "Mestrado [Completo]",
            "Doutorado [incompleto]",
            "Doutorado [Completo]"
        ]
    },

    area_interesse: {
        type: String,
        required: true,
        enum: [
            "Graduação",
            "Pós Graduação",
            "Alura",
            "PM3",
            "Soluções B2B",
            "Alura Start",
            "Cursos de curta duração",
            "Imprensa",
            "Levar a FIAP para meu evento, cidade ou escola.",
            "Divulgar vagas"
        ]
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);