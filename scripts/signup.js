window.onload = () => {

    //Inicializo nuevo usuario
    let nuevoUsuario = {
        firstName: "",
        lastName: "",
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
    //Agrego evento al formulario
    let form = document.querySelector('form');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if(validateForm(form)) createUser();
    });
    //Validacion de inputs
    function validateInput(input){
        let hayError = false;
            let textError = '';
            let pos;
            switch (input.name) {
                case "nombre":
                    if(input.value.length <= 0){
                        hayError = true;
                        textError = 'Campo obligatorio';
                    } else nuevoUsuario.firstName = normalizarParametro(input.value,'nombre');
                    pos = 0;
                    break;
                case "apellido":
                    if(input.value.length <= 0) {
                        hayError = true;
                        textError = 'Campo obligatorio';
                    } else nuevoUsuario.lastName = normalizarParametro(input.value,'apellido');
                    pos = 1;
                    break;
                case "email":
                    let emailRegexp = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
                        if(!emailRegexp.test(input.value)) {
                            hayError = true;
                            textError = 'Revisar formato: xxxx@mail.com';
                        } else nuevoUsuario.email = normalizarParametro(input.value,'email');
                        pos = 2;
                    break;
                case "password":
                    let passwordRegexp = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})");
                        if(!passwordRegexp.test(input.value)){
                            hayError = true;
                            textError = 'La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y un caracter especial';
                        } else nuevoUsuario.password = normalizarParametro(input.value,'password');
                        pos = 3;
                    break;
                default:
                        let password = document.querySelector('input[name="password"]').value;
                        if(input.value !== password){
                            hayError = true;
                            textError = 'Las contraseñas no coinciden';
                        }
                        pos = 4;
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
    //Normalizacion parametro
    function normalizarParametro(parametro, type){
        if(type != 'password'){
            return parametro.trim();
        } else{
            return parametro.toLowerCase().trim();
        }
    }
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
            };
        })
        return flagNotDefault;
    }

    //Enviar datos via API
    function createUser(){
        console.log(nuevoUsuario);
        const todoApiUrl = "https://ctd-todo-api.herokuapp.com/v1";
        const payloadTodo =  JSON.stringify(nuevoUsuario);
        const settingsTodo = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json; charset=UTF-8',
            },
            body: payloadTodo
        };
        fetch(`${todoApiUrl}/users`, settingsTodo)
            .then((response) => {
                return response.json()
            })
            .then(respuesta => {
                if(respuesta.jwt){
                    alert('Cuenta creada con éxito!');
                    localStorage.setItem('jwt', respuesta.jwt);
                    location.href = '/mis-tareas.html';
                } else alert(respuesta)
            })
            .catch(error => {
                console.log(error);
            }) 
    }
}