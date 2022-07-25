package com.example.RoboResistanceForce_V2;

public class Bullet {
    private float x;
    private float y;
    private float xVelocity;
    private int direction;
    Bullet(float x, float y, int speed, int direction){
        this.direction = direction;
        this.x = x;
        this.y = y;
        this.xVelocity = speed * direction;
    }
    //Gets the direction of the bullet
    public int getDirection(){
        return direction;
    }
    public void update(long fps, float gravity){
        x += xVelocity / fps;
    }
    //Hides the bullet from view
    public void hideBullet(){
        this.x = -100;
        this.y = -100;
        this.xVelocity = 0;
    }
    //Gets x and y location
    public float getX(){
        return x;
    }
    public float getY(){
        return y;
    }
}
