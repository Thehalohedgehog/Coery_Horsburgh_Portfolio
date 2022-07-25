package com.example.RoboResistanceForce_V2;

import android.content.Context;
//For selecting the normal character
public class CharacterNormal extends GameObject {
    CharacterNormal(int worldStartX, float worldStartY,
                    char type) {
        final float HEIGHT = 2;
        final float WIDTH = 1;
        setHeight(HEIGHT); // 2 metres tall
        setWidth(WIDTH); // 1 metre wide
        setType(type);
        setBitmapName("player_basic_transparent");
        setWorldLocation(worldStartX, worldStartY, 0);
        setRectHitbox();
    }

    public void update(long fps, float gravity) {
    }
}
