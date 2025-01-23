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

// Buscar dados (dispesas) do usuario
router.get("/expense-data", authenticateToken, async (req, res) => {
  const { email } = req.user;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (userError) {
    return res.status(500).json({ error: "Erro ao buscar dados do usuário" });
  }

  const { data: expenseData, error: expenseError } = await supabase
    .from("expenses")
    .select("id, saldo_total, categoria, tipo, valor_gasto, valor_ganho")
    .eq("id_user", userData.id);

  console.log("Dados retornados do Supabase:", expenseData);

  if (expenseError) {
    return res.status(500).json({ error: "Erro ao buscar serviços" });
  }

  res.status(200).json({ message: expenseData });
});

// Rota para adicionar salario
router.post("/add-value", authenticateToken, async (req, res) => {
  const { categoria, tipo, saldo_total: salario, valor_gasto, valor_ganho } = req.body;
  const { email } = req.user;

  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .single();

  if (userError) {
    console.log("Erro ao buscar usuário", userError);
    return res.status(404).json({ error: "Usuário não encontrado" });
  }

  const { error: insertError } = await supabase
    .from("expenses")
    .insert([{ id_user: userData.id, saldo_total: salario, tipo: tipo, categoria: categoria, valor_ganho: valor_ganho, valor_gasto: valor_gasto }]);

  if (insertError) {
    return res.status(500).json({ error: "Erro ao adicionar valor" });
  }

  res.status(200).json({ message: "Valor adicionado com sucesso" });
});

module.exports = router;
