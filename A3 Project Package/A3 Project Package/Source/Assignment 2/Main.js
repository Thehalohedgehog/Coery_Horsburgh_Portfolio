/*Use "16_CollisionDetection.html" from https://github.com/kittykatattack/learningPixi/blob/master/examples/16_collisionDetection.html
on learning Pixi JS as a refernce and starting point. Added to significantly and modifed it from there.*/
    //Aliases
		let Application = PIXI.Application,
    	Container = PIXI.Container,
	    loader = PIXI.loader,
	    resources = PIXI.loader.resources,
	    Graphics = PIXI.Graphics,
	    TextureCache = PIXI.utils.TextureCache,
	    Sprite = PIXI.Sprite,
	    Text = PIXI.Text,
	    TextStyle = PIXI.TextStyle;

	    let app = new Application({ 
	    	width: 512, 
	    	height: 512,                       
	    	antialiasing: true, 
	    	transparent: false, 
	    	resolution: 1
  			}
		);

		document.body.appendChild(app.view);

		loader //Load all the images used in the game
			.add("Resources/Warrior.png")
      .add("Resources/Lady.png")
      .add("Resources/Jorge.png")
      .add("Resources/Slime2.png")
      .add("Resources/BlueSlime.png")
      .add("Resources/GoldSlime.png")
      .add("Resources/Replay.png")
      .add("Resources/Menu.png")
      .add("Resources/DoublePoints.png")
      .add("Resources/DamageUp.png")
      .add("Resources/Boots.png")
      .add("Resources/Orb.png")
      .add("Resources/Background.png")
      .add("Resources/Title.png")
			.load(setup);

		var player, isSwinging, state, frameNo, score, highScore, time, damageMult, scoreMult, moveMult, itemDuration; //Variables
    var enemies = []; //Array to contain all the enemies
    var items = []; //Array to contain the power ups

		function setup() { //Setup the game
      background = new Sprite(resources["Resources/Background.png"].texture); //Background object for the game
      app.stage.addChild(background); //Add the BG to the stage
      title = new Sprite(resources["Resources/Title.png"].texture); //Title object for the game
      title.x = 125;
      title.y = 75;
      app.stage.addChild(title); //Add the BG to the stage
      //Create the `player` sprite 
      player = new Sprite(resources["Resources/Warrior.png"].texture);
      player.x = 256 - player.width;
      player.y = 256 - player.height; 
      player.vx = 0;
      player.vy = 0;
      player.moveSpeed = 3; //Player's movement speed
      player.damage = 5; //Player's damage
      app.stage.addChild(player); 
      

      for (var i = 0; i < 5; i++) { //Regular slimes
        slime = new Sprite(resources["Resources/Slime2.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Spawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 1;
        slime.isDead = false; //Determine's if a slime is dead and needs to respawn
        slime.respawn = 0; //Respawn timer for slime
        slime.points = 50; //Points awarded on kill
        slime.type = 1; //Type of slime
        slime.health = 50; //Current health
        slime.maxHealth = 50; //Maximum healh, used when respawning
        app.stage.addChild(slime);
        enemies.push(slime);
      }

      for (var i = 0; i < 3; i++) { //Blue slimes
        slime = new Sprite(resources["Resources/BlueSlime.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 3;
        slime.isDead = false;
        slime.respawn = 0; //Respawn timer for slime
        slime.points = 100;
        slime.type = 2;
        slime.health = 125;
        slime.maxHealth = 125;
        app.stage.addChild(slime);
        enemies.push(slime);
      }

        slime = new Sprite(resources["Resources/GoldSlime.png"].texture); //Gold slime
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 5;
        slime.isDead = false;
        slime.respawn = 0; //Respawn timer for slime
        slime.points = 500;
        slime.type = 3;
        slime.health = 250;
        slime.maxHealth = 250;
        app.stage.addChild(slime);
        enemies.push(slime);

        DoublePoints = new Sprite(resources["Resources/DoublePoints.png"].texture); //Double points item
        DoublePoints.x = 100; //Location on menu
        DoublePoints.y = 400;
        app.stage.addChild(DoublePoints);
        items.push(DoublePoints);

        DamageUp = new Sprite(resources["Resources/DamageUp.png"].texture); //Double damage item
        DamageUp.x = 200; //Location on menu
        DamageUp.y = 400;
        app.stage.addChild(DamageUp);
        items.push(DamageUp);

        Boots = new Sprite(resources["Resources/Boots.png"].texture); //Swift boots item
        Boots.x = 300; //Location on menu
        Boots.y = 400;
        app.stage.addChild(Boots);
        items.push(Boots);

        Orb = new Sprite(resources["Resources/Orb.png"].texture); //300 point orb item
        Orb.x = 400; //Location on menu
        Orb.y = 400;
        app.stage.addChild(Orb);
        items.push(Orb);

        itemDuration = 0; //Items last 10 seconds, will count down to zero



      restartButton = new Sprite(resources["Resources/Replay.png"].texture); //Replay buttton for once a game has ended
      restartButton.y = 256 - restartButton.height; //Position
      restartButton.x = 256 - restartButton.width - 20;
      app.stage.addChild(restartButton);

      restartButton.interactive = true; //Set it so the button can be clicked on
      restartButton.buttonMode = true;

      menuButton = new Sprite(resources["Resources/Menu.png"].texture); //Button to return to the menu after a game
      menuButton.y = 256 - menuButton.height; //Position
      menuButton.x = 256 + 20;
      app.stage.addChild(menuButton);

      menuButton.interactive = true; //Set it so the button can be clicked on
      menuButton.buttonMode = true;

      menuButton.visible = false; //Make the buttons invisible at first because you start in the menu
      restartButton.visible = false;

      character1 = new Sprite(resources["Resources/Warrior.png"].texture); //Button to select the first character
      character1.x = 256 - character1.width - 50;
      character1.y = 256 - character1.height;
      character1.interactive = true;
      character1.buttonMode = true;
      app.stage.addChild(character1);

      character2 = new Sprite(resources["Resources/Lady.png"].texture); //Button to select the second character
      character2.x = 256 - character2.width;
      character2.y = 256 - character2.height;
      character2.interactive = true;
      character2.buttonMode = true;
      app.stage.addChild(character2);
      character3 = new Sprite(resources["Resources/Jorge.png"].texture); //Button to select the third character
      character3.x = 256 - character3.width + 50;
      character3.y = 256 - character3.height;
      character3.interactive = true;
      character3.buttonMode = true;
      app.stage.addChild(character3);

      //Capture the keyboard arrow keys
      let left = keyboard(37),
          up = keyboard(38),
          right = keyboard(39),
          down = keyboard(40),
          space = keyboard(32);


      //Left arrow key `press` method
      left.press = () => {
        //Change the player's velocity when the key is pressed
        player.vx = -player.moveSpeed * moveMult; //Set the velocity to the player's movement speed times the current move multiplier (for power up)
        //player.vy = 0;
      };
      
      //Left arrow key `release` method
      left.release = () => {
        //If the left arrow has been released, and the right arrow isn't down,
        //and the player isn't moving vertically:
        //Stop the player
        if (!right.isDown) {
          player.vx = 0;
        }
      };

      //Up
      up.press = () => {
        player.vy = -player.moveSpeed * moveMult;
        //player.vx = 0;
      };
      up.release = () => {
        if (!down.isDown) {
          player.vy = 0;
        }
      };

      //Right
      right.press = () => {
        player.vx = player.moveSpeed * moveMult;
        //player.vy = 0;
      };
      right.release = () => {
        if (!left.isDown) {
          player.vx = 0;
        }
      };

      //Down
      down.press = () => {
        player.vy = player.moveSpeed * moveMult;
        //player.vx = 0;
      };
      down.release = () => {
        if (!up.isDown) {
          player.vy = 0;
        }
      };
      space.press = () => { //Enemies will be damage if the player touches them and "isSwinging" is true
        isSwinging = true;
      }
      space.release = () => {
        isSwinging = false;
      }

      let style = new TextStyle({ //Font style for text
        fontFamily: "sans-serif",
        fontSize: 18,
        fill: "black",
        stroke: "white",
        strokeThickness: 5,
      }); 

      frameNo = 0; //Frame number, used to track time in game. Game is 60 frames/sec
      score = 0; //Current score
      highScore = 0; //High score
      scoreDisp = new Text(score, style); //Text to display current score
      scoreDisp.position.set(8,8);
      app.stage.addChild(scoreDisp);

      highScoreDisp = new Text(highScore, style); //Text to display high score
      highScoreDisp.position.set(200,8);
      app.stage.addChild(highScoreDisp);

      timeDisp = new Text("Time: " + time, style); //Text to display time left in game
      timeDisp.position.set(400, 8);
      app.stage.addChild(timeDisp);

      characterPromt = new Text("Click a character to play!", style); //Text to display how to select a character
      characterPromt.position.set(160, 175);
      app.stage.addChild(characterPromt);

      controls = new Text("Arrow keys to move, space to attack", style) //Text to display the controls of the game
      controls.position.set(110, 275);
      app.stage.addChild(controls);

      itemExplain = new Text("Items", style); //Text to display what the items are
      itemExplain.position.set(240, 375);
      app.stage.addChild(itemExplain);

      DoublePointsExplain = new Text("Double\nPoints", style); //Text to display double points item
      DoublePointsExplain.position.set(100, 450);
      app.stage.addChild(DoublePointsExplain);

      DamageUpExplain = new Text("Double\nDamage", style); //Text to display double damage item
      DamageUpExplain.position.set(200, 450);
      app.stage.addChild(DamageUpExplain);

      BootsExplain = new Text("Double\nSpeed", style); //Text to display double speed item
      BootsExplain.position.set(300, 450);
      app.stage.addChild(BootsExplain);

      OrbExplain = new Text("300\nPoints", style); //Text to display 300 points item
      OrbExplain.position.set(400, 450);
      app.stage.addChild(OrbExplain);

      isSwinging = false; //Set is swing to false to start
      moveMult = 1; //Set multipliers to 1 at start of game
      scoreMult = 1;
      damageMult = 1;

      //Set the game state
      state = menu; //Start on the main menu
     
      //Start the game loop
      app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) { //Play game state
  //Use the player's velocity to make it move
  player.x += player.vx;
  player.y += player.vy;

  //Stop the player at the edges of the screen
  if (player.x <= 0) { //Left
  	player.x += player.moveSpeed * moveMult
  }
  if (player.x >= 512 - player.width) { //Right, use their width to determine where to stop them
  	player.x -= player.moveSpeed * moveMult
  }
  if (player.y <= 0) { //Top
  	player.y += player.moveSpeed * moveMult
  }
  if (player.y >= 512 - player.height) { //Bottom, use their height to determine where to stop them
  	player.y -= player.moveSpeed * moveMult
  }

  if (frameNo % 120 == 0) { //Change the slime's movement every 2 seconds, use frame number to track time
    for (var i = 0; i < enemies.length; i++) { //For all enemies in array
      enemiesMove(enemies[i]);
    }
  }

  for (var i = 0; i < enemies.length; i++) { //Update enemies
      enemyBoundsCheck(enemies[i]);
      updateEnemy(enemies[i], player);
    }

  if (frameNo == 1200 || frameNo == 2400) { //Spawn a random item at 40 seconds and 20 seconds
    spawnItem();
  }

  if (hitTestRectangle(player, DoublePoints)) { //Double points item touched
    scoreMult = 2; //Increase multiplier
    itemDuration = 600; //Items last 10 seconds;
    DoublePoints.x = 1000; //Move item off screen
    DoublePoints.y = 1000;
  }
  if (hitTestRectangle(player, DamageUp)) { //Double damage item touched
    damageMult = 2;
    itemDuration = 600; //Items last 10 seconds;
    DamageUp.x = 1000;
    DamageUp.y = 1000;
  }
  if (hitTestRectangle(player, Boots)) { //Quick boots item touched
    moveMult = 2;
    itemDuration = 600; //Items last 10 seconds;
    Boots.x = 1000;
    Boots.y = 1000;
  }
  if (hitTestRectangle(player, Orb)) { //Magic orb item touched
    score += 300;
    Orb.x = 1000;
    Orb.y = 1000;
    if (score > highScore) { //Update high score if new one is gotten
        highScore = score;
    }
  }
  if (itemDuration > 0) { //Decrease item timer each frame when it is above 0
    itemDuration--;
  }
  else if (itemDuration <= 0) { //Reset multiplers once item expires
    scoreMult = 1;
    damageMult = 1;
    moveMult = 1;
  }


  
  frameNo++; //Increase frame number to track time of game
  scoreDisp.text = ("Score: " + score); //Update score display
  highScoreDisp.text = ("High score: " + highScore); //Update high score display
  time = 60 - (frameNo / 60); //Update time
  timeDisp.text = ("Time: " + time.toFixed(2)); //Update timer display
  restartButton.visible = false; //Make the menu objects invisible during gameplay
  menuButton.visible = false;
  character1.visible = false;
  character2.visible = false;
  character3.visible = false;

  if (time <= 0) {
    state = end;
  }
}

function end() { //End of game state
  restartButton.visible = true; //Make buttons appear after a game has ended
  menuButton.visible = true;
  restartButton.on('pointerdown', startLevel); //Call function when the button is clicked
  menuButton.on('pointerdown', onMenuClick);
}

function menu() { //Menu screen state
  character1.visible = true; //Make character buttons visible
  character2.visible = true;
  character3.visible = true;
  characterPromt.visible = true; //Make text explainations visible
  controls.visible = true;
  itemExplain.visible = true;
  DoublePointsExplain.visible = true; //Make items visible to go along with text explainations
  DamageUpExplain.visible = true;
  BootsExplain.visible = true;
  OrbExplain.visible = true;
  menuButton.visible = false; //Make end of game buttons invisible
  restartButton.visible = false;
  background.visible = false; //Make the background visible
  title.visible = true; //Make the title invisible
  for (var i = 0; i < enemies.length; i++) { //Make all enemies invisible
      enemies[i].visible = false;
    }
    player.visible = false; //Make the player character invisible
    DoublePoints.x = 100; //Reset item postions to line up with explainations, in case a game has been played and they moved
    DoublePoints.y = 400;
    DoublePoints.visible = true; //Make items visible
    DamageUp.x = 200;
    DamageUp.y = 400;
    DamageUp.visible = true;
    Boots.x = 300;
    Boots.y = 400;
    Boots.visible = true;
    Orb.x = 400;
    Orb.y = 400;
    Orb.visible = true;
  character1.on('pointerdown', characterSelect1); //Call functions for which character is selected
  character2.on('pointerdown', characterSelect2);
  character3.on('pointerdown', characterSelect3);
}

function onMenuClick() { //Set the state to "menu" when the menu button is clicked after a game
  state = menu;
}

function characterSelect1() { //Character 1 (Warrior) selected
  player.texture = resources["Resources/Warrior.png"].texture; //Set the correct image to the sprite
  player.moveSpeed = 4; //Set the stats
  player.damage = 5;
  startLevel(); //Start the game
}

function characterSelect2() { //Character 3 (Lady) selected
  player.texture = resources["Resources/Lady.png"].texture;
  player.moveSpeed = 5;
  player.damage = 3;
  startLevel();
}

function characterSelect3() { //Character 3 (Jorge) selected
  player.texture = resources["Resources/Jorge.png"].texture;
  player.moveSpeed = 3;
  player.damage = 10;
  startLevel();
}

function hitTestRectangle(r1, r2) { //Test if two sprite objects are touching

  //Define the variables we'll need to calculate
  let hit, combinedHalfWidths, combinedHalfHeights, vx, vy;

  //hit will determine whether there's a collision
  hit = false;

  //Find the center points of each sprite
  r1.centerX = r1.x + r1.width / 2; 
  r1.centerY = r1.y + r1.height / 2; 
  r2.centerX = r2.x + r2.width / 2; 
  r2.centerY = r2.y + r2.height / 2; 

  //Find the half-widths and half-heights of each sprite
  r1.halfWidth = r1.width / 2;
  r1.halfHeight = r1.height / 2;
  r2.halfWidth = r2.width / 2;
  r2.halfHeight = r2.height / 2;

  //Calculate the distance vector between the sprites
  vx = r1.centerX - r2.centerX;
  vy = r1.centerY - r2.centerY;

  //Figure out the combined half-widths and half-heights
  combinedHalfWidths = r1.halfWidth + r2.halfWidth;
  combinedHalfHeights = r1.halfHeight + r2.halfHeight;

  //Check for a collision on the x axis
  if (Math.abs(vx) < combinedHalfWidths) {

    //A collision might be occurring. Check for a collision on the y axis
    if (Math.abs(vy) < combinedHalfHeights) {

      //There's definitely a collision happening
      hit = true;
    } else {

      //There's no collision on the y axis
      hit = false;
    }
  } else {

    //There's no collision on the x axis
    hit = false;
  }

  //`hit` will be either `true` or `false`
  return hit;
};

//The `keyboard` helper function
function keyboard(keyCode) {
  var key = {};
  key.code = keyCode;
  key.isDown = false;
  key.isUp = true;
  key.press = undefined;
  key.release = undefined;
  //The `downHandler`
  key.downHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isUp && key.press) key.press();
      key.isDown = true;
      key.isUp = false;
    }
    event.preventDefault();
  };

  //The `upHandler`
  key.upHandler = event => {
    if (event.keyCode === key.code) {
      if (key.isDown && key.release) key.release();
      key.isDown = false;
      key.isUp = true;
    }
    event.preventDefault();
  };

  //Attach event listeners
  window.addEventListener(
    "keydown", key.downHandler.bind(key), false
  );
  window.addEventListener(
    "keyup", key.upHandler.bind(key), false
  );
  return key;
}

function enemiesMove(slime) { //Make the enemies move
  var move; //Variable to determine movment direction
  move = Math.floor(Math.random() * 4); //Random number between 0 and 4
  if (slime.isDead == false) { //Don't move the slime while it is dead
    if (move == 0) { //Move right
      slime.vx = slime.moveSpeed;
      slime.vy = 0;
    }
    else if (move == 1) { //Move left
      slime.vx = -slime.moveSpeed;
      slime.vy = 0;
    }
    else if (move == 2) { //Move down
      slime.vx = 0
      slime.vy = slime.moveSpeed;
    }
    else if (move == 3) { //Move up
      slime.vx = 0
      slime.vy = -slime.moveSpeed;
    }
  }
  
}

function enemyBoundsCheck(slime) { //Stop slime from goong off screen
  if (slime.isDead == false) { //Only do if slime is not dead
    if (slime.x <= 0) { //Left bounds check
      slime.vx = 0;
      slime.x += 3;
      enemiesMove(slime); //Move in a random direction instead
    }
    if (slime.x >= 480) { //Right bounds check
      slime.vx = 0;
      slime.x -= 3;
      enemiesMove(slime);
    }
    if (slime.y <= 0) { //Top bounds check
      slime.vy = 0;
      slime.y += 3;
      enemiesMove(slime);
    }
    if (slime.y >= 480) { //Bottom bounds check
      slime.vy = 0;
      slime.y -= 3;
      enemiesMove(slime);
    }
  }
}

function updateEnemy(slime, player) { //Update the enemies and their various values
  slime.x += slime.vx; //Update position
  slime.y += slime.vy;

  if (hitTestRectangle(player, slime) && isSwinging == true) { //Check if hit by player and player is attacking
      slime.health -= player.damage * damageMult; //Damage slime
      if (slime.health <= 0) { //If slime is dead
        slime.y = 1000; //Send slime off screen
        slime.x = 1000;
        slime.vx = 0; //Stop slime from moving
        slime.vy = 0;
        slime.isDead = true; //Let the slime know it is dead
        score += slime.points * scoreMult; //Add points to score
        if (score > highScore) { //Update high score if new one is gotten
          highScore = score;
        }
    }
  }

  if (slime.type == 2 && frameNo < 1200) { //Keep blue slimes off screen until 20 seconds has passed
    slime.y = 1000; //Send slime off screen
    slime.x = 1000;
    slime.vx = 0; //Stop slime from moving
    slime.vy = 0;
  }
  else if (slime.type == 2 && frameNo == 1200) { //Once 20 seconds has passed start spawning blue slimes
    slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
    slime.y = Math.floor(Math.random() * 480);
  }

  if (slime.type == 3 && frameNo < 1800) { //Keep gold slime off screen until 30 seconds has passed
    slime.y = 1000; //Send slime off screen
    slime.x = 1000;
    slime.vx = 0; //Stop slime from moving
    slime.vy = 0;
  }
  else if (slime.type == 3 && frameNo == 1800) { //Once 20 seconds has passed start spawning gold slime
    slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
    slime.y = Math.floor(Math.random() * 480);
  }

  if (slime.isDead == true) { //Start respawn timer once slime is dead
    slime.respawn++ ;
  }

  if (slime.respawn == 300 * slime.type) { //After (5 * type) seconds respawn slime
    slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
    slime.y = Math.floor(Math.random() * 480);
    slime.isDead = false; //Reset death values and health
    slime.respawn = 0;
    slime.health = slime.maxHealth;
    enemiesMove(slime); //Start moving slime
  }
}

function startLevel() { //Load a game
  player.x = 256 - player.width; //Start player in center of arena
  player.y = 256 - player.height;
  player.vx = 0; //Make sure player is not moving at start
  player.vy = 0;
  frameNo = 0; //Reset frame count for tracking time
  score = 0; //Reset score

  for (var i = 0; i < enemies.length; i++) { //Reset enemies
      enemies[i].respawn = 300 * enemies[i].type; //Reset enemey respawn timer
      enemies[i].isDead = false; //Set slime to not be dead
      enemies[i].visible = true; //Make slime visible
      updateEnemy(enemies[i], player);
    }

    for (var i = 0; i < items.length; i++) { //Reset items
      items[i].visible = false; //Make items invisible
      items[i].x = 1000; //Move items off screen
      items[i].y = 1000;
    }
    scoreMult = 1; //Reset multipliers
    damageMult = 1;
    moveMult = 1;
    player.visible = true; //Make player visible
    characterPromt.visible = false; //Make menu objects (text and buttons) invisible
    controls.visible = false;
    itemExplain.visible = false;
    DoublePointsExplain.visible = false;
    DamageUpExplain.visible = false;
    BootsExplain.visible = false;
    OrbExplain.visible = false;
    background.visible = true; //Make background visible
    title.visible = false; //Make the title invisible
    state = play; //Set state to "play"
}

function spawnItem() { //Spawn items during game
  item = items[Math.floor(Math.random() * items.length)]; //Choose a random item
  item.x = Math.floor(Math.random() * 480); //spawn somewhere random
  item.y = Math.floor(Math.random() * 480);
  item.visible = true; //Make item visible
}