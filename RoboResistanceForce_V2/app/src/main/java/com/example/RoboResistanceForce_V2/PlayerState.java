package com.example.RoboResistanceForce_V2;

import android.graphics.PointF;

//Stores data on the player's current status
public class PlayerState {
    private int numCredits;
    private int mgFireRate;
    private int lives;
    private int HP;
    private int damage;
    private char type;
    private String bitmapName;
    private float restartX;
    private float restartY;
    private float xVelocity;
    PlayerState() {
        lives = 3;
        mgFireRate = 1;
        numCredits = 0;
        HP = 3;
        type = 'n';
        bitmapName = "player_basic_transparent";
        xVelocity = 10;
    }

    //Their location in the game world
    public void saveLocation(PointF location) {
        // The location saves each time the player uses a teleport
        restartX = location.x;
        restartY = location.y;
    }
    //Load their starting location on a death
    public PointF loadLocation() {
        // Used every time the player loses a life
        return new PointF(restartX, restartY);
    }
    public int getLives(){
        return lives;
    }

    public int getHP() {
        return HP;
    }

    public int getFireRate(){
        return mgFireRate;
    }
    public void increaseFireRate(){
        mgFireRate += 2;
    }
    public void gotCredit(){
        numCredits ++;
    }
    public int getCredits(){
        return numCredits;
    }
    public void loseHP() { HP--; }
    public void addHP() { HP++; }
    public void loseLife(){
        lives--;
    }
    public void addLife(){
        lives++;
    }
    public void resetLives() {
        resetHP();
        lives = 3;
    }

    public void resetHP() {
        if (this.type == 'h') {
            HP = 5;
        }
        else {
            HP = 3;
        }
    }

    public char getType() {
        return type;
    }

    public int getDamage() {
        return damage;
    }

    public void setType(char type) {
        this.type = type;
    }

    public String getBitmapName() {
        return bitmapName;
    }
    public float getxVelocity() {return xVelocity; }

    //Set the different stats for the different characters
    public void setStats() {
        if (type == 'n') {
            mgFireRate = 2;
            damage = 3;
            bitmapName = "player_basic_transparent";
            HP = 3;
            xVelocity = 10;
        }
        else if (type == 'h') {
            mgFireRate = 1;
            damage = 5;
            bitmapName = "player_heavy_transparent";
            HP = 5;
            xVelocity = 10;
        }
        else if (type == 'l') {
            mgFireRate = 10;
            damage = 1;
            bitmapName = "player_light_transparent";
            HP = 1;
            xVelocity = 12;
        }
    }

    public void resetCredits(){
        lives = 0;
    }
}
