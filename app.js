const express = require('express'); // Importa o módulo Express, que é um framework web para Node.js.
const { engine } = require('express-handlebars'); // Importa o motor de visualização Handlebars para o Express.
const mysql = require('mysql2'); // Importa o módulo mysql2 para interagir com o banco de dados MySQL.
const passport = require('passport'); // Importa o módulo Passport, que é utilizado para autenticação de usuários.
const LocalStrategy = require('passport-local').Strategy; // Importa a estratégia de autenticação local do Passport.
const session = require('express-session'); // Importa o middleware de sessão para o Express.
const flash = require('connect-flash'); // Importa o módulo connect-flash para exibir mensagens flash.
const multer = require('multer'); // Importa o módulo multer para processamento de formulários multipart.
const upload = multer({ dest: 'uploads/' });// para inicializar o multer e atribuí-lo à variável upload
const app = express(); // Cria uma instância do aplicativo Express.
app.engine('handlebars', engine()); // Configura o motor de visualização Handlebars no Express.
app.set('view engine', 'handlebars'); // Configura o uso de arquivos Handlebars como visualizações.
app.set('views', './views'); // Define o diretório onde estão armazenadas as visualizações Handlebars.
app.use(express.json()); // Middleware para interpretar o corpo da requisição como JSON.
app.use(express.urlencoded({ extended: false })); // Middleware para interpretar dados do formulário codificados na URL.

const conexao = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'tapaburaco'
}); // Cria uma conexão com o banco de dados MySQL.

conexao.connect(function (erro) {
  if (erro) throw erro; // Se ocorrer um erro na conexão, lança uma exceção.
  console.log('Conexão efetuada com sucesso'); // Loga uma mensagem informando que a conexão foi estabelecida com sucesso.
});

app.use(session({
  secret: 'mysecret', // Chave secreta utilizada para assinar o cookie da sessão.
  resave: false, // Evita que a sessão seja regravada no armazenamento a cada requisição.
  saveUninitialized: false // Evita que sessões não inicializadas sejam salvas.
}));
app.use(flash()); // Middleware para exibir mensagens flash.
app.use(passport.initialize()); // Inicializa o Passport.
app.use(passport.session()); // Middleware para sessões do Passport.

passport.serializeUser(function (user, done) {
  console.log('Serializando usuário:', user); // Loga o processo de serialização do usuário.
  done(null, user.id_usuario); // Completa o processo de serialização do usuário.
});

passport.deserializeUser(function (id, done) {
  console.log('Deserializando usuário com id:', id); // Loga o processo de desserialização do usuário.
  const sql = `SELECT * FROM cad_usuario WHERE id_usuario = ?`; // Consulta SQL para buscar o usuário no banco de dados.
  conexao.query(sql, [id], function (error, results) {
    if (error) {
      return done(error); // Se ocorrer um erro, retorna o erro.
    }
    const user = results[0]; // Obtém o usuário a partir dos resultados da consulta.
    done(null, user); // Completa o processo de desserialização do usuário.
  });
});

passport.use(new LocalStrategy({
  usernameField: 'email', // Define o campo do formulário utilizado para o email.
  passwordField: 'password' // Define o campo do formulário utilizado para a senha.
}, function (email, password, done) {
  const sql = `SELECT * FROM cad_usuario WHERE \`e-mail\` = ? AND senha = ?`; // Consulta SQL para buscar o usuário no banco de dados com base no email e senha.
  conexao.query(sql, [email, password], function (error, results) {
    if (error) {
      return done(error); // Se ocorrer um erro, retorna o erro.
    }
    const user = results[0]; // Obtém o usuário a partir dos resultados da consulta.
    if (!user) {
      return done(null, false, { message: 'Email ou senha incorretos' }); // Se o usuário não for encontrado, retorna falso e uma mensagem de erro.
    }
    return done(null, user); // Retorna o usuário encontrado.
  });
}));


function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); // Se o usuário estiver autenticado, passa para o próximo middleware.
  }
  console.log('Usuário não autenticado'); // Loga uma mensagem informando que o usuário não está autenticado.
  res.redirect('/'); // Redireciona para a página inicial.
}

app.use('/css', express.static('./css')) // Middleware para servir arquivos estáticos CSS.
app.use('/js', express.static('./js')); // Middleware para servir arquivos estáticos JavaScript.

app.get('/', function (req, res) {
  res.render('index'); // Rota para renderizar a página inicial.
});

app.get('/paginadecadastro', function (req, res) {
  res.render('paginadecadastro'); // Rota para renderizar a página de cadastro.
});

// Aplicando o middleware isLoggedIn para proteger a rota '/paginalogada'
app.get('/paginalogada', isLoggedIn, function (req, res) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate'); // Define cabeçalhos de controle de cache.
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  console.log('Usuário autenticado:', req.user); // Loga o usuário autenticado.
  res.render('paginalogada', { user: req.user }); // Rota para renderizar a página logada.
});

app.post('/cadastro', function (req, res) {
  const { nome, telefone, email, senha } = req.body; // Obtém os dados do formulário de cadastro.
  const sqlInsertUser = `INSERT INTO cad_usuario (nome, telefone, \`e-mail\`, senha) VALUES (?, ?, ?, ?)`; // Consulta SQL para inserir um novo usuário.
  conexao.query(sqlInsertUser, [nome, telefone, email, senha], function (error, results) {
    if (error) {
      console.error('Erro ao cadastrar usuário:', error); // Se ocorrer um erro, loga o erro.
      res.status(500).send('Erro ao cadastrar usuário'); // Retorna um status 500 e uma mensagem de erro.
      return;
    }
    console.log('Usuário cadastrado com sucesso:', results); // Loga uma mensagem informando que o usuário foi cadastrado com sucesso.
    res.redirect('/'); // Redireciona para a página inicial.
  });
});

app.post('/login', passport.authenticate('local', {
  successRedirect: '/paginalogada', // Redireciona para a página logada em caso de sucesso na autenticação.
  failureRedirect: '/', // Redireciona para a página inicial em caso de falha na autenticação.
  failureFlash: true // Permite exibir mensagens flash em caso de falha na autenticação.
}));

app.post('/logout', function (req, res) {
  req.logout(function (err) { // Efetua o logout do usuário.
    if (err) {
      console.error('Erro ao desconectar usuário:', err); // Se ocorrer um erro, loga o erro.
      return next(err); // Passa o erro para o próximo middleware.
    }
    req.session.destroy(); // Destroi a sessão do usuário.
    console.log('Usuário desconectado'); // Loga uma mensagem informando que o usuário foi desconectado.
    res.redirect('/'); // Redireciona para a página inicial.
  });
});


// Aplicando o middleware isLoggedIn para proteger a rota '/enviar-formulario'
app.post('/enviar-formulario', isLoggedIn, upload.fields([
  { name: 'foto_da_ocorrencia', maxCount: 1 },
  { name: 'foto_mapa_da_localizacao', maxCount: 1 }
]), function (req, res) {
  const gravidade = req.body.gravidade_da_ocorrencia; // Obtém a gravidade da ocorrência do formulário.
  const end_ocorrencia = req.body.end_ocorrencia; // Obtém o endereço da ocorrência do formulário.
  const bairro = req.body.bairro; // Obtém o bairro da ocorrência do formulário.
  const descricao_da_ocorrencia = req.body.descricao_da_ocorrencia; // Obtém a descrição da ocorrência do formulário.
  let foto_da_ocorrencia = ''; // Inicializa a variável para armazenar a foto da ocorrência.
  let foto_mapa_da_localizacao = ''; // Inicializa a variável para armazenar a foto do mapa da localização.

  // Verifica se o campo de upload 'foto_da_ocorrencia' foi preenchido
  if (req.files['foto_da_ocorrencia'] && req.files['foto_da_ocorrencia'].length > 0) {
    foto_da_ocorrencia = req.files['foto_da_ocorrencia'][0].path; // Obtém o caminho da foto da ocorrência.
  }

  // Verifica se o campo de upload 'foto_mapa_da_localizacao' foi preenchido
  if (req.files['foto_mapa_da_localizacao'] && req.files['foto_mapa_da_localizacao'].length > 0) {
    foto_mapa_da_localizacao = req.files['foto_mapa_da_localizacao'][0].path; // Obtém o caminho da foto do mapa da localização.
  }

  if (!gravidade || !end_ocorrencia || !bairro || !descricao_da_ocorrencia) { // Verifica se todos os campos obrigatórios foram preenchidos.
    return res.status(400).send('Por favor, preencha todos os campos.'); // Retorna um status 400 e uma mensagem de erro caso algum campo esteja em branco.
  }

  const status = 1; // Define o status da ocorrência como 1 (ativo).
  const id_usuario = req.user.id_usuario; // Obtém o ID do usuário autenticado.

  const sqlInsertOcorrencia = `INSERT INTO cad_problema (id_usuario, end_ocorrencia, bairro, gravidade_da_ocorrencia, descricao_da_ocorrencia, foto_da_ocorrencia, foto_mapa_da_localizacao, status_da_ocorrencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`; // Consulta SQL para inserir uma nova ocorrência.
  const values = [id_usuario, end_ocorrencia, bairro, gravidade, descricao_da_ocorrencia, foto_da_ocorrencia, foto_mapa_da_localizacao, status]; // Valores a serem inseridos na consulta SQL.
  conexao.query(sqlInsertOcorrencia, values, function (error, results) {
    if (error) {
      console.error('Erro ao inserir ocorrência:', error); // Se ocorrer um erro, loga o erro.
      return res.status(500).send('Erro ao enviar ocorrência'); // Retorna um status 500 e uma mensagem de erro.
    }
    console.log('Ocorrência inserida com sucesso:', results); // Loga uma mensagem informando que a ocorrência foi inserida com sucesso.
    res.redirect('/'); // Redireciona para a página inicial.
  });
});


app.listen(8082, function () {
  console.log('Servidor iniciado na porta 8082!'); // Inicia o servidor na porta 8082 e loga uma mensagem informando que o servidor foi iniciado com sucesso.
});
