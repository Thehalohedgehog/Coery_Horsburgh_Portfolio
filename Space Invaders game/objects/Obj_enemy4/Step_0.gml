/// @description Insert description here
// You can write your code in this editor
if (global.active == true) {
	wait -= 1 ;
	if (wait <= 0) and (global.numEnemies <= 22) {
		x += 2 ;
	}

	if (HP <= 0) {
		instance_destroy() ;
		score += 50 ;
		instance_create_layer(x,y,"Explosions",Obj_explosion) ;
	}
}