let numeroSecreto = 0;
let intentos = 0;
let listaNumerosSorteados = [];
let numeroMaximo = 10;
let tiempoInicio;
let timerInterval;
let mejorPuntuacion = localStorage.getItem('mejorPuntuacion') || Infinity;

// Actualizar la visualización de la mejor puntuación
function actualizarMejorPuntuacion() {
    const bestScoreElement = document.getElementById('bestScore');
    bestScoreElement.textContent = mejorPuntuacion === Infinity ? '-' : mejorPuntuacion;
}

// Función para el temporizador
function iniciarTimer() {
    tiempoInicio = Date.now();
    timerInterval = setInterval(() => {
        const tiempoTranscurrido = Math.floor((Date.now() - tiempoInicio) / 1000);
        const minutos = Math.floor(tiempoTranscurrido / 60);
        const segundos = tiempoTranscurrido % 60;
        document.getElementById('timer').textContent = 
            `${minutos.toString().padStart(2, '0')}:${segundos.toString().padStart(2, '0')}`;
    }, 1000);
}

function detenerTimer() {
    clearInterval(timerInterval);
}

function asignarTextoElemento(elemento, texto) {
    let elementoHTML = document.querySelector(elemento);
    elementoHTML.innerHTML = texto;
}

function verificarIntento() {
    let numeroDeUsuario = parseInt(document.getElementById('valorUsuario').value);
    
    if (isNaN(numeroDeUsuario) || numeroDeUsuario < 1 || numeroDeUsuario > numeroMaximo) {
        asignarTextoElemento('p', `Por favor, ingresa un número válido entre 1 y ${numeroMaximo}`);
        return;
    }

    if (numeroDeUsuario === numeroSecreto) {
        detenerTimer();
        const mensaje = `¡Acertaste el número en ${intentos} ${(intentos === 1) ? 'intento' : 'intentos'}!`;
        asignarTextoElemento('p', mensaje);
        document.getElementById('reiniciar').removeAttribute('disabled');
        
        // Actualizar mejor puntuación
        if (intentos < mejorPuntuacion) {
            mejorPuntuacion = intentos;
            localStorage.setItem('mejorPuntuacion', mejorPuntuacion);
            actualizarMejorPuntuacion();
        }

        // Efectos de celebración
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
    } else {
        const hintIndicator = document.querySelector('.hint-indicator');
        if (numeroDeUsuario > numeroSecreto) {
            asignarTextoElemento('p', 'El número secreto es menor');
            hintIndicator.innerHTML = '↓';
        } else {
            asignarTextoElemento('p', 'El número secreto es mayor');
            hintIndicator.innerHTML = '↑';
        }
        intentos++;
        document.getElementById('currentAttempts').textContent = intentos;
        limpiarCaja();
    }
}

function limpiarCaja() {
    document.querySelector('#valorUsuario').value = '';
}

function generarNumeroSecreto() {
    let numeroGenerado = Math.floor(Math.random() * numeroMaximo) + 1;

    if (listaNumerosSorteados.length == numeroMaximo) {
        asignarTextoElemento('p', 'Ya se sortearon todos los números posibles');
        return null;
    } 

    if (listaNumerosSorteados.includes(numeroGenerado)) {
        return generarNumeroSecreto();
    } else {
        listaNumerosSorteados.push(numeroGenerado);
        return numeroGenerado;
    }
}

function condicionesIniciales() {
    asignarTextoElemento('h1', '¡Juego del número secreto!');
    asignarTextoElemento('p', `Indica un número del 1 al ${numeroMaximo}`);
    numeroSecreto = generarNumeroSecreto();
    intentos = 1;
    document.getElementById('currentAttempts').textContent = '0';
    document.querySelector('.hint-indicator').innerHTML = '';
    actualizarMejorPuntuacion();
    iniciarTimer();
}

function reiniciarJuego() {
    limpiarCaja();
    detenerTimer();
    condicionesIniciales();
    document.querySelector('#reiniciar').setAttribute('disabled', 'true');
}

// Configurar selectores de dificultad
document.querySelectorAll('.difficulty-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        numeroMaximo = parseInt(this.dataset.max);
        document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        reiniciarJuego();
    });
});

// Manejar entrada con Enter
document.getElementById('valorUsuario').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        verificarIntento();
    }
});

// Inicializar el juego
condicionesIniciales();