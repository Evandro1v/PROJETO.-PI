<<<<<<< HEAD
function validateForm(event) {
  const infoSpan = document.querySelector('.info'); // Span que será ocultado
  const disposicaoTitulos=document.querySelector('.disposicao_titulos');//sera oculto
  infoSpan.style.display='none';//oculta o span info
  disposicaoTitulos.style.display='none';//oculta o span info

  document.getElementById("span4").classList.remove('error-message');
  document.getElementById("span5").classList.remove('error-message');
  document.getElementById("span6").classList.remove('error-message');
  document.getElementById("span7").classList.remove('error-message');
  document.getElementById("span4").innerHTML = '';
  document.getElementById("span5").innerHTML = '';
  document.getElementById("span6").innerHTML = '';
  document.getElementById("span7").innerHTML = '';

  

  // Pegando o value dos id
  const password = document.getElementById("password-id").value;
  const firstname = document.getElementById("firstname-id").value;
  const lastname = document.getElementById('lastname-id').value;
  const address = document.getElementById('email-id').value;

  let isFieldsValidated = true;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // Validar nome (pelo menos 3 caracteres)
  if (firstname.length < 3) {
      document.getElementById("span4").innerHTML = "Nome muito curto";    
      document.getElementById("span4").classList.add('error-message'); // Adiciona a classe de erro
      isFieldsValidated = false;
  }

  // Validar telefone (pelo menos 10 caracteres)
  if (lastname.length < 10) {
      document.getElementById("span5").innerHTML = "Telefone inválido";
      document.getElementById("span5").classList.add('error-message'); // Adiciona a classe de erro
      isFieldsValidated = false;
  }

  // Validar email usando expressão regular simples
  if (!emailRegex.test(address)) {
      document.getElementById("span6").innerHTML = 'Email inválido.';
      document.getElementById("span6").classList.add('error-message'); // Adiciona a classe de erro
      isFieldsValidated = false;
  }

  // Validar senha (pelo menos 6 caracteres)
  if (password.length < 6) {
      document.getElementById("span7").innerHTML = 'Senha muito curta, (6 caracteres ou mais)';
      document.getElementById("span7").classList.add('error-message'); // Adiciona a classe de erro
      isFieldsValidated = false;
  }

  // Se todos os campos passarem na validação, o formulário é enviado
  if (isFieldsValidated) {
      return true; // Permite o envio
  }
  const errorMessage = document.querySelector('.error-message');
  if (errorMessage) {
      errorMessage.style.display = 'none';
    errorMessage.innerHTML = '';
     // Limpa a mensagem de erro
  }
  // Caso contrário, retorna false para evitar o envio
  return false;
}
=======
  //Código alterado para exibir todas as mensagens de erro em uma única div com a classe error-message.

  function addErrorMessage(message) {
    const errorDiv = document.querySelector('.error-message');
    errorDiv.innerHTML += `<p>${message}</p>`;
    }
    
    function validateForm(event) {
    // Resetando mensagens de erro
    const errorDiv = document.querySelector('.error-message');
    errorDiv.innerHTML = '';
    
    // Pegando o value dos id
    const password = document.getElementById("password-id").value;
    const firstname = document.getElementById("firstname-id").value;
    const lastname = document.getElementById("lastname-id").value;
    const address = document.getElementById("email-id").value;
    
    let isFieldsValidated = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validar nome (pelo menos 3 caracteres)
    if (firstname.length < 3) {
    addErrorMessage("O nome é muito curto.");
    isFieldsValidated = false;
    }
    // Validar último nome (pelo menos 3 caracteres)
    if (lastname.length < 10) {
    addErrorMessage("Telefone inválido, tente novamente.");
    isFieldsValidated = false;
    }
    // Validar email usando expressão regular simples
    if (!emailRegex.test(address)) {
    addErrorMessage("Email inválido, tente novamente.");
    isFieldsValidated = false;
    }
    // Validar senha (pelo menos 6 caracteres)
    if (password.length < 6) {
    addErrorMessage("Senha curta, use 6 caracteres ou mais.");
    isFieldsValidated = false;
    }
    if (isFieldsValidated) {
    // Redirecionar para a página de login após a validação bem-sucedida
    window.location.href = '/';
    return true;
    }
    // Se todas as validações passarem, o formulário é enviado
    return false;
    }
    
    function validateLOGIN(event) {
    event.preventDefault(); // Evita que o formulário seja enviado antes da validação
    
    // Resetando mensagens de erro
    const errorDiv = document.querySelector('.error-message');
    errorDiv.innerHTML = '';
    
    // Pegando os valores dos campos do formulário
    const email = document.getElementById("email-id").value.trim(); // Remove espaços em branco no início e no final
    const password = document.getElementById("password-id").value.trim();
    
    let isFieldsValidated = true;
    
    // Validar formato do email
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regexEmail.test(email)) {
    addErrorMessage("Formato de email inválido.");
    isFieldsValidated = false;
    }
    
    // Validar se os campos não estão vazios
    if (email === "") {
    addErrorMessage("Por favor, preencha o campo de e-mail.");
    isFieldsValidated = false;
    }
    
    if (password === "") {
    addErrorMessage("Por favor, preencha o campo de senha.");
    isFieldsValidated = false;
    }
    
    return isFieldsValidated;
    }

    
function validateResetPasswordForm(event) {
  event.preventDefault(); // Evita que o formulário seja enviado antes da validação
  
  // Resetando mensagens de erro
  const errorDiv = document.querySelector('.error-message');
  errorDiv.innerHTML = '';
  
  // Pegando o valor do campo de e-mail
  const email = document.getElementById("email-id").value.trim();
  
  let isFieldsValidated = true;
  
  // Validar formato do email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
  addErrorMessage("Email inválido, tente novamente.");
  isFieldsValidated = false;
  }
  
  if (isFieldsValidated) {
  // Se todas as validações passarem, o formulário é enviado
  event.target.submit();
  }
  }
  
  // Adicionando o evento de validação ao formulário de recuperação de senha
  document.querySelector('form[action="/esqueceusenha"]').addEventListener('submit', validateResetPasswordForm);
>>>>>>> 6903d30 (versao ranieri css)





<<<<<<< HEAD
//
// function validateLOGIN(event) {
//     event.preventDefault(); // Evita que o formulário seja enviado antes da validação

//     // Resetando mensagens de erro
//     document.getElementById("span6").innerHTML = "";
//     document.getElementById("span7").innerHTML = "";

//     // Pegando os valores dos campos do formulário
//     const email = document.getElementById("email-id").value.trim(); // Remove espaços em branco no início e no final
//     const password = document.getElementById("password-id").value.trim();

//     let isFieldsValidated = true;

//     // Validar formato do email
//     const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
//     if (!regexEmail.test(email)) {
//       document.getElementById("span6").innerHTML = "Formato de email inválido.";
//       isFieldsValidated = false;
//     }

//     // Validar se os campos não estão vazios
//     if (email === "") {
//       document.getElementById("span6").innerHTML = "Por favor, preencha o campo de email.";
//       isFieldsValidated = false;
//     }

//     if (password === "") {
//       document.getElementById("span7").innerHTML = "Por favor, preencha o campo de senha.";
//       isFieldsValidated = false;
//     }

 

//   }

=======









    
>>>>>>> 6903d30 (versao ranieri css)
