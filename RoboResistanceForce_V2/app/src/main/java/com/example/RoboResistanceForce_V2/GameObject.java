package com.example.RoboResistanceForce_V2;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Rect;

public abstract class GameObject {
    private Vector2Point5D worldLocation;
    private float width;
    private float height;
    private boolean active = true;
    private boolean visible = true;
    private int animFrameCount = 1;
    private char type;
    private String bitmapName;
    private float xVelocity;
    private float yVelocity;
    final int LEFT = -1;
    final int RIGHT = 1;
    private int facing;
    private boolean moves = false;
    private RectHitbox rectHitbox = new RectHitbox();
    // Most objects only have 1 frame
    // And don't need to bother with these
    private Animation anim = null;
    private boolean animated;
    private int animFps = 1;
    private boolean traversable = false;
    private int HP;

    public abstract void update(long fps, float gravity);

    public String getBitmapName() {
        return bitmapName;
    }

    //Prepares the bitmap for drawing with things like proper scaling and animation frames
    public Bitmap prepareBitmap(Context context, String bitmapName, int pixelsPerMetre) {
        // Make a resource id from the bitmapName
        int resID = context.getResources().
                getIdentifier(bitmapName, "drawable", context.getPackageName());

        // Create the bitmap
        Bitmap bitmap = BitmapFactory.decodeResource(context.getResources(), resID);
        // Scale the bitmap based on the number of pixels per metre
        // Multiply by the number of frames in the image
        // Default 1 frame
        bitmap = Bitmap.createScaledBitmap(bitmap,
                (int) (width * animFrameCount * pixelsPerMetre),
                (int) (height * pixelsPerMetre),
                false);
        return bitmap;
    }

    //Move along the x and/or y axis
    void move(long fps){
        if(xVelocity != 0) {
            this.worldLocation.x += xVelocity / fps;
        }
        if(yVelocity != 0) {
            this.worldLocation.y += yVelocity / fps;
        }
    }

    //Sets up animation on an object
    public void setAnimated(Context context, int pixelsPerMetre,
                            boolean animated){

        this.animated = animated;
        this.anim = new Animation(context, bitmapName,
                height,
                width,
                animFps,
                animFrameCount,
                pixelsPerMetre );
    }

    //gets the rectangle to draw the object
    public Rect getRectToDraw(long deltaTime){
        return anim.getCurrentFrame(
                deltaTime,
                xVelocity,
                isMoves());
    }


    public Vector2Point5D getWorldLocation() {
        return worldLocation;
    }
    public void setWorldLocation(float x, float y, int z) {
        this.worldLocation = new Vector2Point5D();
        this.worldLocation.x = x;
        this.worldLocation.y = y;
        this.worldLocation.z = z;
    }
    public void setRectHitbox() {
        rectHitbox.setTop(worldLocation.y);
        rectHitbox.setLeft(worldLocation.x);
        rectHitbox.setBottom(worldLocation.y + height);
        rectHitbox.setRight(worldLocation.x + width);
    }
    RectHitbox getHitbox(){
        return rectHitbox;
    }

    public void setWorldLocationY(float y) {
        this.worldLocation.y = y;
    }
    public void setWorldLocationX(float x) {
        this.worldLocation.x = x;
    }
    public void setBitmapName(String bitmapName){
        this.bitmapName = bitmapName;
    }
    public float getWidth() {
        return width;
    }
    public void setWidth(float width) {
        this.width = width;
    }
    public float getHeight() {
        return height;
    }
    public void setHeight(float height) {
        this.height = height;
    }
    public boolean isActive() {
        return active;
    }
    public boolean isVisible() {
        return visible;
    }
    public void setVisible(boolean visible) {
        this.visible = visible;
    }
    public char getType() {
        return type;
    }
    public void setType(char type) {
        this.type = type;
    }
    public int getFacing() {
        return facing;
    }

    public void setFacing(int facing) {
        this.facing = facing;
    }
    public float getxVelocity() {
        return xVelocity;
    }
    public void setxVelocity(float xVelocity) {
        // Only allow for objects that can move
        if(moves) {
            this.xVelocity = xVelocity;
        }
    }
    public float getyVelocity() {
        return yVelocity;
    }
    public void setyVelocity(float yVelocity) {
        // Only allow for objects that can move
        if(moves) {
            this.yVelocity = yVelocity;
        }
    }
    public boolean isMoves() {
        return moves;
    }
    public void setMoves(boolean moves) {
        this.moves = moves;
    }
    public void setActive(boolean active) {
        this.active = active;
    }
    public void setAnimFps(int animFps) {
        this.animFps = animFps;
    }
    public void setAnimFrameCount(int animFrameCount) {
        this.animFrameCount = animFrameCount;
    }
    public boolean isAnimated() {
        return animated;
    }
    public void setTraversable(){
        traversable = true;
    }
    public boolean isTraversable(){
        return traversable;
    }

    public void loseHP(int damage) { HP -= damage; }
    public int getHP() {return HP; }
    public void setHP(int HP) {this.HP = HP;}
}
