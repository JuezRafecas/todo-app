window.addEventListener('load', function(){
    /* -------------------------------------------------------------------------- */
    /*                              logica del login                              */
    /* -------------------------------------------------------------------------- */
    //Inicializo nuevo usuario
    let usuario = {
        email: "",
        password: ""
    };
    //Agrego evento a todos los inputs
    let inputs = document.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('blur', () => {
            validateInput(input);
        })
    });
    function validateInput(input){
        let hayError = false;
            let textError = '';
            let pos;
            switch (input.name) {
                case "email":
                    let emailRegexp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        if(!emailRegexp.test(input.value)) {
                            hayError = true;
                            textError = 'Revisar formato: xxxx@mail.com';
                        } else usuario.email = normalizarParametro(input.value,'email');
                        pos = 0;
                    break;
                case "password":
                    let passwordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                        if(!passwordRegexp.test(input.value)){
                            hayError = true;
                            textError = 'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y un caracter especial';
                        } else usuario.password = normalizarParametro(input.value,'password');
                        pos = 1;
                    break;
                default:
                    break;
            }
            let label = document.querySelectorAll('label')[pos];
            if(hayError){
                input.classList.add('input-error');
                if(!label.lastElementChild.classList.contains('error')){
                    let errorP = document.createElement('p');
                    errorP.innerText = textError;
                    errorP.classList.add('error');
                    label.appendChild(errorP);
                }
            } else{
                input.classList.remove('input-error');
                if(label.lastElementChild.classList.contains('error')){
                    label.removeChild(label.lastElementChild);
                }
            }
    }
    function normalizarParametro(parametro, type){
        if(type != 'password'){
            return parametro.trim();
        } else{
            return parametro.toLowerCase().trim();
        }
    }
    //Agrego evento al formulario
    const formulario =  this.document.forms[0];
    formulario.addEventListener('submit', (e) => {
        e.preventDefault();
        if(validateForm(formulario)) loginUser();
    });
    //Validacion de formulario
    function validateForm(form){
        let inputs = document.querySelectorAll('input');
        let flagNotDefault = true;
        inputs.forEach((input) => {
            validateInput(input);
            if((input.classList.contains('input-error') || input.value.length == 0) && flagNotDefault ) {
                flagNotDefault = false;
                if(!form.lastElementChild.classList.contains('error')){
                let error = document.createElement('p');
                error.innerText = 'Revisar los campos erroneos o faltantes'
                error.classList.add('error');
                form.appendChild(error);
                }
            } else if(form.lastElementChild.classList.contains('error')){
                form.lastElementChild.remove();
            }
        })
        return flagNotDefault;
    }
    //Enviar datos via API
    function loginUser(){
        console.log(usuario);
        const todoApiUrl = "https://ctd-todo-api.herokuapp.com/v1";
        const payloadTodo =  JSON.stringify(usuario);
        const settingsTodo = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: payloadTodo
        };
        fetch(`${todoApiUrl}/users/login`, settingsTodo)
            .then((response) => {
                return response.json()
            })
            .then(respuesta => {
                console.log(respuesta)
                if(respuesta.jwt){
                    alert('Logeado con éxito!');
                    localStorage.setItem('jwt', respuesta.jwt);
                    location.href = '/mis-tareas.html';
                } else alert(respuesta)
            })
            .catch(error => {
                console.log(error);
            }) 
    }
});