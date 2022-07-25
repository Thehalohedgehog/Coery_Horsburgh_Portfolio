package com.example.RoboResistanceForce_V2;
import android.content.Context;

public class Enemy_advanced extends GameObject{
    // Basic enemies stay in place and shoot every few seconds
    private float waypointX1;// always on left
    private float waypointX2;// always on right
    private int currentWaypoint;
    private int rateOfFire = 1;
    private long lastShotTime;
    final float MAX_X_VELOCITY = 3;
    public MachineGun bfg;

    Enemy_advanced(Context context, float worldStartX,
                   float worldStartY, char type,
                   int pixelsPerMetre) {

        final int ANIMATION_FPS = 8;
        final int ANIMATION_FRAME_COUNT = 1;
        final String BITMAP_NAME = "enemy_advanced_transparent";
        final float HEIGHT = 2f;
        final float WIDTH = 1;
        setHeight(HEIGHT); // 2 metre tall
        setWidth(WIDTH); // 1 metres wide
        setType(type);
        setBitmapName("enemy_advanced_transparent");
        // Now for the player's other attributes
        // Our game engine will use these
        //setMoves(true);
        setActive(true);
        setVisible(true);
        // Set this object up to be animated
        setAnimFps(ANIMATION_FPS);
        setAnimFrameCount(ANIMATION_FRAME_COUNT);
        setBitmapName(BITMAP_NAME);
        setAnimated(context, pixelsPerMetre, true);
        // Where does the tile start
        // X and y locations from constructor parameters
        setWorldLocation(worldStartX, worldStartY, 0);
        setxVelocity(-MAX_X_VELOCITY);
        currentWaypoint = 1;
        setHP(15);
        setFacing(RIGHT);
        bfg = new MachineGun(1, 3);
    }

    //Shoot its gun
    public void shootGun() {
        bfg.shoot(this.getWorldLocation().x, this.getWorldLocation().y, getFacing(), getHeight());
    }

    //Update its location and shoot its gun every few seconds if it is on screen
    public void update(long fps, float gravity) {
        // update the enemy's hitbox
        setRectHitbox();

        bfg.update(fps, gravity);
        if (isVisible() == true) {
            if(System.currentTimeMillis() - lastShotTime >
                    3000/rateOfFire) {
                lastShotTime = System.currentTimeMillis();
                shootGun();
            }
        }
    }

    //Face towards the player
    public void setWaypoint(Vector2Point5D playerLocation) {
        if (this.getWorldLocation().x >= playerLocation.x) {
            setFacing(LEFT);
        }
        else {
            setFacing(RIGHT);
        }
    }

}
