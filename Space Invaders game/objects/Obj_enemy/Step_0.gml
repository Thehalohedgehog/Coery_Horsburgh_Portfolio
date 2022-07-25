/// @description Insert description here
// You can write your code in this 
if (global.active == true) {
	if (moveDirection == 1) {
		x += 0.25 * global.difficulty ;
	}	
	if (moveDirection == -1) {
		x -= 0.25 * global.difficulty ;
	}

	movement += global.difficulty ;

	if (movement >= 300) {
		if (moveDirection == 1) {
			moveDirection = -1 ;
		}
		else if (moveDirection == -1) {
			moveDirection = 1 ;	
		}
		y += 10 ;
		movement = 0 ;
	}

	if (HP <= 0) {
		instance_destroy() ;
		global.numEnemies -= 1 ;
		score += 10 ;
		instance_create_layer(x,y,"Explosions",Obj_explosion) ;
	}

	if (random(10) <= 5) and (global.cooldown <= 0) {
		audio_play_sound(Laser_fire,2,false) ;
		with (instance_create_layer(x,y,"Lasers",Obj_laserEnemy)) {
			speed = -10 ;
			direction = other.image_angle + 90;
			image_angle = other.image_angle ;
		}
		global.cooldown = 120 ;
	}
}