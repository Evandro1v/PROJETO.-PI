const express = require('express'); // Importa o módulo Express, que é um framework web para Node.js.
const { engine } = require('express-handlebars'); // Importa o motor de visualização Handlebars para o Express.
const mysql = require('mysql2'); // Importa o módulo mysql2 para interagir com o banco de dados MySQL.
const passport = require('passport'); // Importa  é utilizado para autenticação de usuários.
const LocalStrategy = require('passport-local').Strategy; // Imporo módulo Passport, queta a estratégia de autenticação local do Passport.
const session = require('express-session'); // Importa o middleware de sessão para o Express.
const flash = require('connect-flash'); // Importa o módulo connect-flash para exibir mensagens flash.
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });// para inicializar o multer e atribuí-lo à variável upload
const fs = require('fs'); // Importe o módulo fs para acessar o sistema de arquivos.
const path = require('path');
const nodemailer = require('nodemailer');
const app = express(); // Cria uma instância do aplicativo Express.

var admin = require('firebase-admin');
var serviceAccount = require("./sitetapburaco-firebase-adminsdk-gnu38-c2134532bb.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'gs://sitetapburaco.appspot.com' // Substitua 'seu_bucket' pelo nome do seu bucket no Firebase Storage
});
app.engine('handlebars', engine()); // Configura o motor de visualização Handlebars no Express.
app.set('view engine', 'handlebars'); // Configura o uso de arquivos Handlebars como visualizações.
app.set('images', './images');
app.set('views', path.join(__dirname, 'views')); // Define o diretório onde estão armazenadas as visualizações Handlebars.
app.use(express.json()); // Middleware para interpretar o corpo da requisição como JSON.
app.use(express.urlencoded({ extended: false })); // Middleware para interpretar dados do formulário codificados na URL.



const conexao = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'AFbeOCXwSRcGAYpjDLkIAUuAAflBiOWd',
  database: 'railway',
  port: '46402'
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

app.use('/css', express.static(path.join(__dirname, 'css')));
// Middleware para servir arquivos estáticos CSS.
app.use('/js', express.static(path.join(__dirname, 'js'))); // Middleware para servir arquivos estáticos JavaScript.
app.use('/images', express.static(path.join(__dirname, 'images')));

app.get('/', function (req, res) {
  res.render('index'); // Rota para renderizar a página inicial.
});

app.get('/paginadecadastro', function (req, res) {
  res.render('paginadecadastro'); // Rota para renderizar a página de cadastro.
});
// Rota para exibir a página "Esqueceu a senha"
app.get('/esqueceusenha', function (req, res) {
  res.render('esqueceusenha'); // Renderiza a página "Esqueceu a senha"
});
// Aplicando o middleware isLoggedIn para proteger a rota '/paginalogada'
app.get('/paginalogada', isLoggedIn, function (req, res) {
  res.header('Cache-Control', 'no-cache, no-store, must-revalidate'); // Define cabeçalhos de controle de cache.
  res.header('Pragma', 'no-cache');
  res.header('Expires', '0');
  console.log('Usuário autenticado:', req.user); // Loga o usuário autenticado.
  // Verifica se o usario e admin
  if (req.user.id_usuario >= 0 && req.user.id_usuario <= 5) {
    // Query para receber
    const sql = `SELECT 
                    cp.id_ocorrencia,
                    cp.id_usuario,
                    cp.gravidade_da_ocorrencia,
                    cp.end_ocorrencia,
                    cp.bairro,
                    cp.descricao_da_ocorrencia,
                    cp.foto_da_ocorrencia,
                    cp.foto_mapa_da_localizacao,
                    cp.status_da_ocorrencia,
                    cs.descricao_solucao,
                    cs.foto_da_solucao
                FROM 
                    cad_problema cp
                LEFT JOIN 
                    cad_solucao cs ON cp.id_ocorrencia = cs.id_ocorrencia`;
    // Executing the query
    conexao.query(sql, function (error, results) {
      if (error) {
        console.error('Error retrieving data from cad_problema table:', error);
        return res.status(500).send('Error retrieving data from cad_problema table');
      }
      console.log(results); // Logging the retrieved results to check if it's retrieved successfully
      // Rendering the 'paginaadm' page with user data and retrieved problems
      res.render('paginaadm', { user: req.user, problemas: results });
    });
  } else {
    // If the user is not an admin, render the 'paginalogada' page
    const sql = `SELECT c_p.*, c_u.nome AS nome_usuario FROM cad_problema c_p
        INNER JOIN cad_usuario c_u ON c_p.id_usuario = c_u.id_usuario`;
    // Executing the query
    conexao.query(sql, function (error, results) {
      if (error) {
        console.error('Error retrieving data from cad_problema table:', error);
        return res.status(500).send('Error retrieving data from cad_problema table');
      }
      console.log(results); // Logging the retrieved results to check if it's retrieved successfully
      // Rendering the 'paginalogada' page with user data and retrieved problems
      res.render('paginalogada', { user: req.user, problemas: results });
    });
  }
});


app.post('/cadastro', function (req, res) {
  const { nome, telefone, email, senha } = req.body;

  // Verifica se o email já está cadastrado
  const sqlCheckEmail = `SELECT * FROM cad_usuario WHERE \`e-mail\` = ?`;
  conexao.query(sqlCheckEmail, [email], function (error, results) {
    if (error) {
      console.error('Erro ao verificar email:', error);
      return res.status(500).send('Erro ao cadastrar usuário');
    }

    if (results.length > 0) {
      // Se o email já existe, retorna uma mensagem de erro
      return res.render('paginadecadastro', { message: 'Email já cadastrado' });
    }

    // Se o email não existe, procede com o cadastro
    const sqlInsertUser = `INSERT INTO cad_usuario (nome, telefone, \`e-mail\`, senha) VALUES (?, ?, ?, ?)`;
    conexao.query(sqlInsertUser, [nome, telefone, email, senha], function (error, results) {
      if (error) {
        console.error('Erro ao cadastrar usuário:', error);
        return res.status(500).send('Erro ao cadastrar usuário');
      }
      console.log('Usuário cadastrado com sucesso:', results);

      // Após o cadastro bem-sucedido, redireciona para a página de login
      res.redirect('/');
    });
  });
})

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


// Função para lidar com o envio do formulário de ocorrência
app.post('/enviar-formulario', isLoggedIn, upload.fields([
  { name: 'foto_da_ocorrencia', maxCount: 1 },
  { name: 'foto_mapa_da_localizacao', maxCount: 1 }
]), async function (req, res) {
  const gravidade = req.body.gravidade_da_ocorrencia;
  const end_ocorrencia = req.body.end_ocorrencia;
  const bairro = req.body.bairro;
  const cep = req.body.cep;
  const descricao_da_ocorrencia = req.body.descricao_da_ocorrencia;

  try {
    // Realiza o upload das imagens da ocorrência e do mapa da localização
    const [fotoDaOcorrenciaURL, fotoMapaDaLocalizacaoURL] = await Promise.all([
      uploadImage(req.files['foto_da_ocorrencia'][0]),
      uploadImage(req.files['foto_mapa_da_localizacao'][0])
    ]);

    // Agora você pode salvar os URLs das imagens no banco de dados ou usá-los diretamente
    // Exemplo de como salvar os URLs no banco de dados:
    const sqlInsertOcorrencia = `INSERT INTO cad_problema (id_usuario, end_ocorrencia, bairro,cep, gravidade_da_ocorrencia, descricao_da_ocorrencia, foto_da_ocorrencia, foto_mapa_da_localizacao, status_da_ocorrencia) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    const values = [req.user.id_usuario, end_ocorrencia, bairro, cep, gravidade, descricao_da_ocorrencia, fotoDaOcorrenciaURL, fotoMapaDaLocalizacaoURL, 1];

    conexao.query(sqlInsertOcorrencia, values, function (error, results) {
      if (error) {
        console.error('Erro ao inserir ocorrência:', error);
        return res.status(500).send('Erro ao enviar ocorrência');
      }
      console.log('Ocorrência inserida com sucesso:', results);
      res.redirect(req.get('referer'));
    });
  } catch (error) {
    console.error('Erro ao fazer upload de imagens:', error);
    res.status(500).send('Erro ao fazer upload de imagens');
  }
});

// Função para fazer upload de uma imagem para o armazenamento na nuvem
async function uploadImage(file) {
  const bucket = admin.storage().bucket();
  const fileName = `${Date.now()}-${file.originalname}`;
  const fileUpload = bucket.file(fileName);

  await fileUpload.save(file.buffer, {
    metadata: {
      contentType: file.mimetype
    }
  });

  return `https://storage.googleapis.com/${bucket.name}/${fileName}`;
}

// app.post('/enviar-formulario', isLoggedIn, upload.fields([
//   { name: 'foto_da_ocorrencia', maxCount: 1 },
//   { name: 'foto_mapa_da_localizacao', maxCount: 1 }
// ]), function (req, res) {
//   const gravidade = req.body.gravidade_da_ocorrencia; // Obtém a gravidade da ocorrência do formulário.
//   const end_ocorrencia = req.body.end_ocorrencia; // Obtém o endereço da ocorrência do formulário.
//   const bairro = req.body.bairro; // Obtém o bairro da ocorrência do formulário.
//   const cep = req.body.cep;// Obtém o cep da ocorrência do formulário.
//   const descricao_da_ocorrencia = req.body.descricao_da_ocorrencia; // Obtém a descrição da ocorrência do formulário.
//   let foto_da_ocorrencia = ''; // Inicializa a variável para armazenar a foto da ocorrência.
//   let foto_mapa_da_localizacao = ''; // Inicializa a variável para armazenar a foto do mapa da localização.

//   // Verifica se o campo de upload 'foto_da_ocorrencia' foi preenchido
//   if (req.files['foto_da_ocorrencia'] && req.files['foto_da_ocorrencia'].length > 0) {
//     foto_da_ocorrencia = req.files['foto_da_ocorrencia'][0].path; // Obtém o caminho da foto da ocorrência.
//   }

//   // Verifica se o campo de upload 'foto_mapa_da_localizacao' foi preenchido
//   if (req.files['foto_mapa_da_localizacao'] && req.files['foto_mapa_da_localizacao'].length > 0) {
//     foto_mapa_da_localizacao = req.files['foto_mapa_da_localizacao'][0].path; // Obtém o caminho da foto do mapa da localização.
//   }

//   if (!gravidade || !end_ocorrencia || !bairro || !descricao_da_ocorrencia) { // Verifica se todos os campos obrigatórios foram preenchidos.
//     return res.status(400).send('Por favor, preencha todos os campos.'); // Retorna um status 400 e uma mensagem de erro caso algum campo esteja em branco.
//   }

//   const status = 1; // Define o status da ocorrência como 1 (ativo).
//   const id_usuario = req.user.id_usuario; // Obtém o ID do usuário autenticado.

//   const sqlInsertOcorrencia = `INSERT INTO cad_problema (id_usuario, end_ocorrencia, bairro,cep, gravidade_da_ocorrencia, descricao_da_ocorrencia, foto_da_ocorrencia, foto_mapa_da_localizacao, status_da_ocorrencia) VALUES (?, ?, ?, ?, ?,?, ?, ?, ?)`; // Consulta SQL para inserir uma nova ocorrência.
//   const values = [id_usuario, end_ocorrencia, bairro, cep, gravidade, descricao_da_ocorrencia, foto_da_ocorrencia, foto_mapa_da_localizacao, status]; // Valores a serem inseridos na consulta SQL.
//   conexao.query(sqlInsertOcorrencia, values, function (error, results) {
//     if (error) {
//       console.error('Erro ao inserir ocorrência:', error); // Se ocorrer um erro, loga o erro.
//       return res.status(500).send('Erro ao enviar ocorrência'); // Retorna um status 500 e uma mensagem de erro.
//     }
//     console.log('Ocorrência inserida com sucesso:', results); // Loga uma mensagem informando que a ocorrência foi inserida com sucesso.
//     res.redirect(req.get('referer'));
//   });
// });

// exibir imagens

app.get('/exibir-imagem', async (req, res) => {
  const caminho = req.query.caminho;
  if (caminho) {
    try {
      // Recupere o URL da imagem do Firebase Storage com base no caminho
      const bucket = admin.storage().bucket();
      const file = bucket.file(caminho);
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: '01-01-2025' // Defina a data de expiração do URL, se necessário
      });
      // Envie o URL da imagem para o cliente
      res.send(url);
    } catch (error) {
      console.error('Erro ao recuperar o URL da imagem:', error);
      res.status(500).send('Erro ao recuperar o URL da imagem.');
    }
  } else {
    res.status(400).send('A URI da imagem não foi fornecida.');
  }
});
/// Endpoint para enviar a solução
app.post('/enviar-solucao', isLoggedIn, upload.single('foto_da_solucao'), async function (req, res) {
  const { id_ocorrencia, descricao_solucao } = req.body;
  let foto_da_solucao = ''; // Inicializa como uma string vazia

  // Verifica se a foto_da_solucao foi enviada
  if (req.file) {
    try {
      foto_da_solucao = await uploadImage(req.file); // Faz o upload da foto da solução para o Firebase Storage
    } catch (error) {
      console.error('Erro ao fazer upload da foto da solução:', error);
      return res.status(500).send('Erro ao enviar a solução');
    }
  }

  // Verifica se todos os campos obrigatórios foram preenchidos
  if (!id_ocorrencia || !descricao_solucao) {
    return res.status(400).send('Por favor, preencha todos os campos obrigatórios.');
  }

  // Restante do código para salvar a solução no banco de dados...

  // Verifica se o ID da ocorrência existe na tabela cad_problema
  const checkIdQuery = 'SELECT * FROM cad_problema WHERE id_ocorrencia = ?';
  conexao.query(checkIdQuery, [id_ocorrencia], function (error, results) {
    if (error) {
      console.error('Erro ao verificar ID da ocorrência:', error);
      return res.status(500).send('Erro ao verificar ID da ocorrência');
    }

    // Se o ID da ocorrência não existir na tabela cad_problema, exibe uma mensagem de erro
    if (results.length === 0) {
      return res.status(404).send('O ID da ocorrência não existe.');
    }

    // Verifica se já existe uma solução para essa ocorrência na tabela cad_solucao
    const checkSolutionQuery = 'SELECT * FROM cad_solucao WHERE id_ocorrencia = ?';
    conexao.query(checkSolutionQuery, [id_ocorrencia], function (error, results) {
      if (error) {
        console.error('Erro ao verificar solução existente:', error);
        return res.status(500).send('Erro ao verificar solução existente');
      }

      // Se já existir uma solução para essa ocorrência, substitui a solução existente pela nova
      if (results.length > 0) {
        const id_usuario = req.user.id_usuario; // Obtém o ID do usuário autenticado.
        const updateSolutionQuery = `UPDATE cad_solucao SET id_usuario = ?, descricao_solucao = ?, foto_da_solucao = ? WHERE id_ocorrencia = ?`;
        const values = [id_usuario, descricao_solucao, foto_da_solucao, id_ocorrencia];

        conexao.query(updateSolutionQuery, values, function (error, results) {
          if (error) {
            console.error('Erro ao atualizar solução:', error);
            return res.status(500).send('Erro ao atualizar solução: ' + error.message); // Enviando mensagem de erro específica
          }
          console.log('Solução atualizada com sucesso:', results);
          res.redirect('/'); // Redireciona para a página inicial após a atualização bem-sucedida
        });
      } else {
        // Se não existir uma solução para essa ocorrência, insere uma nova solução
        const id_usuario = req.user.id_usuario; // Obtém o ID do usuário autenticado.
        const insertSolutionQuery = `INSERT INTO cad_solucao (id_ocorrencia,id_usuario, descricao_solucao, foto_da_solucao) VALUES (?, ?, ?, ?)`;
        const values = [id_ocorrencia, id_usuario, descricao_solucao, foto_da_solucao];

        conexao.query(insertSolutionQuery, values, function (error, results) {
          if (error) {
            console.error('Erro ao enviar solução:', error);
            return res.status(500).send('Erro ao enviar solução: ' + error.message); // Enviando mensagem de erro específica
          }
          console.log('Solução enviada com sucesso:', results);
          res.redirect('/'); // Redireciona para a página inicial após o envio bem-sucedido
        });
      }
    });
  });
});

// app.post('/remover-ocorrencia', isLoggedIn, function (req, res) {
//   const idOcorrencia = req.body.id_ocorrencia;

//   // Excluir os registros relacionados na tabela cad_solucao
//   const deleteSolucaoQuery = 'DELETE FROM cad_solucao WHERE id_ocorrencia = ?';
//   conexao.query(deleteSolucaoQuery, [idOcorrencia], function (error, results) {
//     if (error) {
//       console.error('Erro ao remover as soluções relacionadas:', error);
//       return res.status(500).send('Erro ao remover as soluções relacionadas');
//     }

//     console.log('Soluções relacionadas removidas com sucesso:', results);

//     // Remover a ocorrência
//     const deleteQuery = 'DELETE FROM cad_problema WHERE id_ocorrencia = ?';
//     conexao.query(deleteQuery, [idOcorrencia], function (error, results) {
//       if (error) {
//         console.error('Erro ao remover ocorrência:', error);
//         return res.status(500).send('Erro ao remover ocorrência');
//       }
//       console.log('Ocorrência removida com sucesso:', results);
//       res.sendStatus(200);
//     });
//   });
// });

app.post('/esqueceusenha', function (req, res) {
  const { email } = req.body; // Obtém o e-mail fornecido pelo usuário no formulário de recuperação de senha.

  // Consulta SQL para buscar a senha correspondente ao e-mail no banco de dados
  const sql = `SELECT senha FROM cad_usuario WHERE \`e-mail\` = ?`;
  conexao.query(sql, [email], function (error, results) {
    if (error) {
      console.error('Erro ao buscar a senha:', error);
      return res.status(500).send('Erro ao buscar a senha');
    }

    if (results.length === 0) {
      // Se nenhum resultado for retornado, significa que o e-mail não está cadastrado
      return res.status(404).send('E-mail não encontrado');
    }

    const senha = results[0].senha; // Obtém a senha do primeiro resultado

    // Configuração do transporte para enviar o e-mail usando um serviço SMTP
    let transporter = nodemailer.createTransport({
      service: 'Outlook', // Substitua pelo seu provedor de e-mail, como 'Outlook', 'Yahoo', etc.
      auth: {
        user: 'tapaburacosite@outlook.com', // Seu endereço de e-mail
        pass: 'senha@123' // Sua senha de e-mail
      }
    });

    // Configuração do e-mail a ser enviado
    let mailOptions = {
      from: 'tapaburacosite@outlook.com', // Seu endereço de e-mail
      to: email, // Endereço de e-mail do destinatário (o usuário que está solicitando a recuperação de senha)
      subject: 'Recuperação de Senha', // Assunto do e-mail
      html: `<p>Olá, você solicitou a recuperação de senha. Sua senha é: ${senha}</p>` // Corpo do e-mail (pode ser HTML)
    };

    // Envio do e-mail de recuperação de senha
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error); // Em caso de erro
        res.status(500).send('Erro ao enviar e-mail de recuperação de senha'); // Retorna um status 500 em caso de erro no envio do e-mail
      } else {
        console.log('E-mail de recuperação de senha enviado com sucesso: ' + info.response); // Se o e-mail for enviado com sucesso
        res.status(200).send('E-mail de recuperação de senha enviado com sucesso'); // Retorna um status 200 em caso de sucesso no envio do e-mail
      }
    });
  });

});

app.listen(8082, function () {
  console.log('Servidor iniciado na porta 8082!'); // Inicia o servidor na porta 8082 e loga uma mensagem informando que o servidor foi iniciado com sucesso.
});
module.exports = app;
