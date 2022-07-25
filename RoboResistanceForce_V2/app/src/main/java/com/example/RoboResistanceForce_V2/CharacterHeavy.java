package com.example.RoboResistanceForce_V2;
//For selecting the heavy character
public class CharacterHeavy extends GameObject {
    CharacterHeavy(int worldStartX, float worldStartY,
                   char type) {
        final float HEIGHT = 2;
        final float WIDTH = 1;
        setHeight(HEIGHT); // 2 metres tall
        setWidth(WIDTH); // 1 metre wide
        setType(type);
        setBitmapName("player_heavy_transparent");
        setWorldLocation(worldStartX, worldStartY, 0);
        setRectHitbox();
    }

    public void update(long fps, float gravity) {
    }
}
