/// @description Insert description here
// You can write your code in this editor
if (global.active == true) {
	key_left = keyboard_check(vk_left) or keyboard_check(ord("A")) ;
	key_right = keyboard_check(vk_right) or keyboard_check(ord("D")) ;
	key_fire = keyboard_check_pressed(vk_space) ;

	var move = key_right - key_left ;

	horizonalSpeed = move * moveSpeed ;

	if (place_meeting(x+horizonalSpeed,y,Obj_wall)) {
		while (!place_meeting(x+sign(horizonalSpeed),y,Obj_wall)) {
			x = x + sign(horizonalSpeed) ;	
		}
		horizonalSpeed = 0
	}	

	x = x + horizonalSpeed ;

	fireDelay -= 1 ; //x = x - 1 ;

	if (key_fire) and (fireDelay < 0) {
		fireDelay = 30 ;
		audio_play_sound(Laser_fire,1,false) ;
		//Create an instance of our laser
		with (instance_create_layer(x,y,"Lasers",Obj_laser)) {
			speed = 10 ;
			direction = other.image_angle + 90;
			image_angle = other.image_angle ;
		}
	}
}