package com.example.RoboResistanceForce_V2;
import android.graphics.Rect;

//The hitboxes of the game objects
public class RectHitbox {
    float top;
    float left;
    float bottom;
    float right;
    float height;
    boolean intersects(RectHitbox rectHitbox){
        boolean hit = false;
        if(this.right > rectHitbox.left
                && this.left < rectHitbox.right ){
            // Intersecting on x axis
            if(this.top < rectHitbox.bottom
                    && this.bottom > rectHitbox.top ){
                // Intersecting on y as well
                // Collision
                hit = true;
            }
        }
        return hit;
    }
    public void setTop(float top) {
        this.top = top;
    }
    public float getLeft() {
        return left;
    }
    public void setLeft(float left) {
        this.left = left;
    }
    public void setBottom(float bottom) {
        this.bottom = bottom;
    }
    public float getRight() {
        return right;
    }
    public void setRight(float right) {
        this.right = right;
    }
    public float getHeight() {
        return height;
    }
    public void setHeight(float height) {
        this.height = height;
    }

    public Rect getHitbox() {
        Rect hitbox = new Rect();
        hitbox.top = Math.round(top);
        hitbox.left = Math.round(left);
        hitbox.bottom = Math.round(bottom);
        hitbox.right = Math.round(right);
        return hitbox;
    }
}
