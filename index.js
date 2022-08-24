const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

//game size
const canvasWidth = (canvas.width = 1024);
const canvasHeight = (canvas.height = 576);

//canvas fill
//fillRect(positionX, positionY, width, height)
c.fillRect(0, 0, canvasWidth, canvasHeight);

//global gravity for our game
const gravity = 0.7;

class Sprite {
  //using object destructing we created properties in our constructor function, meaning when we call a new Sprite we need to define our properties with object syntax see player example === OOO
  constructor({ position, velocity, color = "red", offset }) {
    this.position = position;
    this.velocity = velocity;
    this.width = 50;
    this.height = 150;
    this.lastKey;
    (this.attackBox = {
      position: {
        x: this.position.x,
        y: this.position.y,
      },
      offset, //attack box will always be with our Sprite position
      width: 100,
      height: 50,
    }),
      (this.color = color);
    this.isAttacking;
  }

  //will draw our sprite object
  draw() {
    c.fillStyle = this.color;
    c.fillRect(this.position.x, this.position.y, this.width, this.height);

    //attack box
    if (this.isAttacking) {
      c.fillStyle = "green";
      c.fillRect(
        this.attackBox.position.x,
        this.attackBox.position.y,
        this.attackBox.width,
        this.attackBox.height
      );
    }
  }

  //update will update our player sprites movements
  update() {
    this.draw();
    this.attackBox.position.x = this.position.x + this.attackBox.offset.x;
    this.attackBox.position.y = this.position.y;

    this.position.x += this.velocity.x;
    this.position.y += this.velocity.y;

    //if true player will fall
    if (this.position.y + this.height + this.velocity.y >= canvasHeight) {
      this.velocity.y = 0;
      //when false gravity will stop sprite from falling
    } else {
      this.velocity.y += gravity;
    }
  }

  attack() {
    this.isAttacking = true;

    setTimeout(() => {
      this.isAttacking = false;
    }, 100);
  }
}
///////////////
//Example 000
const player = new Sprite({
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
});

const enemy = new Sprite({
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

function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
      rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
      rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
      rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + enemy.height
  );
}

/**
 * will loop infinite to create an animation
 */
function animate() {
  //will loop over animate infinitly
  window.requestAnimationFrame(animate);
  //fill our canvas black
  c.fillStyle = "black";
  c.fillRect(0, 0, canvasWidth, canvasHeight);

  player.update();
  enemy.update();

  //guard that resets velocity for key event - will stop movement
  player.velocity.x = 0;
  enemy.velocity.x = 0;
  //player movement
  //if pressed velocity will be in either direction for a and d
  if (keys.a.pressed && player.lastKey === "a") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
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
    document.querySelector("#enemyHealth").style.width = "20%";
  }

  if (
    (rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }),
    enemy.isAttacking)
  ) {
    enemy.isAttacking = false;
    console.log("enemy attack successful");
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
