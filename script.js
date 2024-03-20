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
        document.getElementById("span4").innerHTML = " name cannot be empty";
        isFieldsValidated = false;

    }
    // Validar ultimo nome (pelo menos 3 caracteres)
    if (lastname.length < 3) {
        document.getElementById("span5").innerHTML = " lastname cannot be empty";
        isFieldsValidated = false;
    }
    // Validar email usando expressão regular simples
    if (!emailRegex.test(address)) {
        document.getElementById("span6").innerHTML = 'Email inválido.';
        isFieldsValidated = false;
    }


    // Validar senha (pelo menos 6 caracteres)
    if (password.length < 6) {
        document.getElementById("span7").innerHTML = 'Password cannot be empty';
        isFieldsValidated = false;
    }

    if (isFieldsValidated) {
        //armazenando informações para a outra pagina
        sessionStorage.setItem('firstname', firstname);
        sessionStorage.setItem('password', password);
        sessionStorage.setItem('address', address);
        sessionStorage.setItem('lastname', lastname);
        window.location.href = `/paginalogada.html`//troca de pagina


    }

    // Se todas as validações passarem, o formulário é enviado
    return false;
}
const firstname = sessionStorage.getItem("firstname");
const password = sessionStorage.getItem("password");
const address = sessionStorage.getItem("address");
const lastname = sessionStorage.getItem("lastname");
//recebe as informações do index no index2
document.getElementById("firstnamepagina2-id").innerHTML = firstname;
document.getElementById("passwordpagina2-id").innerHTML = password;
document.getElementById("addresspagina2-id").innerHTML = address;
document.getElementById("lastnamepagina2-id").innerHTML = lastname;
