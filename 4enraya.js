// Se espera a que el DOM se cargue antes de ejecutar el código
document.addEventListener("DOMContentLoaded", function () {
    // Obtiene el elemento canvas y su contexto 2D
    const canvas = document.getElementById("tablero");
    const ctx = canvas.getContext("2d");

    // Tamaño de cada celda en el tablero
    const tamañoCelda = 80;
    // Número de filas y columnas en el tablero
    const filas = 6;
    const columnas = 7;

    // Inicializa el tablero con todas las celdas vacías (0)
    const tablero = Array.from({ length: filas }, () => Array(columnas).fill(0));

    // Inicializa el turno del jugador (1 o 2) y la variable para verificar si la partida ha finalizado
    let turno = 1;
    let partidaFinalizada = false;

    // Función para dibujar el tablero en el canvas
    function dibujarTablero() {
        // Limpia el canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Itera sobre cada celda del tablero
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                const x = j * tamañoCelda;
                const y = i * tamañoCelda;

                // Dibuja un rectángulo para representar la celda
                ctx.fillStyle = "#eee";
                ctx.fillRect(x, y, tamañoCelda, tamañoCelda);

                // Si la celda contiene una ficha (1 o 2), dibuja un círculo de color correspondiente
                if (tablero[i][j] !== 0) {
                    ctx.beginPath();
                    ctx.arc(x + tamañoCelda / 2, y + tamañoCelda / 2, tamañoCelda / 2 - 10, 0, 2 * Math.PI);
                    ctx.fillStyle = tablero[i][j] === 1 ? "red" : "yellow";
                    ctx.fill();
                }
            }
        }

        // Dibuja las líneas del tablero
        dibujarLineasTablero();
    }

    // Función para dibujar las líneas del tablero
    function dibujarLineasTablero() {
        ctx.beginPath();

        // Líneas horizontales
        for (let i = 1; i < filas; i++) {
            ctx.moveTo(0, i * tamañoCelda);
            ctx.lineTo(canvas.width, i * tamañoCelda);
        }

        // Líneas verticales
        for (let j = 1; j < columnas; j++) {
            ctx.moveTo(j * tamañoCelda, 0);
            ctx.lineTo(j * tamañoCelda, canvas.height);
        }

        // Estilo de las líneas
        ctx.strokeStyle = "#333";
        ctx.stroke();
    }

    // Función para manejar el click del jugador en el tablero
    function manejarClick(evento) {
        // Si la partida ha finalizado, muestra un mensaje y retorna
        if (partidaFinalizada) {
            alert("La partida ha finalizado. Reinicia el juego.");
            return;
        }

        // Obtiene la posición de la columna en la que se hizo click
        const rect = canvas.getBoundingClientRect();
        const columna = Math.floor((evento.clientX - rect.left) / tamañoCelda);

        // Realiza el movimiento en la columna seleccionada
        if (realizarMovimiento(columna)) {
            // Dibuja el tablero actualizado
            dibujarTablero();

            // Verifica si hay un ganador
            if (hayGanador()) {
                // Muestra un mensaje indicando el jugador ganador
                setTimeout(() => {
                    alert("¡Jugador " + turno + " ha ganado!");
                    partidaFinalizada = true;
                }, 50);
            } else if (tableroLleno()) {
                // Si el tablero está lleno y no hay ganador, muestra un mensaje de empate
                alert("¡Empate!");
                partidaFinalizada = true;
            } else {
                // Cambia el turno para el siguiente jugador
                cambiarTurno();
            }
        }
    }

    // Función para realizar el movimiento en una columna
    function realizarMovimiento(columna) {
        // Itera desde la última fila hacia arriba
        for (let i = filas - 1; i >= 0; i--) {
            // Si la celda está vacía (contiene 0), coloca la ficha del jugador actual en esa posición
            if (tablero[i][columna] === 0) {
                tablero[i][columna] = turno;
                return true; // Indica que el movimiento fue exitoso
            }
        }
        return false; // Indica que la columna está llena y el movimiento no fue posible
    }

    // Función para verificar si hay un ganador
    function hayGanador() {
        // Verificar en horizontal
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas - 3; j++) {
                if (tablero[i][j] !== 0 &&
                    tablero[i][j] === tablero[i][j + 1] &&
                    tablero[i][j] === tablero[i][j + 2] &&
                    tablero[i][j] === tablero[i][j + 3]) {
                    return true;
                }
            }
        }
    
        // Verificar en vertical
        for (let i = 0; i < filas - 3; i++) {
            for (let j = 0; j < columnas; j++) {
                if (tablero[i][j] !== 0 &&
                    tablero[i][j] === tablero[i + 1][j] &&
                    tablero[i][j] === tablero[i + 2][j] &&
                    tablero[i][j] === tablero[i + 3][j]) {
                    return true;
                }
            }
        }
    
        // Verificar en diagonal (ascendente)
        for (let i = 3; i < filas; i++) {
            for (let j = 0; j < columnas - 3; j++) {
                if (tablero[i][j] !== 0 &&
                    tablero[i][j] === tablero[i - 1][j + 1] &&
                    tablero[i][j] === tablero[i - 2][j + 2] &&
                    tablero[i][j] === tablero[i - 3][j + 3]) {
                    return true;
                }
            }
        }
    
        // Verificar en diagonal (descendente)
        for (let i = 0; i < filas - 3; i++) {
            for (let j = 0; j < columnas - 3; j++) {
                if (tablero[i][j] !== 0 &&
                    tablero[i][j] === tablero[i + 1][j + 1] &&
                    tablero[i][j] === tablero[i + 2][j + 2] &&
                    tablero[i][j] === tablero[i + 3][j + 3]) {
                    return true;
                }
            }
        }
    
        return false;
    }
    

    function tableroLleno() {
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                if (tablero[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    function cambiarTurno() {
        turno = (turno === 1) ? 2 : 1;
    }


    canvas.addEventListener("click", manejarClick);
    dibujarTablero();
});