/// @description Insert description here
// You can write your code in this editor
draw_set_color(c_white) ;
draw_set_halign(fa_left) ;
draw_text(10,10,"Score: " + string(score) + "\nLives: " + string(lives)) ;
if (lives <= 0) {
	draw_set_halign(fa_center) ;
	draw_text_transformed(670,380,"GAME OVER",3,3,0) ;
}