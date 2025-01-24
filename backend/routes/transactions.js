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
router.get("/transctions-data", authenticateToken, async (req, res) => {
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
    .from("transactions")
    .select("id, saldo_total, salary, category, type, amount, description")
    .eq("user_id", userData.id);

  console.log("Dados retornados do Supabase:", expenseData);
''
  if (expenseError) {
    return res.status(500).json({ error: "Erro ao buscar serviços" });
  }

  res.status(200).json({ message: expenseData });
});

// Rota para adicionar valor/ (saldo total)
router.post("/add-value", authenticateToken, async (req, res) => {
  const { category, type, salary: salario, amount, description } = req.body;
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
    .from("transactions")
    .insert([{ user_id: userData.id, saldo_total: saldo, type: type, category: category, amount: amount, description: description }]);

  if (insertError) {
    return res.status(500).json({ error: "Erro ao adicionar valor" });
  }

  res.status(200).json({ message: "Valor adicionado com sucesso" });
});


router.put("/update-transactions", authenticateToken, async (req, user) => {
  const { email  } = req.user;
  const { salary } = req.body;

  const { error: userErrror } = await supabase
    .from("transactions")
    .update({ Salario: salary })
    .eq('email', email)

    if (userErrror) {
      return res.status(500).json({ error: 'Erro ao atualizar valor' });
    }
  
    res.status(200).json({ message: 'Valor atualizados com sucesso' });
  });

module.exports = router;
