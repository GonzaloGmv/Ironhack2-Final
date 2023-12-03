document.addEventListener("DOMContentLoaded", function () {
    const canvas = document.getElementById("tablero");
    const ctx = canvas.getContext("2d");
    const tamañoCelda = 80;
    const filas = 6;
    const columnas = 7;

    const tablero = Array.from({ length: filas }, () => Array(columnas).fill(0));
    let turno = 1;
    let partidaFinalizada = false;

    function dibujarTablero() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                const x = j * tamañoCelda;
                const y = i * tamañoCelda;

                ctx.fillStyle = "#eee";
                ctx.fillRect(x, y, tamañoCelda, tamañoCelda);

                if (tablero[i][j] !== 0) {
                    ctx.beginPath();
                    ctx.arc(x + tamañoCelda / 2, y + tamañoCelda / 2, tamañoCelda / 2 - 10, 0, 2 * Math.PI);
                    ctx.fillStyle = tablero[i][j] === 1 ? "red" : "yellow";
                    ctx.fill();
                }
            }
        }

        dibujarLineasTablero();
    }

    function dibujarLineasTablero() {
        ctx.beginPath();

        for (let i = 1; i < filas; i++) {
            ctx.moveTo(0, i * tamañoCelda);
            ctx.lineTo(canvas.width, i * tamañoCelda);
        }

        for (let j = 1; j < columnas; j++) {
            ctx.moveTo(j * tamañoCelda, 0);
            ctx.lineTo(j * tamañoCelda, canvas.height);
        }

        ctx.strokeStyle = "#333";
        ctx.stroke();
    }

    function manejarClick(evento) {
        if (partidaFinalizada) {
            alert("La partida ha finalizado. Reinicia el juego.");
            return;
        }

        const rect = canvas.getBoundingClientRect();
        const columna = Math.floor((evento.clientX - rect.left) / tamañoCelda);

        if (realizarMovimiento(columna)) {
            dibujarTablero();

            if (hayGanador()) {
                setTimeout(() => {
                    alert("¡Jugador " + turno + " ha ganado!");
                    partidaFinalizada = true;
                }, 50);
            } else if (tableroLleno()) {
                alert("¡Empate!");
                partidaFinalizada = true;
            } else {
                cambiarTurno();
            }
        }
    }

    function realizarMovimiento(columna) {
        for (let i = filas - 1; i >= 0; i--) {
            if (tablero[i][columna] === 0) {
                tablero[i][columna] = turno;
                return true;
            }
        }
        return false;
    }

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

    function reiniciarJuego() {
        for (let i = 0; i < filas; i++) {
            for (let j = 0; j < columnas; j++) {
                tablero[i][j] = 0;
            }
        }
        turno = 1;
        partidaFinalizada = false;
        dibujarTablero();
    }

    canvas.addEventListener("click", manejarClick);
    dibujarTablero();
});
