const gameContainer = document.getElementById("game-container");
const spaceship = document.getElementById("spaceship");
const scoreDisplay = document.getElementById("score");

let score = 0;
let gameInterval;
let asteroidInterval;

// Load sound effects
const laserSound = new Audio("mixkit-retro-game-notification-212.wav");
const explosionSound = new Audio("mixkit-short-laser-gun-shot-1670.wav");

// Spaceship movement
let spaceshipPosition = 375; // Initial position
document.addEventListener("keydown", (event) => {
    if (event.code === "ArrowLeft" && spaceshipPosition > 0) {
        spaceshipPosition -= 20;
        spaceship.style.left = spaceshipPosition + "px";
    } else if (event.code === "ArrowRight" && spaceshipPosition < 750) {
        spaceshipPosition += 20;
        spaceship.style.left = spaceshipPosition + "px";
    } else if (event.code === "Space") {
        shootLaser();
    }
});

// Function to shoot lasers
function shootLaser() {
    const laser = document.createElement("div");
    laser.classList.add("laser");
    laser.style.left = spaceshipPosition + 25 + "px";
    laser.style.bottom = "70px";
    gameContainer.appendChild(laser);

    laserSound.play(); // Play laser sound

    const laserInterval = setInterval(() => {
        const laserBottom = parseInt(window.getComputedStyle(laser).bottom);
        if (laserBottom >= 800) {
            laser.remove();
            clearInterval(laserInterval);
        } else {
            laser.style.bottom = laserBottom + 2 + "px";
            checkLaserCollision(laser, laserInterval);
        }
    }, 20);
}

// Function to spawn asteroids
function spawnAsteroid() {
    const asteroid = document.createElement("div");
    asteroid.classList.add("asteroid");
    asteroid.style.left = Math.floor(Math.random() * 750) + "px";
    asteroid.style.top = "-40px";
    gameContainer.appendChild(asteroid);

    const asteroidInterval = setInterval(() => {
        const asteroidTop = parseInt(window.getComputedStyle(asteroid).top);
        if (asteroidTop >= 600) {
            asteroid.remove();
            clearInterval(asteroidInterval);
        } else {
            asteroid.style.top = asteroidTop + 4 + "px";
            checkGameOver(asteroid, asteroidInterval);
        }
    }, 30);
}

// Check for laser-asteroid collisions
function checkLaserCollision(laser, laserInterval) {
    const laserRect = laser.getBoundingClientRect();
    const asteroids = document.querySelectorAll(".asteroid");

    asteroids.forEach((asteroid) => {
        const asteroidRect = asteroid.getBoundingClientRect();

        if (
            laserRect.left < asteroidRect.right &&
            laserRect.right > asteroidRect.left &&
            laserRect.top < asteroidRect.bottom &&
            laserRect.bottom > asteroidRect.top
        ) {
            asteroid.remove();
            laser.remove();
            clearInterval(laserInterval);
            explosionSound.play(); // Play explosion sound
            score += 10; // Increase the score by 10
            updateScoreDisplay(); // Update the score on the screen
        }
    });
}

// Check for game over
function checkGameOver(asteroid, asteroidInterval) {
    const asteroidRect = asteroid.getBoundingClientRect();
    const spaceshipRect = spaceship.getBoundingClientRect();

    if (
        asteroidRect.left < spaceshipRect.right &&
        asteroidRect.right > spaceshipRect.left &&
        asteroidRect.top < spaceshipRect.bottom &&
        asteroidRect.bottom > spaceshipRect.top
    ) {
        clearInterval(gameInterval);
        clearInterval(asteroidInterval);
        alert(`Game Over! Final Score: ${score}`);
        window.location.reload(); // Reload the page to restart the game
    }
}

// Update the score display
function updateScoreDisplay() {
    scoreDisplay.textContent = `Score: ${score}`; // Update the score shown on the screen
}

// Start the game
function startGame() {
    gameInterval = setInterval(() => {
        spawnAsteroid();
    }, 1000);
}

startGame();