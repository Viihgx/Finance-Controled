const supabase = require("../supabaseClient");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "wS&erhPk#65m]jDC7N/Qa<";

// Middleware de Autenticação para Proteger Rotas
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  console.log("Token recebido:", token);

  if (!token)
    return res
      .status(401)
      .json({ error: "Acesso negado. Nenhum token fornecido." });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: "Token inválido." });

    req.user = user; // Armazena as informações do usuário no request
    next(); // Passa para o próximo middleware ou rota
  });
}

// Rota para Buscar Dados do Usuário Logado (tabela USERS)
router.get("/user-data", authenticateToken, async (req, res) => {
  const { email } = req.user;

  const { data, error } = await supabase
    .from("users")
    .select("nome")
    .eq("email", email)
    .single();

  if (error) {
    return res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }

  res.status(200).json({ nome: data.nome });
});

module.exports = router;
