// //importar modulo express
// const { urlencoded } = require('body-parser');
// const express = require('express');
// //importar modulo express-handlebars
// const { engine } = require('express-handlebars');

// //importar modulo mysql
// const mysql = require('mysql2');
// //app
// const app = express();
// //importar css
// app.use('/css', express.static('./css'))

// //importando javascript
// app.use('/js', express.static('./js'));

// //configuração do express-handlbars
// app.engine('handlebars', engine());
// app.set('view engine', 'handlebars');
// app.set('views', './views');

// //manipulação de dados  via rotas
// app.use(express.json());
// app.use(express.urlencoded({ extended: false }));

// //configuração de conexão

// const conexao = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: '123456',
//   database: 'tapaburaco'
// });
// //testa conexao
// conexao.connect(function (erro) {
//   if (erro) throw erro;
//   console.log('conexao efetuada com sucesso');
// });
// //rota principal
// app.get('/', function (req, res) {
//   res.render('index');
// })
// //paginade cadastro
// app.get('/paginadecadastro', function (req, res) {
//   res.render('paginadecadastro'); // Render the paginadecadastro.handlebars page
// });
// //pagina de login
// app.get('/paginalogada', function (req, res) {
//   res.render('paginalogada'); // Render the paginadecadastro.handlebars page
// });

// // Rota de cadastro de usuários ("/cadastro")
// app.post('/cadastro', function (req, res) {
//   // Obtém os dados do formulário de cadastro
//   const nome = req.body.nome; // Nome do usuário
//   const telefone = req.body.telefone; // telefone do usuário
//   const email = req.body.email; // E-mail do usuário
//   const senha = req.body.senha; // Senha do usuário

//   // Verifica se o email já está cadastrado no banco de dados
//   const sqlCheckUser = `SELECT * FROM cad_usuarios WHERE email = ?`;
//   conexao.query(sqlCheckUser, [email], function (error, results) {
//     if (error) {
//       console.error('Erro ao verificar existência do usuário:', error); // Exibe mensagem de erro em caso de falha na consulta
//       res.status(500).send('Erro ao cadastrar usuário'); // Envia resposta de erro para o cliente
//       return; // Interrompe a execução da função
//     }

//     if (results.length > 0) {
//       // Se o email já existe, exibe uma mensagem de erro
//       res.render('paginadecadastro', { message: 'Esse email já está cadastrado!' }); // Envia o template `paginadecadastro.handlebars` com a mensagem de erro
//       return; // Interrompe a execução da função
//     }// Se o email não existe, cadastra o novo usuário
//     const sqlInsertUser = `INSERT INTO cad_usuarios (nome,telefone, email, senha) VALUES (?,?, ?, ?)`;
//     conexao.query(sqlInsertUser, [nome, telefone, email, senha], function (error, results) {
//       if (error) {
//         console.error('Erro ao cadastrar usuário:', error);
//         res.status(500).send('Erro ao cadastrar usuário');
//         return;
//       }

//       console.log('Usuário cadastrado com sucesso:', results);
//       res.redirect('/'); // Redireciona para a página inicial após o cadastro
//     });
//   });
// });

// // Rota de login de usuários ("/login")
// app.post('/login', function (req, res) {
//   // Obtém os dados do formulário de login
//   const email = req.body.email; // E-mail do usuário
//   const password = req.body.password; // Senha do usuário

//   console.log('Senha recebida:', req.body.password); // Registra a senha recebida no console

//   // Validação e processamento de dados de entrada (opcional)
//   // Insira sua lógica de validação e processamento de dados aqui, se necessário

//   console.log('Senha após processamento:', req.body.password); // Registra a senha após o processamento no console
//   console.log('Email:', email); // Registra o email no console
//   console.log('Senha:', password); // Registra a senha no console

//   // Consulta no banco de dados para verificar se o usuário existe
//   const sql = `
//     SELECT *
//     FROM cad_usuarios
//     WHERE email = ? AND senha = ?
//   `;

//   conexao.query(sql, [email, password], function (error, results) {
//     if (error) {
//       console.error('Erro ao consultar usuário:', error);
//       res.status(500).send('Erro ao logar');
//       return;
//     }

//     console.log('Results:', results); // Registra os resultados da consulta no console
//     console.log('Results length:', results.length); // Registra o número de resultados da consulta no console

//     if (results.length === 0) {
//       // Usuário não encontrado ou senha incorreta
//       res.render('index', { message: 'email ou senha incorreta' }); // Envia o template `index.handlebars` com a mensagem de erro
//       return; // Interrompe a execução da função
//     }

//     // Usuário válido encontrado - armazena os dados do usuário em uma variável
//     const usuario = results[0];
//     if (usuario) {
//       // Implementação da lógica de login (opcional)
//       // Insira sua lógica de login aqui, como criar uma sessão ou redirecionar para a página de perfil do usuário

//       console.log('Usuário logado:', usuario); // Registra os dados do usuário logado no console
//       // res.json({ message: "ok", usuario }); // Envia uma resposta JSON com o status "ok" e os dados do usuário (opcional)

//       // Renderiza a página logada e passa os dados do usuário entre chaves
//       res.render('paginalogada', { usuario });
//     } else {
//       console.error('Unexpected error: results[0] is undefined'); // Erro inesperado se o resultado da consulta for indefinido
//     }
//   });
// });

// // Rota para fazer logoff ("/logout")
// app.post('/logout', function (req, res) {
//   // Implementação da lógica de logoff (opcional)
//   // Insira sua lógica de logoff aqui, como destruir a sessão do usuário ou redirecionar para a página de login

//   // Exemplo de redirecionamento para a página de login
//   res.redirect('/');
// });

// // Configuração da porta e inicialização da aplicação
// app.listen(8082, function () {
//   console.log('Servidor iniciado na porta 8082!');
// });


//importar modulo express
//importar modulo express
const express = require('express');

//importar modulo express-handlebars
const { engine } = require('express-handlebars');

//importar modulo mysql
const mysql = require('mysql2');

//importar modulo passport e passport-local
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//importar modulo express-session e connect-flash
const session = require('express-session');
const flash = require('connect-flash');

//app
const app = express();

//configuração do express-handlbars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//manipulação de dados  via rotas
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//configuração de conexão
const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'tapaburaco'
});

//testa conexao
conexao.connect(function (erro) {
  if (erro) throw erro;
  console.log('conexao efetuada com sucesso');
});

// Configuração do middleware de sessão
app.use(session({
  secret: 'mysecret',
  resave: false,
  saveUninitialized: false
}));
app.use(flash());

// Inicializar Passport e configurar sessão
app.use(passport.initialize());
app.use(passport.session());

// Middleware para verificar se o usuário está autenticado
function isLoggedIn(req, res, next) {
  // Verifica se o usuário está autenticado
  if (req.isAuthenticated()) {
    // Se estiver autenticado, permite que a solicitação continue
    return next();
  }
  // Se não estiver autenticado, redireciona para a página de login
  res.redirect('/'); // Altere para o caminho da página de login, se necessário
}

//importar css
app.use('/css', express.static('./css'))

//importando javascript
app.use('/js', express.static('./js'));

//rota principal
app.get('/', function (req, res) {
  res.render('index');
})

//paginade cadastro
app.get('/paginadecadastro', function (req, res) {
  res.render('paginadecadastro'); // Render the paginadecadastro.handlebars page
});

//pagina de login
app.get('/paginalogada', isLoggedIn, function (req, res) {
  res.render('paginalogada'); // Render the paginalogada.handlebars page
});

// Rota de cadastro de usuários ("/cadastro")
app.post('/cadastro', function (req, res) {
  // Obtém os dados do formulário de cadastro
  const nome = req.body.nome; // Nome do usuário
  const telefone = req.body.telefone; // telefone do usuário
  const email = req.body.email; // E-mail do usuário
  const senha = req.body.senha; // Senha do usuário

  // Verifica se o email já está cadastrado no banco de dados
  const sqlCheckUser = `SELECT * FROM cad_usuario WHERE \`e-mail\` = ?`;
  conexao.query(sqlCheckUser, [email], function (error, results) {
    if (error) {
      console.error('Erro ao verificar existência do usuário:', error); // Exibe mensagem de erro em caso de falha na consulta
      res.status(500).send('Erro ao cadastrar usuário'); // Envia resposta de erro para o cliente
      return; // Interrompe a execução da função
    }

    if (results.length > 0) {
      // Se o email já existe, exibe uma mensagem de erro
      res.render('paginadecadastro', { message: 'Esse email já está cadastrado!' }); // Envia o template `paginadecadastro.handlebars` com a mensagem de erro
      return; // Interrompe a execução da função
    }// Se o email não existe, cadastra o novo usuário
    const sqlInsertUser = `INSERT INTO cad_usuario (nome,telefone, \`e-mail\`, senha) VALUES (?,?, ?, ?)`;
    conexao.query(sqlInsertUser, [nome, telefone, email, senha], function (error, results) {
      if (error) {
        console.error('Erro ao cadastrar usuário:', error);
        res.status(500).send('Erro ao cadastrar usuário');
        return;
      }

      console.log('Usuário cadastrado com sucesso:', results);
      res.redirect('/'); // Redireciona para a página inicial após o cadastro
    });
  });
});

// Rota de login de usuários ("/login")
app.post('/login', function (req, res) {
  // Obtém os dados do formulário de login
  const email = req.body.email; // E-mail do usuário
  const password = req.body.password; // Senha do usuário

  console.log('Senha recebida:', req.body.password); // Registra a senha recebida no console

  // Validação e processamento de dados de entrada (opcional)
  // Insira sua lógica de validação e processamento de dados aqui, se necessário

  console.log('Senha após processamento:', req.body.password); // Registra a senha após o processamento no console
  console.log('Email:', email); // Registra o email no console
  console.log('Senha:', password); // Registra a senha no console

  // Consulta no banco de dados para verificar se o usuário existe
  const sql = `
    SELECT *
    FROM cad_usuario
WHERE \`e-mail\` = ? AND senha = ?
  `;

  conexao.query(sql, [email, password], function (error, results) {
    if (error) {
      console.error('Erro ao consultar usuário:', error);
      res.status(500).send('Erro ao logar');
      return;
    }

    console.log('Results:', results); // Registra os resultados da consulta no console
    console.log('Results length:', results.length); // Registra o número de resultados da consulta no console

    if (results.length === 0) {
      // Usuário não encontrado ou senha incorreta
      res.render('index', { message: 'email ou senha incorreta' }); // Envia o template `index.handlebars` com a mensagem de erro
      return; // Interrompe a execução da função
    }

    // Usuário válido encontrado - armazena os dados do usuário em uma variável
    const usuario = results[0];
    if (usuario) {
      // Implementação da lógica de login (opcional)
      // Insira sua lógica de login aqui, como criar uma sessão ou redirecionar para a página de perfil do usuário

      console.log('Usuário logado:', usuario); // Registra os dados do usuário logado no console
      // res.json({ message: "ok", usuario }); // Envia uma resposta JSON com o status "ok" e os dados do usuário (opcional)

      // Renderiza a página logada e passa os dados do usuário entre chaves
      res.render('paginalogada', { usuario });
    } else {
      console.error('Unexpected error: results[0] is undefined'); // Erro inesperado se o resultado da consulta for indefinido
    }
  });
});

// Rota para fazer logoff ("/logout")
app.post('/logout', function (req, res) {
  // Implementação da lógica de logoff (opcional)
  // Insira sua lógica de logoff aqui, como destruir a sessão do usuário ou redirecionar para a página de login

  // Exemplo de redirecionamento para a página de login
  res.redirect('/');
});

// Configuração da porta e inicialização da aplicação
app.listen(8082, function () {
  console.log('Servidor iniciado na porta 8082!');
});
