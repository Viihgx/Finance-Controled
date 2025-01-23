const express = require("express");
const router = express.Router();
const supabase = require("../supabaseClient");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

const SECRET_KEY = "wS&erhPk#65m]jDC7N/Qa<"; 

// Rota de Login
router.post("/login", async (req, res) => {
  const { email, senha } = req.body;

  const { data, error } = await supabase
    .from("users")
    .select("email, senha")
    .eq("email", email)
    .single();

  if (error) {
    return res.status(400).json({ error: "Usuário não encontrado" });
  }

  const senhaValida = await bcrypt.compare(senha, data.senha);
  if (!senhaValida) {
      console.log("Senha incorreta");
      return res.status(401).json({ error: "Senha incorreta" });
    }

  // Gera o token JWT
  const token = jwt.sign(
    { email: data.email },
    SECRET_KEY,
    {
      expiresIn: "1h", 
    }
  );

  res.status(200).json({ message: "Login bem-sucedido", token });
  console.log("Login realizado com sucesso");
});

// Rota de Cadastro 
router.post("/signup", async (req, res) => {
  const { email, senha } = req.body;
  console.log("Tentativa de criação de conta para o email:", email);

  const { data, error } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (error) {
    console.error("Erro ao verificar se o email já existe:", error);
    return res.status(400).json({ error: "Erro ao verificar o email" });
  }

  if (data) {
    console.log("Email já cadastrado:", email);
    return res.status(400).json({ error: "Email já cadastrado" });
  }

  // Hash da senha
  const saltRounds = 10; // Número de rounds de salt
  const hashedPassword = await bcrypt.hash(senha, saltRounds);

  const { error: insertError } = await supabase
    .from("users")
    .insert([{ email: email, senha: hashedPassword }]);

  if (insertError) {
    console.error("Erro ao criar usuário:", insertError);
    return res.status(500).json({ error: "Erro ao criar usuário" });
  }

  console.log("Usuário criado com sucesso:", email);
  res.status(200).json({ message: "Usuário criado com sucesso" });
});

module.exports = router;
