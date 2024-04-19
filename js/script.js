function validateForm(event) {

    // Resetando mensagens de erro
    document.getElementById("span4").innerHTML = '';
    document.getElementById("span5").innerHTML = '';
    document.getElementById("span6").innerHTML = '';
    document.getElementById("span7").innerHTML = '';
    //pegando o value dos id
    const password = document.getElementById("password-id").value;
    const firstname = document.getElementById("firstname-id").value;
    const lastname = document.getElementById('lastname-id').value;
    const address = document.getElementById('email-id').value;

    let isFieldsValidated = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Validar nome (pelo menos 3 caracteres)
    if (firstname.length < 3) {
        document.getElementById("span4").innerHTML = "nome muito curto";
        isFieldsValidated = false;

    }
    // Validar ultimo nome (pelo menos 3 caracteres)
    if (lastname.length < 10) {
        document.getElementById("span5").innerHTML = " telefone invalido";
        isFieldsValidated = false;
    }
    // Validar email usando expressão regular simples
    if (!emailRegex.test(address)) {
        document.getElementById("span6").innerHTML = 'Email inválido.';
        isFieldsValidated = false;
    }


    // Validar senha (pelo menos 6 caracteres)
    if (password.length < 6) {
        document.getElementById("span7").innerHTML = 'senha muito curta,(6 caracteres ou mais)';
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
//
function validateLOGIN(event) {
    event.preventDefault(); // Evita que o formulário seja enviado antes da validação
  
    // Resetando mensagens de erro
    document.getElementById("span6").innerHTML = "";
    document.getElementById("span7").innerHTML = "";
  
    // Pegando os valores dos campos do formulário
    const email = document.getElementById("email-id").value.trim(); // Remove espaços em branco no início e no final
    const password = document.getElementById("password-id").value.trim();
  
    let isFieldsValidated = true;
  
    // Validar formato do email
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regexEmail.test(email)) {
      document.getElementById("span6").innerHTML = "Formato de email inválido.";
      isFieldsValidated = false;
    }
  
    // Validar se os campos não estão vazios
    if (email === "") {
      document.getElementById("span6").innerHTML = "Por favor, preencha o campo de email.";
      isFieldsValidated = false;
    }
  
    if (password === "") {
      document.getElementById("span7").innerHTML = "Por favor, preencha o campo de senha.";
      isFieldsValidated = false;
    }
  
   
  
  }

  