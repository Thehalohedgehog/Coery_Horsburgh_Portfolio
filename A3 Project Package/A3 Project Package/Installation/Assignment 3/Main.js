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
	    	height: 612,                       
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
      .add("Resources/Axe.png")
      .add("Resources/Sword.png")
      .add("Resources/Sword2.png")
      .add("Resources/Slime2.png")
      .add("Resources/BlueSlime.png")
      .add("Resources/GoldSlime.png")
      .add("Resources/PurpleSlime.png")
      .add("Resources/RedSlime.png")
      .add("Resources/BlackSlime.png")
      .add("Resources/Replay.png")
      .add("Resources/Menu.png")
      .add("Resources/DoublePoints.png")
      .add("Resources/DamageUp.png")
      .add("Resources/Boots.png")
      .add("Resources/Orb.png")
      .add("Resources/Blast.png")
      .add("Resources/Background.png")
      .add("Resources/Background2.png")
      .add("Resources/Background3.png")
      .add("Resources/Background4.png")
      .add("Resources/Title.png")
      .add("Resources/BluePortal.png")
      .add("Resources/OrangePortal.png")
      .add("Resources/Lava.png")
      .add("Resources/LavaTop.png")
      .add("Resources/LavaBottom.png")
      .add("Resources/LavaRight.png")
      .add("Resources/LavaLeft.png")
      .add("Resources/Block.png")
      .add("Resources/BlockTop.png")
      .add("Resources/BlockBottom.png")
      .add("Resources/BlockLeft.png")
      .add("Resources/BlockRight.png")
      .add("Resources/HealthBar.png")
      .add("Resources/Arena1Button.png")
      .add("Resources/Arena1ButtonOn.png")
      .add("Resources/Arena2Button.png")
      .add("Resources/Arena2ButtonOn.png")
      .add("Resources/Arena3Button.png")
      .add("Resources/Arena3ButtonOn.png")
      .add("Resources/Arena4Button.png")
      .add("Resources/Arena4ButtonOn.png")
      .add("Resources/PlayButton.png")
      .add("Resources/CharacterSelect.png")
      .add("Resources/OneMinuteButton.png")
      .add("Resources/OneMinuteButtonOn.png")
      .add("Resources/OneAndHalfMinuteButton.png")
      .add("Resources/OneAndHalfMinuteButtonOn.png")
      .add("Resources/TwoMinuteButton.png")
      .add("Resources/TwoMinuteButtonOn.png")
      .add("Resources/ThreeMinuteButton.png")
      .add("Resources/ThreeMinuteButtonOn.png")
      .add("Resources/MusicOn.png")
      .add("Resources/MusicOff.png")
      .add("Resources/SoundsOn.png")
      .add("Resources/SoundsOff.png")
      .add("Resources/PauseButton.png")
      .add("Resources/Paused.png")
      .add("Resources/TitleScreen.png")
			.load(setup);

		var player, isSwinging, state, frameNo, score, highScore, time, timeLimit, damageMult, scoreMult, moveMult, damageDuration, pointsDuration,
    bootsDuration, pointsGot, damageGot, bootsGot, itemGot, itemTime, itemNum, arenaNum, swingCooldown, portalCooldown, numEnemies, currentEnemies,
    musicMuted, soundsMuted, paused; //Variables
    var woosh = new Audio("Resources/Woosh.wav"); //Attack sound
    var splat = new Audio("Resources/Splat.wav"); //Enemy death sound
    var powerUpOne = new Audio("Resources/Powerup3.wav"); //Damage, point boost and boots items collected sound
    var powerUpTwo = new Audio("Resources/Powerup4.wav"); //Orb and blast items collected sound
    var teleportSound = new Audio("Resources/Teleport.wav"); //Teleport sound for portals and black slimes
    var hitSound = new Audio("Resources/HitSlime.wav"); //Enemy hurt (but not killed) sound
    var battleMusic = new Audio("Resources/BattleMusic.mp3"); //Battle music
    var menuMusic = new Audio("Resources/MenuMusic.mp3"); //Menu music
    var enemies = []; //Array to contain all the enemies
    var mapOneEnemies = []; //Array for enemeies in map 1
    var mapTwoEnemies = []; //Array for enemeies in map 2
    var mapThreeEnemies = []; //Array for enemeies in map 3
    var mapFourEnemies = []; //Array for enemeies in map 4
    var items = []; //Array to contain the power ups
    var lavaPool = []; //Array for the lava objects
    var blockArray = []; //Array for the block objects
    var healthBars = []; //Array for health bars of enemies

		function setup() { //Setup the game
      background = new Sprite(resources["Resources/TitleScreen.png"].texture); //Background object for the game
      app.stage.addChild(background); //Add the BG to the stage

      lava = new Sprite(resources["Resources/Lava.png"].texture); //lava pool for map 4
      lava.x = 256 - lava.width/2;
      lava.y = 256 - lava.height/2;
      app.stage.addChild(lava);
      lavaPool.push(lava);

      lavaTop = new Sprite(resources["Resources/LavaTop.png"].texture); //lavaTop pool for map 4
      lavaTop.x = 256 - lavaTop.width/2;
      lavaTop.y = 256 - lava.height/2;
      app.stage.addChild(lavaTop);
      lavaPool.push(lavaTop);

      lavaBottom = new Sprite(resources["Resources/LavaBottom.png"].texture); //lavaBottom pool for map 4
      lavaBottom.x = 256 - lava.width/2;
      lavaBottom.y = 256 + lava.height/2 - lavaBottom.height;
      app.stage.addChild(lavaBottom);
      lavaPool.push(lavaBottom);

      lavaLeft = new Sprite(resources["Resources/LavaLeft.png"].texture); //lavaLeft pool for map 4
      lavaLeft.x = 256 - lava.width/2;
      lavaLeft.y = 256 - lava.height/2;
      app.stage.addChild(lavaLeft);
      lavaPool.push(lavaLeft);

      lavaRight = new Sprite(resources["Resources/LavaRight.png"].texture); //lavaRight pool for map 4
      lavaRight.x = 256 + lava.width/2 - lavaRight.width;
      lavaRight.y = 256 - lava.height/2;
      app.stage.addChild(lavaRight);
      lavaPool.push(lavaRight);

      blockOne = new Sprite(resources["Resources/Block.png"].texture); //block for map 3
      blockOne.x = 128 - blockOne.width/2;
      blockOne.y = 128 - blockOne.height/2;
      app.stage.addChild(blockOne);
      blockArray.push(blockOne);

      blockOneTop = new Sprite(resources["Resources/BlockTop.png"].texture); //blockOneTop for map 3
      blockOneTop.x = 128 - blockOneTop.width/2;
      blockOneTop.y = 128 - blockOne.height/2;
      app.stage.addChild(blockOneTop);
      blockArray.push(blockOneTop);

      blockOneBottom = new Sprite(resources["Resources/BlockBottom.png"].texture); //blockOneBottom for map 3
      blockOneBottom.x = 128 - blockOne.width/2;
      blockOneBottom.y = 128 + blockOne.height/2 - blockOneBottom.height;
      app.stage.addChild(blockOneBottom);
      blockArray.push(blockOneBottom);

      blockOneLeft = new Sprite(resources["Resources/BlockLeft.png"].texture); //blockOneLeft for map 3
      blockOneLeft.x = 128 - blockOne.width/2;
      blockOneLeft.y = 128 - blockOne.height/2;
      app.stage.addChild(blockOneLeft);
      blockArray.push(blockOneLeft);

      blockOneRight = new Sprite(resources["Resources/BlockRight.png"].texture); //blockOneRight for map 3
      blockOneRight.x = 128 + blockOne.width/2 - blockOneRight.width;
      blockOneRight.y = 128 - blockOne.height/2;
      app.stage.addChild(blockOneRight);
      blockArray.push(blockOneRight);

      blockTwo = new Sprite(resources["Resources/Block.png"].texture); //block for map 3
      blockTwo.x = 384 - blockTwo.width/2;
      blockTwo.y = 384 - blockTwo.height/2;
      app.stage.addChild(blockTwo);
      blockArray.push(blockTwo);

      blockTwoTop = new Sprite(resources["Resources/BlockTop.png"].texture); //blockTwoTop for map 3
      blockTwoTop.x = 384 - blockTwoTop.width/2;
      blockTwoTop.y = 384 - blockTwo.height/2;
      app.stage.addChild(blockTwoTop);
      blockArray.push(blockTwoTop);

      blockTwoBottom = new Sprite(resources["Resources/BlockBottom.png"].texture); //blockTwoBottom for map 3
      blockTwoBottom.x = 384 - blockTwo.width/2;
      blockTwoBottom.y = 384 + blockTwo.height/2 - blockTwoBottom.height;
      app.stage.addChild(blockTwoBottom);
      blockArray.push(blockTwoBottom);

      blockTwoLeft = new Sprite(resources["Resources/BlockLeft.png"].texture); //blockTwoLeft for map 3
      blockTwoLeft.x = 384 - blockTwo.width/2;
      blockTwoLeft.y = 384 - blockTwo.height/2;
      app.stage.addChild(blockTwoLeft);
      blockArray.push(blockTwoLeft);

      blockTwoRight = new Sprite(resources["Resources/BlockRight.png"].texture); //blockTwoRight for map 3
      blockTwoRight.x = 384 + blockTwo.width/2 - blockTwoRight.width;
      blockTwoRight.y = 384 - blockTwo.height/2;
      app.stage.addChild(blockTwoRight);
      blockArray.push(blockTwoRight);
      
      //Create the enemies
      for (var i = 0; i < 10; i++) { //Regular slimes
        slime = new Sprite(resources["Resources/Slime2.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Spawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 1;
        slime.isDead = false; //Determine's if a slime is dead and needs to respawn
        slime.respawn = 60; //Respawn timer for slime
        slime.respawnTime = 60; //Value in frames it takes for a slime to respawn
        slime.points = 50; //Points awarded on kill
        slime.type = 1; //Type of slime
        slime.health = 9; //Current health
        slime.maxHealth = 9; //Maximum healh, used when respawning
        slime.isActive = true; //If a slime is active on current map
        app.stage.addChild(slime);
        enemies.push(slime); //Add to the pool of all enemies
        mapOneEnemies.push(slime); //Add to the pool of map specific enemies
        mapTwoEnemies.push(slime);
        mapThreeEnemies.push(slime);
        mapFourEnemies.push(slime);
      }

      for (var i = 0; i < 5; i++) { //Blue slimes
        slime = new Sprite(resources["Resources/BlueSlime.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 3;
        slime.isDead = false;
        slime.respawn = 180; //Respawn timer for slime
        slime.respawnTime = 180;
        slime.points = 100;
        slime.type = 2;
        slime.health = 12;
        slime.maxHealth = 12;
        slime.isActive = true;
        app.stage.addChild(slime);
        enemies.push(slime);
        mapOneEnemies.push(slime);
        mapTwoEnemies.push(slime);
        mapThreeEnemies.push(slime);
        mapFourEnemies.push(slime);
      }
      for (var i = 0; i < 5; i++) { //Black slimes
        slime = new Sprite(resources["Resources/BlackSlime.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 3;
        slime.isDead = false;
        slime.respawn = 60; //Respawn timer for slime
        slime.respawnTime = 60;
        slime.points = 150;
        slime.type = 6;
        slime.health = 12;
        slime.maxHealth = 12;
        slime.isActive = false;
        app.stage.addChild(slime);
        enemies.push(slime);
        mapTwoEnemies.push(slime);
      }
      for (var i = 0; i < 5; i++) { //Purple slimes
        slime = new Sprite(resources["Resources/PurpleSlime.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 2;
        slime.isDead = false;
        slime.respawn = 180; //Respawn timer for slime
        slime.respawnTime = 180;
        slime.points = 150;
        slime.type = 4;
        slime.health = 12;
        slime.maxHealth = 12;
        slime.isActive = false;
        app.stage.addChild(slime);
        enemies.push(slime);
        mapThreeEnemies.push(slime);
      }
      for (var i = 0; i < 5; i++) { //Red slimes
        slime = new Sprite(resources["Resources/RedSlime.png"].texture);
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 4;
        slime.isDead = false;
        slime.respawn = 180; //Respawn timer for slime
        slime.respawnTime = 180;
        slime.points = 150;
        slime.type = 5;
        slime.health = 12;
        slime.maxHealth = 12;
        slime.isActive = false;
        app.stage.addChild(slime);
        enemies.push(slime);
        mapFourEnemies.push(slime);
      }

        slime = new Sprite(resources["Resources/GoldSlime.png"].texture); //Gold slime
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
        slime.vx = 0;
        slime.vy = 0;
        slime.moveSpeed = 5;
        slime.isDead = false;
        slime.respawn = 600; //Respawn timer for slime
        slime.respawnTime = 600;
        slime.points = 500;
        slime.type = 3;
        slime.health = 25;
        slime.maxHealth = 25;
        slime.isActive = true;
        app.stage.addChild(slime);
        enemies.push(slime);
        mapOneEnemies.push(slime);
        mapTwoEnemies.push(slime);
        mapThreeEnemies.push(slime);
        mapFourEnemies.push(slime);

        for (var i = 0; i < enemies.length; i++) { //Add a health bar for each enemy
          bar = new Sprite(resources["Resources/HealthBar.png"].texture);
          bar.anchor.set(0.5,1);
          bar.x = enemies[i].x;
          bar.y = enemies[i].y;
          bar.alpha = 0.75;
          healthBars.push(bar);
          app.stage.addChild(bar);
        }

        BluePortal = new Sprite(resources["Resources/BluePortal.png"].texture); //Blue portal for map 2
        BluePortal.x = 50;
        BluePortal.y = 50;
        app.stage.addChild(BluePortal);

        OrangePortal = new Sprite(resources["Resources/OrangePortal.png"].texture); //Orange portal for map 2
        OrangePortal.x = 462 - OrangePortal.width;
        OrangePortal.y = 462 - OrangePortal.height;
        app.stage.addChild(OrangePortal);

        //Create the `player` sprite 
        player = new Sprite(resources["Resources/Warrior.png"].texture);
        player.x = 256 - player.width;
        player.y = 256 - player.height;
        player.vx = 0;
        player.vy = 0;
        player.moveSpeed = 3; //Player's movement speed
        player.damage = 5; //Player's damage
        app.stage.addChild(player);

        weapon = new Sprite(resources["Resources/Sword2.png"].texture); //Player's weapon sprite
        weapon.x = player.x - player.width;
        weapon.y = player.y - player.height;
        weapon.visible = false;
        weapon.anchor.set(0.5,0)
        app.stage.addChild(weapon);

        hitbox = new Sprite(resources["Resources/Block.png"].texture); //Hitbox for player attacks
        hitbox.width = player.width + player.height;
        hitbox.height = player.width + player.height;
        hitbox.x = player.x + player.width/2;
        hitbox.y = player.y + player.height/2;
        hitbox.visible = false;
        app.stage.addChild(hitbox);

        DoublePoints = new Sprite(resources["Resources/DoublePoints.png"].texture); //Double points item
        DoublePoints.x = 10; //Location on menu
        DoublePoints.y = 400;
        app.stage.addChild(DoublePoints);
        items.push(DoublePoints);

        DamageUp = new Sprite(resources["Resources/DamageUp.png"].texture); //Double damage item
        DamageUp.x = 110; //Location on menu
        DamageUp.y = 400;
        app.stage.addChild(DamageUp);
        items.push(DamageUp);

        Boots = new Sprite(resources["Resources/Boots.png"].texture); //Swift boots item
        Boots.x = 210; //Location on menu
        Boots.y = 400;
        app.stage.addChild(Boots);
        items.push(Boots);

        Orb = new Sprite(resources["Resources/Orb.png"].texture); //300 point orb item
        Orb.x = 310; //Location on menu
        Orb.y = 400;
        app.stage.addChild(Orb);
        items.push(Orb);

        Blast = new Sprite(resources["Resources/Blast.png"].texture); //Magic blast orb item
        Blast.x = 410; //Location on menu
        Blast.y = 400;
        app.stage.addChild(Blast);
        items.push(Blast);

        damageDuration = 0; //Items last 10 seconds, will count down to zero
        pointsDuration = 0;
        bootsDuration = 0;
        itemTime = 0; //Timer for items to be collected
        itemNum = 0; //Number for which item was spawned
        damageGot = false; //If specific items were collected (for the timed items)
        pointsGot = false;
        bootsGot = false;
        itemGot = false;

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
      character1.y = 100 - character1.height;
      character1.interactive = true;
      character1.buttonMode = true;
      app.stage.addChild(character1);

      character2 = new Sprite(resources["Resources/Lady.png"].texture); //Button to select the second character
      character2.x = 256 - character2.width;
      character2.y = 100 - character2.height;
      character2.interactive = true;
      character2.buttonMode = true;
      app.stage.addChild(character2);
      character3 = new Sprite(resources["Resources/Jorge.png"].texture); //Button to select the third character

      character3.x = 256 - character3.width + 50;
      character3.y = 100 - character3.height;
      character3.interactive = true;
      character3.buttonMode = true;
      app.stage.addChild(character3);

      mapOne = new Sprite(resources["Resources/Arena1ButtonOn.png"].texture); //Button to select the first map
      mapOne.x = 130 - mapOne.width;
      mapOne.y = 150;
      mapOne.interactive = true;
      mapOne.buttonMode = true;
      app.stage.addChild(mapOne);

      mapTwo = new Sprite(resources["Resources/Arena2Button.png"].texture); //Button to select the second map
      mapTwo.x = 230 - mapTwo.width;
      mapTwo.y = 150;
      mapTwo.interactive = true;
      mapTwo.buttonMode = true;
      app.stage.addChild(mapTwo);

      mapThree = new Sprite(resources["Resources/Arena3Button.png"].texture); //Button to select the third map
      mapThree.x = 330 - mapThree.width;
      mapThree.y = 150;
      mapThree.interactive = true;
      mapThree.buttonMode = true;
      app.stage.addChild(mapThree);

      mapFour = new Sprite(resources["Resources/Arena4Button.png"].texture); //Button to select the fourth map
      mapFour.x = 430 - mapFour.width;
      mapFour.y = 150;
      mapFour.interactive = true;
      mapFour.buttonMode = true;
      app.stage.addChild(mapFour);

      oneMinute = new Sprite(resources["Resources/OneMinuteButtonOn.png"].texture); //Button to select the one minute time limit
      oneMinute.x = 130 - oneMinute.width;
      oneMinute.y = 250;
      oneMinute.interactive = true;
      oneMinute.buttonMode = true;
      app.stage.addChild(oneMinute);

      oneAndHalfMinute = new Sprite(resources["Resources/OneAndHalfMinuteButton.png"].texture); //Button to select the one and a half minute time limit
      oneAndHalfMinute.x = 230 - oneAndHalfMinute.width;
      oneAndHalfMinute.y = 250;
      oneAndHalfMinute.interactive = true;
      oneAndHalfMinute.buttonMode = true;
      app.stage.addChild(oneAndHalfMinute);

      twoMinute = new Sprite(resources["Resources/TwoMinuteButton.png"].texture); //Button to select the two minutes time limit
      twoMinute.x = 330 - twoMinute.width;
      twoMinute.y = 250;
      twoMinute.interactive = true;
      twoMinute.buttonMode = true;
      app.stage.addChild(twoMinute);

      threeMinute = new Sprite(resources["Resources/ThreeMinuteButton.png"].texture); //Button to select the three minutes time limit
      threeMinute.x = 430 - threeMinute.width;
      threeMinute.y = 250;
      threeMinute.interactive = true;
      threeMinute.buttonMode = true;
      app.stage.addChild(threeMinute);

      playButton = new Sprite(resources["Resources/PlayButton.png"].texture); //Button to play the game
      playButton.x = 275 - playButton.width;
      playButton.y = 340;
      playButton.interactive = true;
      playButton.buttonMode = true;
      app.stage.addChild(playButton);

      musicButton = new Sprite(resources["Resources/MusicOn.png"].texture); //Button to mute/unmute the music
      musicButton.x = 10;
      musicButton.y = 550;
      musicButton.interactive = true;
      musicButton.buttonMode = true;
      musicButton.on('pointerdown', musicClicked);
      app.stage.addChild(musicButton);

      soundsButton = new Sprite(resources["Resources/SoundsOn.png"].texture); //Button to mute/unmute the sounds
      soundsButton.x = 60;
      soundsButton.y = 550;
      soundsButton.interactive = true;
      soundsButton.buttonMode = true;
      soundsButton.on('pointerdown', soundsClicked);
      app.stage.addChild(soundsButton);

      pauseButton = new Sprite(resources["Resources/PauseButton.png"].texture); //Button to pause the game
      pauseButton.x = 110;
      pauseButton.y = 550;
      pauseButton.interactive = true;
      pauseButton.buttonMode = true;
      pauseButton.on('pointerdown', pauseClicked);
      app.stage.addChild(pauseButton);

      pausedIcon = new Sprite(resources["Resources/Paused.png"].texture); //Icon to indicate that the game is paused
      pausedIcon.x = 275 - pausedIcon.width;
      pausedIcon.y = 256 - pausedIcon.height;
      app.stage.addChild(pausedIcon);

      characterSelect = new Sprite(resources["Resources/CharacterSelect.png"].texture); //Arrow to indiacte the selected character
      characterSelect.x = character1.x + 5;
      characterSelect.y = character1.y + character1.height;
      app.stage.addChild(characterSelect);

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
      space.press = () => { //Enemies will be damaged when the player swings their weapon
        if (swingCooldown == 0 && state == play && paused == false) {
          isSwinging = true;
          woosh.play(); //Play sound effect
          weapon.visible = true;
          weapon.rotation = 1.5;
          swingCooldown = 30;
        }
        else {
          isSwinging = false;
        }
      }
      space.release = () => {
        //isSwinging = false;
      }

      let style = new TextStyle({ //Font style for text
        fontFamily: "sans-serif",
        fontSize: 18,
        fill: "white",
      }); 

      frameNo = 0; //Frame number, used to track time in game. Game is 60 frames/sec
      score = 0; //Current score
      highScore = 0; //High score
      time = 0; //Current time left in game
      timeLimit = 60;

      title = new Sprite(resources["Resources/Title.png"].texture); //Title object for the game
      title.x = 125;
      title.y = -25;
      app.stage.addChild(title); //Add the title to the stage

      scoreDisp = new Text("Score: " + score, style); //Text to display current score
      scoreDisp.position.set(8,518);
      app.stage.addChild(scoreDisp);

      highScoreDisp = new Text("High score: " + highScore, style); //Text to display high score
      highScoreDisp.position.set(200,518);
      app.stage.addChild(highScoreDisp);

      timeDisp = new Text("Time: " + time, style); //Text to display time left in game
      timeDisp.position.set(400, 518);
      app.stage.addChild(timeDisp);

      characterPrompt = new Text("Click a character to play!", style); //Text to display how to select a character
      characterPrompt.position.set(160, 45);
      app.stage.addChild(characterPrompt);

      mapPrompt = new Text("Click a map to play on.", style); //Text to display how to select a map
      mapPrompt.position.set(160, 120);
      app.stage.addChild(mapPrompt);

      timePrompt = new Text("Select a time limit.", style); //Text to display how to select a time limit
      timePrompt.position.set(180, 220);
      app.stage.addChild(timePrompt);

      controls = new Text("Arrow keys to move, space to attack", style) //Text to display the controls of the game
      controls.position.set(110, 300);
      app.stage.addChild(controls);

      itemExplain = new Text("Items", style); //Text to display what the items are and do
      itemExplain.position.set(220, 375);
      app.stage.addChild(itemExplain);

      DoublePointsExplain = new Text("Double\nPoints", style); //Text to display double points item
      DoublePointsExplain.position.set(10, 450);
      app.stage.addChild(DoublePointsExplain);

      DamageUpExplain = new Text("Double\nDamage", style); //Text to display double damage item
      DamageUpExplain.position.set(110, 450);
      app.stage.addChild(DamageUpExplain);

      BootsExplain = new Text("Double\nSpeed", style); //Text to display double speed item
      BootsExplain.position.set(210, 450);
      app.stage.addChild(BootsExplain);

      OrbExplain = new Text("300\nPoints", style); //Text to display 300 points item
      OrbExplain.position.set(310, 450);
      app.stage.addChild(OrbExplain);

      BlastExplain = new Text("Kills all\nenemies", style); //Text to display magic blast item
      BlastExplain.position.set(410, 450);
      app.stage.addChild(BlastExplain);

      isSwinging = false; //Set is swing to false to start
      moveMult = 1; //Set multipliers to 1 at start of game
      scoreMult = 1;
      damageMult = 1;
      arenaNum = 1;
      paused = false;
      swingCooldown = 0;
      portalCooldown = 0;
      musicMuted = false; //Music is on by default
      soundsMuted = false;
      splat.volume = 0.5; //Set volume on sounds
      teleportSound.volume = 0.5;
      hitSound.volume = 0.5;
      menuMusic.volume = 0.5;
      battleMusic.volume = 0.25

      //Set the game state
      state = titleScreen; //Start on the title screen
     
      //Start the game loop
      app.ticker.add(delta => gameLoop(delta));
}

function gameLoop(delta){

  //Update the current game state:
  state(delta);
}

function play(delta) { //Play game state
  //Use the player's velocity to make it move
  if (paused == false) { //If the game is not paused
    battleMusic.play(); //Play the music
    player.x += player.vx; //Update player's position
    player.y += player.vy;
    
    weapon.x = player.x + player.width/2; //Update player's weapon's position
    weapon.y = player.y + player.height/2;

    hitbox.x = player.x - player.width/2 - 5; //Update player's attack hitbox position
    hitbox.y = player.y - player.height/2;
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


    
    if (swingCooldown == 29) {
      isSwinging = false; //Make it so enemie's won't be damaged
    }
    if (swingCooldown > 0) { //Cooldown for attacks
      swingCooldown--;
      weapon.rotation -= 0.3;
    }
    if (swingCooldown == 0) { //Hide weapon once attack is over
      weapon.visible = false;
    }

    if (frameNo % 120 == 0) { //Change the slime's movement every 2 seconds, use frame number to track time
      for (var i = 0; i < enemies.length; i++) { //For all enemies in array
        if (enemies[i].type != 5) { //Not red slimes
          enemiesMove(enemies[i]);
        }
      }
    }
    if (frameNo % 60 == 0) { //Change the red slime's movement every second, use frame number to track time
      for (var i = 0; i < enemies.length; i++) { //For all enemies in array
        if (enemies[i].type == 5) { //Red slimes change direction more often
          enemiesMove(enemies[i]);
        }
      }
    }

    for (var i = 0; i < enemies.length; i++) { //Update enemies
        enemyBoundsCheck(enemies[i]); //Check if they are out of bounds
        updateEnemy(enemies[i], player);
        healthBars[i].width = (50 * enemies[i].health/enemies[i].maxHealth); //Update health bars
        if (enemies[i].health/enemies[i].maxHealth <= 0.6) {
          if (enemies[i].health/enemies[i].maxHealth <= 0.3) {
            healthBars[i].tint = 0xfc0303; //Red if at 30% or less HP
          }
          else {
            healthBars[i].tint = 0xfcba03; //Yellow if at 60% or less HP
          }
        }
        else {
          healthBars[i].tint = 0x03fc0b; //Green if above 60% HP
        }
        healthBars[i].x = enemies[i].x + enemies[i].width/2;
        healthBars[i].y = enemies[i].y - 3;
      }

    if (frameNo % 1200 == 0 && frameNo != 0) { //Spawn a random item every 20 seconds
      spawnItem();
    }

    if (frameNo % 300 == 0 && currentEnemies < numEnemies) { //Spawn an enemy every 5 seconds if there are ones left
      spawnEnemies();
    }

    if (hitTestRectangle(player, DoublePoints)) { //Double points item touched
      scoreMult = 2; //Increase multiplier
      pointsDuration = 600; //Items last 10 seconds;
      DoublePoints.x = 206; //Move item to hud while it is active
      DoublePoints.y = 568;
      pointsGot = true;
      itemGot = true;
      powerUpOne.play(); //Play spund effect
    }
    if (hitTestRectangle(player, DamageUp)) { //Double damage item touched
      damageMult = 2;
      damageDuration = 600; //Items last 10 seconds;
      DamageUp.x = 256;
      DamageUp.y = 568;
      damageGot = true;
      itemGot = true;
      powerUpOne.play();
    }
    if (hitTestRectangle(player, Boots)) { //Quick boots item touched
      moveMult = 2;
      bootsDuration = 600; //Items last 10 seconds;
      Boots.x = 306;
      Boots.y = 568;
      bootsGot = true;
      itemGot = true;
      powerUpOne.play();
    }
    if (hitTestRectangle(player, Orb)) { //Magic orb item touched
      score += 300;
      Orb.x = 1000; //Move instant use items off screen
      Orb.y = 1000;
      itemGot = true;
      if (score > highScore) { //Update high score if new one is gotten
          highScore = score;
      }
      powerUpTwo.play();
    }
    if (hitTestRectangle(player, Blast)) { //Magic blast item touched
      for (var i = 0; i < enemies.length; i++) { //Update enemies
        if (enemies[i].isActive == true && enemies[i].isDead == false) {
          enemies[i].health -= 10;
        }
      }
      Blast.x = 1000;
      Blast.y = 1000;
      itemGot = true;
      powerUpTwo.play();
    }

    if (hitTestRectangle(player, BluePortal) && portalCooldown == 0) { //Player touches Blue portal on map 2
      player.x = 430;
      player.y = 422;
      portalCooldown = 90;
      teleportSound.play();
    }

    if (hitTestRectangle(player, OrangePortal) && portalCooldown == 0) { //Player touches Orange portal on map 2
      player.x = 50;
      player.y = 50;
      portalCooldown = 90;
      teleportSound.play();
    }

    if (portalCooldown > 0) { //Make it so the player can't immediately take a portal after just taking one
      portalCooldown--;
    }

    //Stop the player from going in the lava/blocks
    if (hitTestRectangle(player, lavaLeft) || hitTestRectangle(player, blockOneLeft) || hitTestRectangle(player, blockTwoLeft)) { //Left side
      player.x -= player.moveSpeed * moveMult
    }
    if (hitTestRectangle(player, lavaRight) || hitTestRectangle(player, blockOneRight) || hitTestRectangle(player, blockTwoRight)) { //Right side
      player.x += player.moveSpeed * moveMult
    }
    if (hitTestRectangle(player, lavaTop) || hitTestRectangle(player, blockOneTop) || hitTestRectangle(player, blockTwoTop)) { //Top side
      player.y -= player.moveSpeed * moveMult
    }
    if (hitTestRectangle(player, lavaBottom) || hitTestRectangle(player, blockOneBottom) || hitTestRectangle(player, blockTwoBottom)) { //Bottom side
      player.y += player.moveSpeed * moveMult
    }

    

    if (pointsDuration > 0) { //Decrease item timer each frame when it is above 0
      pointsDuration--;
    }
    else if (pointsDuration <= 0 && pointsGot == true) { //Reset multiplers once item expires
      scoreMult = 1;
      DoublePoints.x = 1000;
      DoublePoints.y = 1000;
      pointsGot = false;
    }
    if (damageDuration > 0) { //Decrease item timer each frame when it is above 0
      damageDuration--;
    }
    else if (damageDuration <= 0 && damageGot == true) { //Reset multiplers once item expires
      damageMult = 1;
      DamageUp.x = 1000;
      DamageUp.y = 1000;
      damageGot = false;
    }
    if (bootsDuration > 0) { //Decrease item timer each frame when it is above 0
      bootsDuration--;
    }
    else if (bootsDuration <= 0 && bootsGot == true) { //Reset multiplers once item expires
      moveMult = 1;
      Boots.x = 1000;
      Boots.y = 1000;
      bootsGot = false;
    }
    if (itemTime > 0 && itemGot == false) { //Make it so items disappear if not getten in 10 seconds
      itemTime--;
    }
    if (itemTime == 0 && itemGot == false) {
      items[itemNum].x = 1000;
      items[itemNum].y = 1000;
      items[itemNum].visible = false;
    }


    
    frameNo++; //Increase frame number to track time of game
    scoreDisp.text = ("Score: " + score); //Update score display
    highScoreDisp.text = ("High score: " + highScore); //Update high score display
    time = timeLimit - (frameNo / 60); //Update time
    timeDisp.text = ("Time: " + time.toFixed(2)); //Update timer display
    
    restartButton.visible = false; //Make the menu objects invisible during gameplay
    menuButton.visible = false;
    character1.visible = false;
    character2.visible = false;
    character3.visible = false;
    characterSelect.visible = false;
    mapOne.visible = false;
    mapTwo.visible = false;
    mapThree.visible = false;
    mapFour.visible = false;
    oneMinute.visible = false;
    oneAndHalfMinute.visible = false;
    twoMinute.visible = false;
    threeMinute.visible = false;
    playButton.visible = false;

    if (time <= 0) { //End game once time is up
      state = end;
    }
  }
}

function end() { //End of game state
  restartButton.visible = true; //Make buttons appear after a game has ended
  menuButton.visible = true;
  restartButton.on('pointerdown', startLevel); //Call function when the button is clicked
  menuButton.on('pointerdown', onMenuClick);
  //battleMusic.pause();
}

function titleScreen() { //Title screen when the game first boots up
  for (var i = 0; i < app.stage.children.length; i++) { //Make all objects invisible
    app.stage.children[i].visible = false;
  }
  background.visible = true; //Make background visible
  background.interactive = true;
  background.buttonMode = true;
  background.on('pointerdown', onMenuClick);
}

function menu() { //Menu screen state
  menuMusic.play(); //Play menu music
  battleMusic.pause(); //Stop battle music (if coming from a match)
  background.interactive = false; //Make it so the background can't be clicked anymore
  background.buttonMode = false;
  pauseButton.visible = false; //Hide pause button on menu
  character1.visible = true; //Make character buttons visible
  character2.visible = true;
  character3.visible = true;
  characterSelect.visible = true;
  mapOne.visible = true; //Make map select buttons visible
  mapTwo.visible = true;
  mapThree.visible = true;
  mapFour.visible = true;
  oneMinute.visible = true; //Make time select buttons visible
  oneAndHalfMinute.visible = true;
  twoMinute.visible = true;
  threeMinute.visible = true;
  characterPrompt.visible = true; //Make text explainations visible
  mapPrompt.visible = true;
  controls.visible = true;
  itemExplain.visible = true;
  timePrompt.visible = true;
  scoreDisp.visible = true;
  highScoreDisp.visible = true;
  timeDisp.visible = true;
  DoublePointsExplain.visible = true; //Make items visible to go along with text explainations
  DamageUpExplain.visible = true;
  BootsExplain.visible = true;
  OrbExplain.visible = true;
  BlastExplain.visible = true;
  playButton.visible = true; //Make play button visible
  musicButton.visible = true; //Make music/sound toggle buttons visible
  soundsButton.visible = true;
  menuButton.visible = false; //Make end of game buttons invisible
  restartButton.visible = false;
  background.visible = false; //Make the background invisible
  weapon.visible = false;
  for (var i = 0; i < lavaPool.length; i++) { //Make all lava objects invisible
    lavaPool[i].visible = false;
    lavaPool[i].x = 1000;
    lavaPool[i].y = 1000;
  }
  for (var i = 0; i < blockArray.length; i++) { //Make all block objects invisible
    blockArray[i].visible = false;
    blockArray[i].x = 1000;
    blockArray[i].y = 1000;
  }
  BluePortal.visible = false; //Make portals invisible
  OrangePortal.visible = false;
  title.visible = true; //Make the title invisible
  for (var i = 0; i < enemies.length; i++) { //Make all enemies invisible
      enemies[i].visible = false;
  }
  for (var i = 0; i < healthBars.length; i++) { //Make all enemy health bars invisible
      healthBars[i].visible = false;
  }
  player.visible = false; //Make the player character invisible
  DoublePoints.x = 10; //Reset item postions to line up with explainations, in case a game has been played and they moved
  DoublePoints.y = 400;
  DoublePoints.visible = true; //Make items visible
  DamageUp.x = 110;
  DamageUp.y = 400;
  DamageUp.visible = true;
  Boots.x = 210;
  Boots.y = 400;
  Boots.visible = true;
  Orb.x = 310;
  Orb.y = 400;
  Orb.visible = true;
  Blast.x = 410;
  Blast.y = 400;
  Blast.visible = true;
  character1.on('pointerdown', characterSelect1); //Call functions for which character is selected
  character2.on('pointerdown', characterSelect2);
  character3.on('pointerdown', characterSelect3);
  mapOne.on('pointerdown', mapOneSelect); //Call functions for which map is selected
  mapTwo.on('pointerdown', mapTwoSelect);
  mapThree.on('pointerdown', mapThreeSelect);
  mapFour.on('pointerdown', mapFourSelect);
  oneMinute.on('pointerdown', oneMinuteSelect); //Call functions for which time limit is selected
  oneAndHalfMinute.on('pointerdown', oneAndHalfMinuteSelect);
  twoMinute.on('pointerdown', twoMinuteSelect);
  threeMinute.on('pointerdown', threeMinuteSelect);
  playButton.on('pointerdown', startLevel); //Call function for playing a match
}

function onMenuClick() { //Set the state to "menu" when the menu button is clicked after a game
  state = menu;
}

function characterSelect1() { //Character 1 (Warrior) selected
  player.texture = resources["Resources/Warrior.png"].texture; //Set the correct image to the sprite
  weapon.texture = resources["Resources/Sword2.png"].texture; //Set the correct image to the weapon sprite
  woosh.src = ("Resources/Woosh.wav"); //Set the weapon sound effect
  woosh.volume = 1;
  player.moveSpeed = 4; //Set the stats
  player.damage = 5;
  hitbox.width = weapon.height + player.width;
  hitbox.height = weapon.height + player.height;
  characterSelect.x = character1.x + 5;
  characterSelect.y = character1.y + character1.height;
}

function characterSelect2() { //Character 3 (Lady) selected
  player.texture = resources["Resources/Lady.png"].texture;
  weapon.texture = resources["Resources/Sword.png"].texture; //Set the correct image to the weapon sprite
  woosh.src = ("Resources/Woosh.wav");
  woosh.volume = 1;
  player.moveSpeed = 5;
  player.damage = 3;
  hitbox.width = weapon.height + player.width;
  hitbox.height = weapon.height + player.height;
  characterSelect.x = character2.x + 5;
  characterSelect.y = character2.y + character2.height;
}

function characterSelect3() { //Character 3 (Jorge) selected
  player.texture = resources["Resources/Jorge.png"].texture;
  weapon.texture = resources["Resources/Axe.png"].texture; //Set the correct image to the weapon sprite
  woosh.src = ("Resources/wooshAxe.flac");
  woosh.volume = 0.5;
  player.moveSpeed = 3;
  player.damage = 10;
  hitbox.width = weapon.height + player.width;
  hitbox.height = weapon.height + player.height;
  characterSelect.x = character3.x + 10;
  characterSelect.y = character3.y + character3.height;
}

function mapOneSelect() { //Button for map 1 clicked
  arenaNum = 1;
  background.texture = resources["Resources/Background.png"].texture; //Set background for map
  mapOne.texture = resources["Resources/Arena1ButtonOn.png"].texture; //Set the button textures to reflect which is selected
  mapTwo.texture = resources["Resources/Arena2Button.png"].texture;
  mapThree.texture = resources["Resources/Arena3Button.png"].texture;
  mapFour.texture = resources["Resources/Arena4Button.png"].texture;
}
function mapTwoSelect() { //Button for map 2 clicked
  arenaNum = 2;
  background.texture = resources["Resources/Background2.png"].texture;
  mapOne.texture = resources["Resources/Arena1Button.png"].texture;
  mapTwo.texture = resources["Resources/Arena2ButtonOn.png"].texture;
  mapThree.texture = resources["Resources/Arena3Button.png"].texture;
  mapFour.texture = resources["Resources/Arena4Button.png"].texture;
}
function mapThreeSelect() { //Button for map 3 clicked
  arenaNum = 3;
  background.texture = resources["Resources/Background3.png"].texture;
  mapOne.texture = resources["Resources/Arena1Button.png"].texture;
  mapTwo.texture = resources["Resources/Arena2Button.png"].texture;
  mapThree.texture = resources["Resources/Arena3ButtonOn.png"].texture;
  mapFour.texture = resources["Resources/Arena4Button.png"].texture;
}
function mapFourSelect() { //Button for map 4 clicked
  arenaNum = 4;
  background.texture = resources["Resources/Background4.png"].texture;
  mapOne.texture = resources["Resources/Arena1Button.png"].texture;
  mapTwo.texture = resources["Resources/Arena2Button.png"].texture;
  mapThree.texture = resources["Resources/Arena3Button.png"].texture;
  mapFour.texture = resources["Resources/Arena4ButtonOn.png"].texture;
}

function oneMinuteSelect() { //Button for 1 minute time limit clicked
  timeLimit = 60; //Set time limit
  oneMinute.texture = resources["Resources/OneMinuteButtonOn.png"].texture; //Set the button textures to reflect which is selected
  oneAndHalfMinute.texture = resources["Resources/OneAndHalfMinuteButton.png"].texture;
  twoMinute.texture = resources["Resources/TwoMinuteButton.png"].texture;
  threeMinute.texture = resources["Resources/ThreeMinuteButton.png"].texture;
}

function oneAndHalfMinuteSelect() { //Button for 1:30 minutes time limit clicked
  timeLimit = 90;
  oneMinute.texture = resources["Resources/OneMinuteButton.png"].texture;
  oneAndHalfMinute.texture = resources["Resources/OneAndHalfMinuteButtonOn.png"].texture;
  twoMinute.texture = resources["Resources/TwoMinuteButton.png"].texture;
  threeMinute.texture = resources["Resources/ThreeMinuteButton.png"].texture;
}

function twoMinuteSelect() { //Button for 2 minute time limit clicked
  timeLimit = 120;
  oneMinute.texture = resources["Resources/OneMinuteButton.png"].texture;
  oneAndHalfMinute.texture = resources["Resources/OneAndHalfMinuteButton.png"].texture;
  twoMinute.texture = resources["Resources/TwoMinuteButtonOn.png"].texture;
  threeMinute.texture = resources["Resources/ThreeMinuteButton.png"].texture;
}

function threeMinuteSelect() { //Button for 3 minute time limit clicked
  timeLimit = 180;
  oneMinute.texture = resources["Resources/OneMinuteButton.png"].texture;
  oneAndHalfMinute.texture = resources["Resources/OneAndHalfMinuteButton.png"].texture;
  twoMinute.texture = resources["Resources/TwoMinuteButton.png"].texture;
  threeMinute.texture = resources["Resources/ThreeMinuteButtonOn.png"].texture;
}

function musicClicked() { //Mute/unmute the music
  if (musicMuted == false) {
    menuMusic.muted = true;
    battleMusic.muted = true;
    musicButton.texture = resources["Resources/MusicOff.png"].texture;
    musicMuted = true;
  }
  else if (musicMuted == true) {
    menuMusic.muted = false;
    battleMusic.muted = false;
    musicButton.texture = resources["Resources/MusicOn.png"].texture;
    musicMuted = false;
  }
}

function soundsClicked() { //Mute/unmute the sounds
  if (soundsMuted == false) {
    woosh.muted = true;
    splat.muted = true;
    powerUpOne.muted = true;
    powerUpTwo.muted = true;
    teleportSound.muted = true;
    hitSound.muted = true;
    soundsButton.texture = resources["Resources/SoundsOff.png"].texture;
    soundsMuted = true;
  }
  else if (soundsMuted == true) {
    woosh.muted = false;
    splat.muted = false;
    powerUpOne.muted = false;
    powerUpTwo.muted = false;
    teleportSound.muted = false;
    hitSound.muted = false;
    soundsButton.texture = resources["Resources/SoundsOn.png"].texture;
    soundsMuted = false;
  }
}

function pauseClicked() { //Function to pause and unpause game
  if (state == play) {
    if (paused == true) { //Unpause game
      paused = false;
      pausedIcon.visible = false;
    }
    else if (paused == false) { //Pause game
      paused = true;
      pausedIcon.visible = true;
    }
  }
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
    if (slime.type != 4) { //Not purple slimes
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
    else { //Purple slimes
      if (move == 0) { //Move down-right
      slime.vx = slime.moveSpeed;
      slime.vy = slime.moveSpeed;
      }
      else if (move == 1) { //Move up-left
        slime.vx = -slime.moveSpeed;
        slime.vy = -slime.moveSpeed;
      }
      else if (move == 2) { //Move down-left
        slime.vx = -slime.moveSpeed;
        slime.vy = slime.moveSpeed;
      }
      else if (move == 3) { //Move up-right
        slime.vx = slime.moveSpeed;
        slime.vy = -slime.moveSpeed;
      }
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
    //lava/block top side check
    if (hitTestRectangle(slime, lavaTop) || hitTestRectangle(slime, blockOneTop) || hitTestRectangle(slime, blockTwoTop)) {
      slime.vy = 0;
      slime.y -= 3;
      enemiesMove(slime);
    }
    //lava/block bottom side check
    if (hitTestRectangle(slime, lavaBottom) || hitTestRectangle(slime, blockOneBottom) || hitTestRectangle(slime, blockTwoBottom)) {
      slime.vy = 0;
      slime.y += 3;
      enemiesMove(slime);
    }
    //lava/block left side check
    if (hitTestRectangle(slime, lavaLeft) || hitTestRectangle(slime, blockOneLeft) || hitTestRectangle(slime, blockTwoLeft)) {
      slime.vx = 0;
      slime.x -= 3;
      enemiesMove(slime);
    }
    //lava/block right side check
    if (hitTestRectangle(slime, lavaRight) || hitTestRectangle(slime, blockOneRight) || hitTestRectangle(slime, blockTwoRight)) {
      slime.vx = 0;
      slime.x += 3;
      enemiesMove(slime);
    }
  }
}

function updateEnemy(slime, player) { //Update the enemies and their various values
  if (slime.isActive == true) { //If slime is active on current map
    slime.x += slime.vx; //Update position
    slime.y += slime.vy;
    if (hitTestRectangle(hitbox, slime) && isSwinging == true) { //Check if hit by player and player is attacking
        slime.health -= player.damage * damageMult; //Damage slime
        if (slime.health > 0) {
          hitSound.play(); //Damaged sound
        }
        if (slime.type == 6) { //Black slimes teleport when damaged
          slime.x = Math.floor(Math.random() * 480); //Teleport somewhere random
          slime.y = Math.floor(Math.random() * 480);
          if (slime.health > 0) { //Teleport sound
            teleportSound.play();
          }
        }
      }
      if (slime.health <= 0 && slime.isDead == false) { //If slime is dead
          slime.y = 1000; //Send slime off screen
          slime.x = 1000;
          slime.vx = 0; //Stop slime from moving
          slime.vy = 0;
          slime.isDead = true; //Let the slime know it is dead
          score += slime.points * scoreMult; //Add points to score
          splat.play(); //Death sound
          if (score > highScore) { //Update high score if new one is gotten
            highScore = score;
          }
    }

    if (slime.isDead == true) { //Start respawn timer once slime is dead
      slime.respawn-- ;
    }

    if (slime.respawn <= 0 && slime.isDead == true) { //Respawn slime
      slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
      slime.y = Math.floor(Math.random() * 480);
      //Make sure the enemies don't spawn somewhere the player can't get them
      while (hitTestRectangle(blockOne, slime) || hitTestRectangle(blockTwo, slime) || hitTestRectangle(lava, slime)) {
        slime.x = Math.floor(Math.random() * 480); //Respawn somewhere random
        slime.y = Math.floor(Math.random() * 480);
      }
      slime.isDead = false; //Reset death values and health
      slime.respawn = slime.respawnTime;
      slime.health = slime.maxHealth;
      enemiesMove(slime); //Start moving slime
    }
  }
  else if (slime.isActive == false) { //If slime is not on the current map
    slime.x = 1000;
    slime.y = 1000;
  }
}

function startLevel() { //Load a game
  menuMusic.pause(); //Stop menu music
  menuMusic.currentTime = 0; //Reset menu music so it starts at the beginning next time the menu is entered
  battleMusic.currentTime = 0; //Reset battle music so it starts at the beginning
  player.x = 256 - player.width; //Start player in center of arena
  player.y = 256 - player.height;
  player.vx = 0; //Make sure player is not moving at start
  player.vy = 0;
  frameNo = 0; //Reset frame count for tracking time
  score = 0; //Reset score
  currentEnemies = 0; //Set number of enemies in the arena to 0
  paused = false; //Game is not paused at start
  //Reset stage specific objects
  for (var i = 0; i < lavaPool.length; i++) { //Make all lava objects invisible
    lavaPool[i].visible = false;
    lavaPool[i].x = 1000;
    lavaPool[i].y = 1000;
  }
  for (var i = 0; i < blockArray.length; i++) { //Make all block objects invisible
    blockArray[i].visible = false;
    blockArray[i].x = 1000;
    blockArray[i].y = 1000;
  }
  BluePortal.visible = false; //Make portals invisble
  BluePortal.x = 1000;
  BluePortal.y = 1000;
  OrangePortal.visible = false;
  OrangePortal.x = 1000;
  OrangePortal.y = 1000;

  for (var i = 0; i < enemies.length; i++) { //Reset enemies
      enemies[i].respawn = enemies[i].respawnTime; //Reset enemey respawn timer
      enemies[i].isDead = false; //Set slime to not be dead
      enemies[i].visible = true; //Make slime visible
      enemies[i].health = enemies[i].maxHealth;
      enemies[i].x = Math.floor(Math.random() * 480); //Respawn somewhere random
      enemies[i].y = Math.floor(Math.random() * 480);
      enemies[i].isActive = false;
      if (arenaNum == 1) { //Only basic slimes on first map
        numEnemies = 16; //Set number of enemies allowed on the map
        background.texture = resources["Resources/Background.png"].texture;
      }
      if (arenaNum == 2) { //Only basic and black slimes on second map
        BluePortal.visible = true; //Make portals visible
        BluePortal.x = 50;
        BluePortal.y = 50;
        OrangePortal.visible = true;
        OrangePortal.x = 462 - OrangePortal.width;
        OrangePortal.y = 462 - OrangePortal.height;
        numEnemies = 21;
        background.texture = resources["Resources/Background2.png"].texture;
      }
      if (arenaNum == 3) { //Only basic and purple slimes on third map
        numEnemies = 21;
        background.texture = resources["Resources/Background3.png"].texture;
        //Make blocks visible and in right spots
        for (var j = 0; j < blockArray.length; j++) { //Make all block objects visible
          blockArray[j].visible = true;
        }
        //Block one
        blockOne.x = 128 - blockOne.width/2;
        blockOne.y = 128 - blockOne.height/2;
        blockOneTop.x = 128 - blockOneTop.width/2;
        blockOneTop.y = 128 - blockOne.height/2;
        blockOneBottom.x = 128 - blockOne.width/2;
        blockOneBottom.y = 128 + blockOne.height/2 - blockOneBottom.height;
        blockOneLeft.x = 128 - blockOne.width/2;
        blockOneLeft.y = 128 - blockOne.height/2;
        blockOneRight.x = 128 + blockOne.width/2 - blockOneRight.width;
        blockOneRight.y = 128 - blockOne.height/2;

        //Block two
        blockTwo.x = 384 - blockTwo.width/2;
        blockTwo.y = 384 - blockTwo.height/2;
        blockTwoTop.x = 384 - blockTwoTop.width/2;
        blockTwoTop.y = 384 - blockTwo.height/2;
        blockTwoBottom.x = 384 - blockTwo.width/2;
        blockTwoBottom.y = 384 + blockTwo.height/2 - blockTwoBottom.height;
        blockTwoLeft.x = 384 - blockTwo.width/2;
        blockTwoLeft.y = 384 - blockTwo.height/2;
        blockTwoRight.x = 384 + blockTwo.width/2 - blockTwoRight.width;
        blockTwoRight.y = 384 - blockTwo.height/2;

        while (hitTestRectangle(enemies[i], blockOne) || hitTestRectangle(enemies[i], blockTwo)) { //Make sure the enemies don't spawn somewhere the player can't get them
          enemies[i].x = Math.floor(Math.random() * 480); //spawn somewhere random
          enemies[i].y = Math.floor(Math.random() * 480);
        }
      }
      if (arenaNum == 4) { //Only basic and red slimes on fourth map
        numEnemies = 21;
        background.texture = resources["Resources/Background4.png"].texture;
        //Make lave visible and in right spots
        for (var j = 0; j < lavaPool.length; j++) { //Make all lava objects visible
          lavaPool[j].visible = true;
        }
        lava.x = 256 - lava.width/2;
        lava.y = 256 - lava.height/2;
        lavaTop.x = 256 - lavaTop.width/2;
        lavaTop.y = 256 - lava.height/2;
        lavaBottom.x = 256 - lava.width/2;
        lavaBottom.y = 256 + lava.height/2 - lavaBottom.height;
        lavaLeft.x = 256 - lava.width/2;
        lavaLeft.y = 256 - lava.height/2;
        lavaRight.x = 256 + lava.width/2 - lavaRight.width;
        lavaRight.y = 256 - lava.height/2;
        while (hitTestRectangle(enemies[i], lava)) { //Make sure the enemies don't spawn somewhere the player can't get them
          enemies[i].x = Math.floor(Math.random() * 480); //spawn somewhere random
          enemies[i].y = Math.floor(Math.random() * 480);
        }
        player.x = 100 - player.width; //Start player in top left of arena because of stage specific object
        player.y = 100 - player.height;
      }
      updateEnemy(enemies[i], player); //Update enemies for current position and values
    }

    for (var i = 0; i < healthBars.length; i++) { //Make all enemy health bars visible
      healthBars[i].visible = true;
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
    characterPrompt.visible = false; //Make menu objects (text and buttons) invisible
    timePrompt.visible = false;
    mapPrompt.visible = false;
    controls.visible = false;
    itemExplain.visible = false;
    DoublePointsExplain.visible = false;
    DamageUpExplain.visible = false;
    BootsExplain.visible = false;
    OrbExplain.visible = false;
    BlastExplain.visible = false;
    background.visible = true; //Make background visible
    pauseButton.visible = true; //Make pause button visible
    title.visible = false; //Make the title invisible
    for (var i = 0; i < 5; i++) { //Spawn 5 random enemies at the start
      spawnEnemies();
    }
    state = play; //Set state to "play"
}

function spawnItem() { //Spawn items during game
  itemNum = Math.floor(Math.random() * items.length);
  item = items[itemNum]; //Choose a random item
  item.x = Math.floor(Math.random() * 480); //spawn somewhere random
  item.y = Math.floor(Math.random() * 480);

  //Make sure the items don't spawn somewhere the player can't get them
  if (arenaNum == 2) { //Mystic map
    while (hitTestRectangle(item, BluePortal) || hitTestRectangle(item, OrangePortal)) {
      item.x = Math.floor(Math.random() * 480); //spawn somewhere random
      item.y = Math.floor(Math.random() * 480);
    }
  }
  if (arenaNum == 3) { //Ruins map
    while (hitTestRectangle(item, blockOne) || hitTestRectangle(item, blockTwo)) {
      item.x = Math.floor(Math.random() * 480); //spawn somewhere random
      item.y = Math.floor(Math.random() * 480);
    }
  }
  if (arenaNum == 4) { //Lava map
    while (hitTestRectangle(item, lava)) {
      item.x = Math.floor(Math.random() * 480); //spawn somewhere random
      item.y = Math.floor(Math.random() * 480);
    }
  }
  
  itemGot = false; //Boolean for if the item has been collected
  itemTime = 600; //Timer to collect items (10 seconds)
  item.visible = true; //Make item visible
}

function spawnEnemies() { //Spawn enemies into the map
  var j = 0;
  while (j < 1) { //So it only spawns one enemy at a time and repeats until it has spawned one
    if (arenaNum == 1) {
      var k = Math.floor(Math.random() * mapOneEnemies.length); //Choose a random enemy from the ones available
      if (mapOneEnemies[k].isActive == false) { //If that enemy has not already been spawned
        mapOneEnemies[k].isActive = true;
        mapOneEnemies[k].x = Math.floor(Math.random() * 480); //spawn somewhere random
        mapOneEnemies[k].y = Math.floor(Math.random() * 480);
        updateEnemy(mapOneEnemies[k], player);        
        j++;
      }
    }
    if (arenaNum == 2) {
      var k = Math.floor(Math.random() * mapTwoEnemies.length);
      if (mapTwoEnemies[k].isActive == false) {
        mapTwoEnemies[k].isActive = true;
        mapTwoEnemies[k].x = Math.floor(Math.random() * 480); //spawn somewhere random
        mapTwoEnemies[k].y = Math.floor(Math.random() * 480);
        updateEnemy(mapTwoEnemies[k], player);        
        j++;
      }
    }
    if (arenaNum == 3) {
      var k = Math.floor(Math.random() * mapThreeEnemies.length);
      if (mapThreeEnemies[k].isActive == false) {
        mapThreeEnemies[k].isActive = true;
        mapThreeEnemies[k].x = Math.floor(Math.random() * 480); //spawn somewhere random
        mapThreeEnemies[k].y = Math.floor(Math.random() * 480);
        while (hitTestRectangle(mapThreeEnemies[k], blockOne) || hitTestRectangle(mapThreeEnemies[k], blockTwo)) { //Make sure the slime doesn't spawn in the blocks
          mapThreeEnemies[k].x = Math.floor(Math.random() * 480); //spawn somewhere random
          mapThreeEnemies[k].y = Math.floor(Math.random() * 480);
        }
        updateEnemy(mapThreeEnemies[k], player);        
        j++;
      }
    }
    if (arenaNum == 4) {
      var k = Math.floor(Math.random() * mapFourEnemies.length);
      if (mapFourEnemies[k].isActive == false) {
        mapFourEnemies[k].isActive = true;
        mapFourEnemies[k].x = Math.floor(Math.random() * 480); //spawn somewhere random
        mapFourEnemies[k].y = Math.floor(Math.random() * 480);
        while (hitTestRectangle(mapFourEnemies[k], lava)) {
          mapFourEnemies[k].x = Math.floor(Math.random() * 480); //Make sure the slime doesn't spawn in the lava
          mapFourEnemies[k].y = Math.floor(Math.random() * 480);
        }
        updateEnemy(mapFourEnemies[k], player);        
        j++;
      }
    }
  }
  currentEnemies++; //Increase the count of enemies currently on the field
}