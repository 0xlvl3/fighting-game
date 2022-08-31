const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//game size
const canvasWidth = (canvas.width = 1024);
const canvasHeight = (canvas.height = 576);

const textDisplay = document.querySelector("#displayText");

//canvas fill
//fillRect(positionX, positionY, width, height)
c.fillRect(0, 0, canvasWidth, canvasHeight);

//background spirte
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: `./img/background.png`,
});

const shop = new Sprite({
  position: {
    x: 640,
    y: 128,
  },
  imageSrc: `./img/shop.png`,
  scale: 2.75,
  framesMax: 6,
});

//global gravity for our game
const gravity = 0.7;

///////////////
//Example 000
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
  imageSrc: `./img/samuraiMack/Idle.png`,
  framesMax: 8,
  scale: 2.5,
  offset: {
    x: 215,
    y: 157,
  },
  sprites: {
    idle: {
      imageSrc: `./img/samuraiMack/Idle.png`,
      framesMax: 8,
    },
    run: {
      imageSrc: `./img/samuraiMack/Run.png`,
      framesMax: 8,
    },
    jump: {
      imageSrc: `./img/samuraiMack/Jump.png`,
      framesMax: 2,
    },
    fall: {
      imageSrc: `./img/samuraiMack/Fall.png`,
      framesMax: 2,
    },
    attack1: {
      imageSrc: `./img/samuraiMack/Attack1.png`,
      framesMax: 6,
    },
  },
});

const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  offset: {
    x: -50,
    y: 0,
  },
  color: "blue",
});

console.log(player);

//object that will have all keys that control our game
const keys = {
  a: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  w: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
  ArrowUp: {
    pressed: false,
  },
};

decreaseTimer();

/**
 * will loop infinite to create an animation
 */
function animate() {
  //will loop over animate infinitly
  window.requestAnimationFrame(animate);
  //fill our canvas black
  c.fillStyle = "black";
  c.fillRect(0, 0, canvasWidth, canvasHeight);
  background.update();
  shop.update();

  player.update();
  // enemy.update();

  //guard that resets velocity for key event - will stop movement
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player movement
  //if pressed velocity will be in either direction for a and d
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
    player.switchSprite("run");
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
    player.switchSprite("run");
  } else {
    player.switchSprite("idle");
  }
  if (player.velocity.y < 0) {
    player.switchSprite("jump");
  } else if (player.velocity.y > 0) {
    player.switchSprite("fall");
  }

  //Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  //detect for collision
  if (
    (rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }),
    player.isAttacking)
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    (rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }),
    enemy.isAttacking)
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  //end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

/**
 * when user takes presses * key, sprite will move
 */
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    //player keys
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;
    case "a":
      keys.a.pressed = true;
      player.lastKey = "a";
      break;
    case "w":
      player.velocity.y = -20;
      break;
    case " ":
      player.attack();
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;
    case "ArrowUp":
      enemy.velocity.y = -20;
      break;
    case "ArrowDown":
      enemy.attack();
      break;
  }
});

/**
 * when user takes hand off key, sprite stops moving
 */
window.addEventListener("keyup", (e) => {
  switch (e.key) {
    //player keys
    case "d":
      keys.d.pressed = false;
      break;
    case "a":
      keys.a.pressed = false;
      break;
    case "w":
      keys.w.pressed = false;
      lastKey = "w";
      break;

    //enemy keys
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;
    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;
    case "ArrowUp":
      keys.ArrowUp.pressed = false;
      break;
  }
});
