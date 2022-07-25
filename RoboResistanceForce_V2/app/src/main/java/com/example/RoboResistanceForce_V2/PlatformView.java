package com.example.RoboResistanceForce_V2;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Matrix;
import android.graphics.Paint;
import android.graphics.PointF;
import android.graphics.Rect;
import android.graphics.RectF;
import android.util.Log;
import android.view.MotionEvent;
import android.view.SurfaceHolder;
import android.view.SurfaceView;

import java.util.ArrayList;
/*This game is based on "Platformer game" by John Horton in "Android Game Programming by Example"
released in 2015 by Packet Publishing. This game take the framework from Horton's and modifies and expands
upon it to make it my own.
 */
public class PlatformView extends SurfaceView
        implements Runnable {

    private boolean debugging = false;
    private volatile boolean running;
    private Thread gameThread = null;
    // For drawing
    private Paint paint;
    // Canvas could initially be local.
    // But later we will use it outside of draw()
    private Canvas canvas;
    private SurfaceHolder ourHolder;

    Context context;
    long startFrameTime;
    long timeThisFrame;
    long fps;
    // Our new engine classes
    private LevelManager lm;
    private Viewport vp;
    InputController ic;
    SoundManager sm;
    private PlayerState ps;
    ArrayList<Character> enemyTypes;
    PlatformView(Context context, int screenWidth,
                 int screenHeight) {

        super(context);
        this.context = context;
        // Initialize our drawing objects
        ourHolder = getHolder();
        paint = new Paint();
        // Initialize the viewport
        vp = new Viewport(screenWidth, screenHeight);
        sm = new SoundManager();
        sm.loadSound(context);
        ps = new PlayerState();
        enemyTypes = new ArrayList<>();
        enemyTypes.add('g');
        enemyTypes.add('d');
        enemyTypes.add('b');
        enemyTypes.add('a');
        enemyTypes.add('s');
        enemyTypes.add('f');
        // Load the first level
        loadLevel("LevelCharacterSelect", 2, 4);
        //loadLevel("LevelOne", 2, 8);
        //loadLevel("LevelTwo", 2, 25);
    }

    @Override
    public void run() {
        while (running) {
            startFrameTime = System.currentTimeMillis();
            update();
            draw();
            // Calculate the fps this frame
            // We can then use the result to
            // time animations and movement.
            timeThisFrame = System.currentTimeMillis() - startFrameTime;
            if (timeThisFrame >= 1) {
                fps = 1000 / timeThisFrame;
            }
        }
    }
    //Update the different GameObjects (things like theit position, collision, etc.)
    private void update() {
        for (GameObject go : lm.gameObjects) {
            if (go.isActive()) {
                // Clip anything off-screen
                if (!vp.clipObjects(go.getWorldLocation().x,
                        go.getWorldLocation().y,
                        go.getWidth(),
                        go.getHeight())) {
                    // Set visible flag to true
                    go.setVisible(true);

                    // check collisions with player
                    int hit = lm.player.checkCollisions(go.getHitbox());
                    if (hit > 0) {
                        //collision! Now deal with different types
                        switch (go.getType()) {
                            /*case 'e':
                                //extralife
                                go.setActive(false);
                                go.setVisible(false);
                                sm.playSound("extra_life");
                                ps.addLife();

                                if (hit != 2) {
                                    lm.player.restorePreviousVelocity();
                                }
                                break;*/
                            case 'd':
                                PointF location;
                                //hit by drone
                                sm.playSound("player_burn");
                                ps.loseHP();
                                if (ps.getHP() <= 0) {
                                    location = new PointF(ps.loadLocation().x,
                                            ps.loadLocation().y);

                                    lm.player.setWorldLocationX(location.x);
                                    lm.player.setWorldLocationY(location.y);
                                    lm.player.setxVelocity(0);
                                    ps.loseLife();
                                }
                                break;
                            case 'g':
                                // Hit by guard
                                sm.playSound("player_burn");
                                ps.loseHP();
                                if (ps.getHP() <= 0) {
                                    location = new PointF(ps.loadLocation().x,
                                            ps.loadLocation().y);

                                    lm.player.setWorldLocationX(location.x);
                                    lm.player.setWorldLocationY(location.y);
                                    lm.player.setxVelocity(0);
                                    ps.loseLife();
                                }
                                break;
                            /*case 'f':
                                sm.playSound("player_burn");
                                ps.loseHP();
                                if (ps.getHP() <= 0) {
                                    location = new PointF(ps.loadLocation().x,
                                            ps.loadLocation().y);

                                    lm.player.setWorldLocationX(location.x);
                                    lm.player.setWorldLocationY(location.y);
                                    lm.player.setxVelocity(0);
                                    ps.loseLife();
                                }
                                break;*/
                            case 't': //Teleport to next level
                                if (lm.enemies.size() == 0) { //Only works if all enemies in level are defeated.
                                    Teleport teleport = (Teleport) go;
                                    Location t = teleport.getTarget();
                                    loadLevel(t.level, t.x, t.y);
                                    sm.playSound("teleport");
                                }
                                break;
                            case 'n':
                                ps.setType('n');
                                lm.player.setBitmapName("player_basic_transparent");
                                break;
                            case 'h':
                                ps.setType('h');
                                lm.player.setBitmapName("player_heavy_transparent");
                                break;
                            case 'l':
                                ps.setType('l');
                                lm.player.setBitmapName("player_light_transparent");
                                break;
                            default:// Probably a regular tile
                                if (hit == 1) {// Left or right
                                    lm.player.setxVelocity(0);
                                    lm.player.setPressingRight(false);
                                }
                                if (hit == 2) {// Feet
                                    lm.player.isFalling = false;
                                }
                                break;
                        }
                    }

                    //Check bullet collisions
                    //Player bullets
                    for (int i = 0; i < lm.player.bfg.getNumBullets(); i++) {
                        //Make a hitbox out of the the current bullet
                        RectHitbox r = new RectHitbox();
                        r.setLeft(lm.player.bfg.getBulletX(i));
                        r.setTop(lm.player.bfg.getBulletY(i));
                        r.setRight(lm.player.bfg.getBulletX(i) + .1f);
                        r.setBottom(lm.player.bfg.getBulletY(i) + .1f);
                        if (go.getHitbox().intersects(r)) {
                            // Collision detected
                            // make bullet disappear until it
                            // is respawned as a new bullet
                            lm.player.bfg.hideBullet(i);
                            r.setLeft(lm.player.bfg.getBulletX(i));
                            r.setTop(lm.player.bfg.getBulletY(i));
                            r.setRight(lm.player.bfg.getBulletX(i) + .1f);
                            r.setBottom(lm.player.bfg.getBulletY(i) + .1f);
                            //Now respond depending upon the type of object hit
                            if (enemyTypes.contains(go.getType()) == false) { //Did not hit an enemy
                                sm.playSound("ricochet");

                            } else if (enemyTypes.contains(go.getType()) == true) { //Hit an enemy
                                // Knock the guard back
                                //go.setWorldLocationX(go.getWorldLocation().x +
                                        //2 * (lm.player.bfg.getDirection(i)));
                                //lm.player.bfg.disableBullet(i);
                                go.loseHP(lm.player.bfg.damage);
                                if (go.getHP() <= 0) {
                                    go.setWorldLocation(-100, -100, 0);
                                    lm.enemies.remove(go);
                                }
                                sm.playSound("hit_guard");
                            } else if (go.getType() == 'd') {
                                //destroy the droid
                                sm.playSound("explode");
                                //permanently clip this drone
                                go.setWorldLocation(-100, -100, 0);
                            }
                        }
                    }

                    for (Enemy_basic eb : lm.enemyBasics) { //Basic enemies
                        for (int i = 0; i < eb.bfg.getNumBullets(); i++) {
                            //Make a hitbox out of the the current bullet
                            RectHitbox r = new RectHitbox();
                            r.setLeft(eb.bfg.getBulletX(i));
                            r.setTop(eb.bfg.getBulletY(i));
                            r.setRight(eb.bfg.getBulletX(i) + .1f);
                            r.setBottom(eb.bfg.getBulletY(i) + .1f);
                            if (lm.player.rectHitboxLeft.intersects(r) || lm.player.rectHitboxRight.intersects(r) ||
                                    lm.player.rectHitboxHead.intersects(r) || lm.player.rectHitboxFeet.intersects(r)) {
                                ps.loseHP();
                                eb.bfg.hideBullet(i);
                                if (ps.getHP() <= 0) {
                                    PointF location;
                                    location = new PointF(ps.loadLocation().x,
                                            ps.loadLocation().y);

                                    lm.player.setWorldLocationX(location.x);
                                    lm.player.setWorldLocationY(location.y);
                                    lm.player.setxVelocity(0);
                                    ps.loseLife();
                                    ps.resetHP();
                                }
                            }
                            if (go.getHitbox().intersects(r)) {
                                // Collision detected
                                // make bullet disappear until it
                                // is respawned as a new bullet
                                //eb.bfg.hideBullet(i);
                                r.setLeft(eb.bfg.getBulletX(i));
                                r.setTop(eb.bfg.getBulletY(i));
                                r.setRight(eb.bfg.getBulletX(i) + .1f);
                                r.setBottom(eb.bfg.getBulletY(i) + .1f);
                                //Now respond depending upon the type of object hit
                                if (go.getType() != eb.getType()) {
                                    sm.playSound("ricochet");
                                    eb.bfg.hideBullet(i);
                                }
                            }
                        }
                    }

                    for (Enemy_advanced eb : lm.advancedEnemies) { //Advanced enemies
                        for (int i = 0; i < eb.bfg.getNumBullets(); i++) {
                            //Make a hitbox out of the the current bullet
                            RectHitbox r = new RectHitbox();
                            r.setLeft(eb.bfg.getBulletX(i));
                            r.setTop(eb.bfg.getBulletY(i));
                            r.setRight(eb.bfg.getBulletX(i) + .1f);
                            r.setBottom(eb.bfg.getBulletY(i) + .1f);
                            if (lm.player.rectHitboxLeft.intersects(r) || lm.player.rectHitboxRight.intersects(r) ||
                                    lm.player.rectHitboxHead.intersects(r) || lm.player.rectHitboxFeet.intersects(r)) {
                                ps.loseHP();
                                eb.bfg.hideBullet(i);
                                if (ps.getHP() <= 0) {
                                    PointF location;
                                    location = new PointF(ps.loadLocation().x,
                                            ps.loadLocation().y);

                                    lm.player.setWorldLocationX(location.x);
                                    lm.player.setWorldLocationY(location.y);
                                    lm.player.setxVelocity(0);
                                    ps.loseLife();
                                    ps.resetHP();
                                }
                            }
                            if (go.getHitbox().intersects(r)) {
                                // Collision detected
                                // make bullet disappear until it
                                // is respawned as a new bullet
                                //eb.bfg.hideBullet(i);
                                r.setLeft(eb.bfg.getBulletX(i));
                                r.setTop(eb.bfg.getBulletY(i));
                                r.setRight(eb.bfg.getBulletX(i) + .1f);
                                r.setBottom(eb.bfg.getBulletY(i) + .1f);
                                //Now respond depending upon the type of object hit
                                if (go.getType() != eb.getType()) {
                                    sm.playSound("ricochet");
                                    eb.bfg.hideBullet(i);
                                }
                            }
                        }
                    }

                    for (Enemy_shielded eb : lm.shieldedEnemies) { //Advanced enemies
                        for (int i = 0; i < eb.bfg.getNumBullets(); i++) {
                            //Make a hitbox out of the the current bullet
                            RectHitbox r = new RectHitbox();
                            r.setLeft(eb.bfg.getBulletX(i));
                            r.setTop(eb.bfg.getBulletY(i));
                            r.setRight(eb.bfg.getBulletX(i) + .1f);
                            r.setBottom(eb.bfg.getBulletY(i) + .1f);
                            if (lm.player.rectHitboxLeft.intersects(r) || lm.player.rectHitboxRight.intersects(r) ||
                                    lm.player.rectHitboxHead.intersects(r) || lm.player.rectHitboxFeet.intersects(r)) {
                                ps.loseHP();
                                eb.bfg.hideBullet(i);
                                if (ps.getHP() <= 0) {
                                    PointF location;
                                    location = new PointF(ps.loadLocation().x,
                                            ps.loadLocation().y);

                                    lm.player.setWorldLocationX(location.x);
                                    lm.player.setWorldLocationY(location.y);
                                    lm.player.setxVelocity(0);
                                    ps.loseLife();
                                    ps.resetHP();
                                }
                            }
                            if (go.getHitbox().intersects(r)) {
                                // Collision detected
                                // make bullet disappear until it
                                // is respawned as a new bullet
                                //eb.bfg.hideBullet(i);
                                r.setLeft(eb.bfg.getBulletX(i));
                                r.setTop(eb.bfg.getBulletY(i));
                                r.setRight(eb.bfg.getBulletX(i) + .1f);
                                r.setBottom(eb.bfg.getBulletY(i) + .1f);
                                //Now respond depending upon the type of object hit
                                if (go.getType() != eb.getType() && go.getType() != 'f') {
                                    sm.playSound("ricochet");
                                    eb.bfg.hideBullet(i);
                                }
                            }
                        }
                    }

                    if (lm.isPlaying()) {
                        // Run any un-clipped updates
                        go.update(fps, lm.gravity);
                        if (go.getType() == 'd') {
                            // Let any near by drones know where the player is
                            Drone d = (Drone) go;
                            d.setWaypoint(lm.player.getWorldLocation());
                        }
                        else if (go.getType() == 'b') {
                            Enemy_basic eb = (Enemy_basic) go;
                            eb.setWaypoint(lm.player.getWorldLocation());
                        }
                        else if (go.getType() == 'a') {
                            Enemy_advanced ea = (Enemy_advanced) go;
                            ea.setWaypoint(lm.player.getWorldLocation());
                        }

                        else if (go.getType() == 's') {
                            Enemy_shielded eb = (Enemy_shielded) go;
                            eb.setWaypoint(lm.player.getWorldLocation());
                        }
                    }
                } else {
                    // Set visible flag to false
                    go.setVisible(false);
                    // Now draw() can ignore them

                }
            }
        }

        //For enemies to shoot
        for (Enemy_basic eb : lm.enemyBasics) { //Basic enemies
            if (eb.isActive()) {
                if (lm.isPlaying()) {
                    eb.update(fps, lm.gravity);
                }
            }
        }
       for (Enemy_advanced ea : lm.advancedEnemies) { //Advanced enemies
            if (ea.isActive()) {
                if (lm.isPlaying()) {
                    ea.update(fps, lm.gravity);
                }
            }
        }
        for (Enemy_shielded es : lm.shieldedEnemies) { //Advanced enemies
            if (es.isActive()) {
                if (lm.isPlaying()) {
                    es.update(fps, lm.gravity);
                }
            }
        }
        if (lm.isPlaying()) {
            //Reset the players location as the centre of the viewport
            vp.setWorldCentre(lm.gameObjects.get(lm.playerIndex)
                            .getWorldLocation().x,
                    lm.gameObjects.get(lm.playerIndex)
                            .getWorldLocation().y);}
        //Has player fallen out of the map?
        if (lm.player.getWorldLocation().x < 0 ||
                lm.player.getWorldLocation().x > lm.mapWidth ||
                lm.player.getWorldLocation().y > lm.mapHeight) {
            sm.playSound("player_burn");
            ps.loseLife();
            PointF location = new PointF(ps.loadLocation().x,
                    ps.loadLocation().y);

            lm.player.setWorldLocationX(location.x);
            lm.player.setWorldLocationY(location.y);
            lm.player.setxVelocity(0);
        }
        // Check if game is over
        if (ps.getLives() <= 0) {
            ps = new PlayerState();
            loadLevel("LevelCharacterSelect", 2, 4);
        }
    }//End update

    //Draw the game to the screen
    private void draw() {
        if (ourHolder.getSurface().isValid()) {
            //First we lock the area of memory we will be drawing to
            canvas = ourHolder.lockCanvas();
            // Rub out the last frame with arbitrary color
            paint.setColor(Color.argb(255, 0, 0, 255));
            canvas.drawColor(Color.argb(255, 0, 0, 255));

            // Draw parallax backgrounds from -1 to -3
            drawBackground(0, -3);

            // New drawing code will go here
            // Draw all the GameObjects
            Rect toScreen2d = new Rect();
            // Draw a layer at a time
            for (int layer = -1; layer <= 1; layer++)
                for (GameObject go : lm.gameObjects) {
                    //Only draw if visible and this layer
                    if (go.isVisible() && go.getWorldLocation().z
                            == layer) {
                        toScreen2d.set(vp.worldToScreen
                                (go.getWorldLocation().x,
                                        go.getWorldLocation().y,
                                        go.getWidth(),
                                        go.getHeight()));
                        if (go.isAnimated()) {
                            // Get the next frame of the bitmap
                            // Rotate if necessary
                            if (go.getFacing() == 1) {
                                // Rotate
                                Matrix flipper = new Matrix();
                                flipper.preScale(-1, 1);
                                Rect r = go.getRectToDraw(System.currentTimeMillis());
                                Bitmap b = Bitmap.createBitmap(
                                        lm.bitmapsArray[lm.getBitmapIndex(go.getType())],
                                        r.left,
                                        r.top,
                                        r.width(),
                                        r.height(),
                                        flipper,
                                        true);
                                canvas.drawBitmap(b, toScreen2d.left, toScreen2d.top, paint);
                            } else {
                                // draw it the regular way round
                                canvas.drawBitmap(
                                        lm.bitmapsArray[lm.getBitmapIndex(go.getType())],
                                        go.getRectToDraw(System.currentTimeMillis()),
                                        toScreen2d, paint);
                            }
                        } else { // Just draw the whole bitmap
                            canvas.drawBitmap(
                                    lm.bitmapsArray[lm.getBitmapIndex(go.getType())],
                                    toScreen2d.left,
                                    toScreen2d.top, paint);
                        }
                    }
                }
            //draw the bullets
            paint.setColor(Color.argb(255, 255, 255, 255));
            for (int i = 0; i < lm.player.bfg.getNumBullets(); i++) {
                // Pass in the x and y coords as usual
                // then .25 and .05 for the bullet width and height
                toScreen2d.set(vp.worldToScreen
                        (lm.player.bfg.getBulletX(i),
                                lm.player.bfg.getBulletY(i),
                                .25f,
                                .05f));
                canvas.drawRect(toScreen2d, paint);
            }
            // Draw enemy bullets
            paint.setColor(Color.argb(255, 255, 0, 0));
            for (int layer = -1; layer <= 1; layer++) {
                for (Enemy_basic eb : lm.enemyBasics) { //Basic enemies
                    //Only draw if visible and this layer
                    if (eb.getWorldLocation().z == layer) {
                        if (eb.getType() == 'b') {
                            for (int i = 0; i < eb.bfg.getNumBullets(); i++) {
                                // Pass in the x and y coords as usual
                                // then .25 and .05 for the bullet width and height
                                toScreen2d.set(vp.worldToScreen
                                        (eb.bfg.getBulletX(i),
                                                eb.bfg.getBulletY(i),
                                                .5f,
                                                .15f));
                                canvas.drawRect(toScreen2d, paint);
                            }
                        }

                    }
                }
                for (Enemy_advanced ea : lm.advancedEnemies) { //Advanced enemies
                    //Only draw if visible and this layer
                    if (ea.getWorldLocation().z == layer) {
                        if (ea.getType() == 'a') {
                            for (int i = 0; i < ea.bfg.getNumBullets(); i++) {
                                // Pass in the x and y coords as usual
                                // then .25 and .05 for the bullet width and height
                                toScreen2d.set(vp.worldToScreen
                                        (ea.bfg.getBulletX(i),
                                                ea.bfg.getBulletY(i),
                                                .5f,
                                                .15f));
                                canvas.drawRect(toScreen2d, paint);
                            }
                        }
                    }
                }
                for (Enemy_shielded es : lm.shieldedEnemies) { //Shield enemies
                    //Only draw if visible and this layer
                    if (es.getWorldLocation().z == layer) {
                        if (es.getType() == 's') {
                            for (int i = 0; i < es.bfg.getNumBullets(); i++) {
                                // Pass in the x and y coords as usual
                                // then .25 and .05 for the bullet width and height
                                toScreen2d.set(vp.worldToScreen
                                        (es.bfg.getBulletX(i),
                                                es.bfg.getBulletY(i),
                                                .5f,
                                                .15f));
                                canvas.drawRect(toScreen2d, paint);
                            }
                        }
                    }
                }
            }

            // Draw parallax backgrounds from layer 1 to 3
            drawBackground(4, 0);
            // Draw the HUD
            // This code needs bitmaps: extra life, upgrade and coin
            // Therefore there must be at least one of each in the level

            int topSpace = vp.getPixelsPerMetreY() / 4;
            int iconSize = vp.getPixelsPerMetreX();
            int padding = vp.getPixelsPerMetreX() / 5;
            int centring = vp.getPixelsPerMetreY() / 6;
            paint.setTextSize(vp.getPixelsPerMetreY()/2);
            paint.setTextAlign(Paint.Align.CENTER);
            paint.setColor(Color.argb(100, 0, 0, 0));
            canvas.drawRect(0,0,iconSize * 7.0f, topSpace*2 + iconSize,paint);
            paint.setColor(Color.argb(255, 255, 255, 0));
            //canvas.drawBitmap(lm.getBitmap('e'), 0, topSpace, paint);
            canvas.drawText("" + ps.getLives(), (iconSize * 1) + padding, (iconSize) - centring, paint);
            //canvas.drawBitmap(lm.getBitmap('c'), (iconSize * 2.5f) + padding, topSpace, paint);
            canvas.drawText("" + ps.getHP(), (iconSize * 3.5f) + padding
                    * 2, (iconSize) - centring, paint);
            //canvas.drawBitmap(lm.getBitmap('u'), (iconSize * 5.0f) + padding, topSpace, paint);
            canvas.drawText("" + ps.getFireRate(), (iconSize * 6.0f) + padding
                    * 2, (iconSize) - centring, paint);
                // Text for debugging
                if (debugging) {
                    paint.setTextSize(16);
                    paint.setTextAlign(Paint.Align.LEFT);
                    paint.setColor(Color.argb(255, 255, 255, 255));
                    canvas.drawText("fps:" + fps, 10, 60, paint);

                    canvas.drawText("num objects:" +
                            lm.gameObjects.size(), 10, 80, paint);

                    canvas.drawText("num clipped:" +
                            vp.getNumClipped(), 10, 100, paint);

                    canvas.drawText("playerX:" +
                                    lm.gameObjects.get(lm.playerIndex).
                                            getWorldLocation().x,
                            10, 120, paint);
                    canvas.drawText("playerY:" +
                                    lm.gameObjects.get(lm.playerIndex).
                                            getWorldLocation().y,
                            10, 140, paint);
                    canvas.drawText("Gravity:" +
                            lm.gravity, 10, 160, paint);

                    canvas.drawText("X velocity:" +
                                    lm.gameObjects.get(lm.playerIndex).getxVelocity(),
                            10, 180, paint);

                    canvas.drawText("Y velocity:" +
                                    lm.gameObjects.get(lm.playerIndex).getyVelocity(),
                            10, 200, paint);
                    //for reset the number of clipped objects each frame
                    vp.resetNumClipped();
                    canvas.drawRect(lm.player.rectHitboxLeft.getHitbox(), paint);
                    canvas.drawRect(lm.player.rectHitboxHead.getHitbox(), paint);
                    canvas.drawRect(lm.player.rectHitboxRight.getHitbox(), paint);
                    canvas.drawRect(lm.player.rectHitboxFeet.getHitbox(), paint);
                }// End if(debugging)

            //draw buttons
            paint.setColor(Color.argb(80, 255, 255, 255));
            ArrayList<Rect> buttonsToDraw;
            buttonsToDraw = ic.getButtons();
            for (Rect rect : buttonsToDraw) {
                RectF rf = new RectF(rect.left, rect.top,
                        rect.right, rect.bottom);

                canvas.drawRoundRect(rf, 15f, 15f, paint);
            }
            //draw paused text
            if (!this.lm.isPlaying()) {
                paint.setTextAlign(Paint.Align.CENTER);
                paint.setColor(Color.argb(255, 255, 255, 255));
                paint.setTextSize(120);
                canvas.drawText("Paused", vp.getScreenWidth() / 2,
                        vp.getScreenHeight() / 2, paint);
            }
            // Unlock and draw the scene
            ourHolder.unlockCanvasAndPost(canvas);
        }
    }

    // Clean up our thread if the game is interrupted
    public void pause() {
        running = false;
        try {
            gameThread.join();
        } catch (InterruptedException e) {
            Log.e("error", "failed to pause thread");
        }
    }

    // Make a new thread and start it
    // Execution moves to our run method
    public void resume() {
        running = true;
        gameThread = new Thread(this);
        gameThread.start();

    }

    //Load a level of our game
    public void loadLevel(String level, float px, float py) {
        lm = null;
        // Create a new LevelManager
        // Pass in a Context, screen details, level name
        // and player location
        ps.setStats();
        lm = new LevelManager(context,
                vp.getPixelsPerMetreX(),
                vp.getScreenWidth(),
                ic, level, px, py, ps);

        ic = new InputController(vp.getScreenWidth(),
                vp.getScreenHeight());
        PointF location = new PointF(px, py);
        ps.saveLocation(location);
        // Reload the players current fire rate from the player state
        lm.player.bfg.setFireRate(ps.getFireRate());
        // Set the players location as the world centre
        vp.setWorldCentre(lm.gameObjects.get(lm.playerIndex)
                        .getWorldLocation().x,
                lm.gameObjects.get(lm.playerIndex)
                        .getWorldLocation().y);
    }

    //For detecting when the player touches the screen
    @Override
    public boolean onTouchEvent(MotionEvent motionEvent) {
        if (lm != null) {
            ic.handleInput(motionEvent, lm, sm, vp);
        }
        //invalidate();
        return true;
    }

    //Drawing the background of levels
    private void drawBackground(int start, int stop) {
        Rect fromRect1 = new Rect();
        Rect toRect1 = new Rect();
        Rect fromRect2 = new Rect();
        Rect toRect2 = new Rect();
        for (Background bg : lm.backgrounds) {
            if (bg.z < start && bg.z > stop) {
                // Is this layer in the viewport?
                // Clip anything off-screen
                if (!vp.clipObjects(-1, bg.y, 1000, bg.height)) {
                    float floatstartY = ((vp.getyCentre() -
                            ((vp.getViewportWorldCentreY() - bg.y) *
                                    vp.getPixelsPerMetreY())));

                    int startY = (int) floatstartY;

                    float floatendY = ((vp.getyCentre() -
                            ((vp.getViewportWorldCentreY() - bg.endY) *
                                    vp.getPixelsPerMetreY())));

                    int endY = (int) floatendY;
                    // Define what portion of bitmaps to capture
                    // and what coordinates to draw them at
                    fromRect1 = new Rect(0, 0, bg.width - bg.xClip,
                            bg.height);

                    toRect1 = new Rect(bg.xClip, startY, bg.width, endY);
                    fromRect2 = new Rect(bg.width - bg.xClip, 0,
                            bg.width, bg.height);

                    toRect2 = new Rect(0, startY, bg.xClip, endY);
                }// End if (!vp.clipObjects...
                //draw backgrounds
                if (!bg.reversedFirst) {

                    canvas.drawBitmap(bg.bitmap,
                            fromRect1, toRect1, paint);
                    canvas.drawBitmap(bg.bitmapReversed,
                            fromRect2, toRect2, paint);

                } else {
                    canvas.drawBitmap(bg.bitmap,
                            fromRect2, toRect2, paint);

                    canvas.drawBitmap(bg.bitmapReversed,
                            fromRect1, toRect1, paint);
                }
                // Calculate the next value for the background's
                // clipping position by modifying xClip
                // and switching which background is drawn first,
                // if necessary.
                bg.xClip -= lm.player.getxVelocity() / (20 / bg.speed);
                if (bg.xClip >= bg.width) {
                    bg.xClip = 0;
                    bg.reversedFirst = !bg.reversedFirst;
                }
                else if (bg.xClip <= 0) {
                    bg.xClip = bg.width;
                    bg.reversedFirst = !bg.reversedFirst;
                }
            }
        }
    }
}// End of PlatformView

