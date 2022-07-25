package com.example.RoboResistanceForce_V2;

import android.content.Context;

//Energy shield that can be placed on regular enemies to make them tougher
public class Shield extends GameObject {
    //private float HP;
    Shield(Context context, float worldStartX,
           float worldStartY, char type,
           int pixelsPerMetre) {
        final int ANIMATION_FPS = 1;
        final int ANIMATION_FRAME_COUNT = 1;
        final String BITMAP_NAME = "shield_transparent";
        final float HEIGHT = 2f;
        final float WIDTH = 1.5f;
        setHeight(HEIGHT); // 2 metre tall
        setWidth(WIDTH); // 1 metres wide
        setType(type);
        setBitmapName("shield_transparent");
        // Now for the player's other attributes
        // Our game engine will use these
        //setMoves(true);
        setActive(true);
        setVisible(true);
        // Set this object up to be animated
        setAnimFps(ANIMATION_FPS);
        setAnimFrameCount(ANIMATION_FRAME_COUNT);
        setBitmapName(BITMAP_NAME);
        setAnimated(context, pixelsPerMetre, false);
        // Where does the tile start
        // X and y locations from constructor parameters
        setWorldLocation(worldStartX, worldStartY, 1);
        setHP(5);
    }

    public void update(long fps, float gravity) {
        setRectHitbox();
    }
}
