/// @description Insert description here
// You can write your code in this editor
if (global.numEnemies <= 0) {
	room_restart() ;
}
if (global.active == true) {
	global.cooldown -= 1 ;
	global.cooldown2 -= 1 ;
	global.cooldown3 -= 1 ;
}

if (global.active == false) {
	wait -= 1 ;
}

if (wait <= 0) {
	if (lives <= 0) {
		score = 0 ;
		room_goto(0) ; //Go back to starting room to reset lives
		return 0 ;
	}
	instance_create_layer(640,576,"Player",Obj_player) ;
	global.active = true ;
	wait = 300 ;
	global.cooldown = 180 ;
	global.cooldown2 = 180 ;
	global.cooldown3 = 180 ;
}

if (score >= global.extraLife) {
	lives += 1 ;
	global.extraLife += 3000 ;
}

if (global.numEnemies == 30) {
	global.difficulty = 2 ;
}
if (global.numEnemies == 20) {
	global.difficulty = 3 ;
}
if (global.numEnemies == 10) {
	global.difficulty = 4 ;
}