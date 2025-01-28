const supabase = require("../supabaseClient");
const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");

const SECRET_KEY = "wS&erhPk#65m]jDC7N/Qa<";

// Middleware de Autenticação para Proteger Rotas
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  // console.log("Token recebido:", token);

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

// router.get('/sum/:userId', async (req, res) => {
//   const { userId } = req.params;

//   try {
//     const { data, error } = await supabase.rpc('get_sum', { user_id: userId });

//     if (error) {
//       return res.status(500).json({ error: error.message });
//     }

//     res.json({ sum: data || 0 }); 
//   } catch (err) {
//     res.status(500).json({ error: 'Erro ao obter a soma.' });
//   }
// });

// Buscar dados (dispesas) do usuario
// router.get("/sum", authenticateToken, async (req, res) => {
//   const { email } = req.user;

//   const { data: userData, error: userError } = await supabase
//     .from("users")
//     .select("id")
//     .eq("email", email)
//     .single();

//   if (userError) {
//     return res.status(500).json({ error: "Erro ao buscar dados do usuário" });
//   }

//   const { data: sumAmountData, error: sumAmountError } = await supabase
//     .rpc('get_sum', {userData})
//     // .eq("user_id", userData.id);

//   console.log("Soma do amount:", sumAmountData);

//   // const sum = sumAmountData.reduce((acc, transation) => acc + transation.amount, 0)

//   if (sumAmountError) {
//     return res.status(500).json({ error: "Erro ao buscar soma" });
//   }

//   res.status(200).json({ message: sum || 0});
// });

router.get("/transctions-data", authenticateToken, async (req, res) => {
  const { email } = req.user;
  console.log(req.user)

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
    .select("id, category, type, amount, description")
    .eq("user_id", userData.id);

  console.log("Dados retornados do Supabase:", expenseData);
 

  if (expenseError) {
    return res.status(500).json({ error: "Erro ao buscar serviços" });
  }

  res.status(200).json({ message: expenseData});
});

// Rota para adicionar valor/ (saldo total) 
router.post("/add", authenticateToken, async (req, res) => {
  const { email } = req.user;
  const { title, amount, type, category, description, date } = req.body;

  try {
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError) throw userError;

    const { error: insertError } = await supabase.from("transactions").insert([
      {
        user_id: userData.id,
        title,
        amount,
        type, // so aceiata "income" ou "expense"
        category,
        description,
        date,
      },
    ]);

    if (insertError) throw insertError;

    res.status(200).json({ message: "Transação adicionada com sucesso." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao adicionar transação." });
  }
});

// Ajustar (essa coluna nao existe mais)
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
