package com.example.RoboResistanceForce_V2;
import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.Rect;
import java.util.ArrayList;
public class LevelManager {
    private String level;
    int mapWidth;
    int mapHeight;
    Player player;
    int playerIndex;
    private boolean playing;
    float gravity;
    PlayerState ps;
    LevelData levelData;
    ArrayList<GameObject> gameObjects;
    ArrayList<GameObject> enemies;
    ArrayList<Enemy_basic> enemyBasics;
    ArrayList<Enemy_advanced> advancedEnemies;
    ArrayList<Enemy_shielded> shieldedEnemies;
    ArrayList<Background> backgrounds;
    ArrayList<Rect> currentButtons;
    Bitmap[] bitmapsArray;

    //Set up the levels and arrays to hold the game objects
    public LevelManager(Context context,
                        int pixelsPerMetre, int screenWidth,
                        InputController ic,
                        String level,
                        float px, float py, PlayerState ps) {
        this.level = level;
        switch (level) {
            case "LevelOne":
                levelData = new LevelOne();
                break;
            // We can add extra levels here
            case "LevelTwo":
                levelData = new LevelTwo();
                break;
            case "LevelThree":
                levelData = new LevelThree();
                break;
            case "LevelCharacterSelect":
                levelData = new LevelCharacterSelect();
                break;
        }
        // To hold all our GameObjects
        gameObjects = new ArrayList<GameObject>();
        enemyBasics = new ArrayList<Enemy_basic>();
        advancedEnemies = new ArrayList<Enemy_advanced>();
        shieldedEnemies = new ArrayList<Enemy_shielded>();
        enemies = new ArrayList<GameObject>();
        // To hold 1 of every Bitmap
        bitmapsArray = new Bitmap[50];
        this.ps = ps;
        // Load all the GameObjects and Bitmaps
        loadMapData(context, pixelsPerMetre, px, py);
        loadBackgrounds(context, pixelsPerMetre, screenWidth);
        // Set waypoints for our guards
        setWaypoints();
        // Ready to play
        //playing = true;
    }

    public boolean isPlaying() {
        return playing;
    }

    private void loadBackgrounds(Context context,
                                 int pixelsPerMetre, int screenWidth) {

        backgrounds = new ArrayList<Background>();
        //load the background data into the Background objects and
        // place them in our GameObject arraylist
        for (BackgroundData bgData : levelData.backgroundDataList) {
            backgrounds.add(new Background(context,
                    pixelsPerMetre, screenWidth, bgData));
        }
    }

    // Each index Corresponds to a bitmap
    public Bitmap getBitmap(char blockType) {
        int index;
        switch (blockType) {
            case '.':
                index = 0;
                break;
            case '1':
                index = 1;
                break;
            case 'p':
                index = 2;
                break;
            case '8':
                index = 3;
                break;
            case 'b':
                index = 4;
                break;
            case 'a':
                index = 5;
                break;
            case 's':
                index = 6;
                break;
            case 'f':
                index = 7;
                break;
            case 't':
                index = 8;
                break;
            case 'n':
                index = 9;
                break;
            case 'l':
                index = 10;
                break;
            case 'g':
                index = 11;
                break;
            default:
                index = 0;
                break;
        }// End switch
        return bitmapsArray[index];
    }// End getBitmap

    // This method allows each GameObject which 'knows'
    // its type to get the correct index to its Bitmap
    // in the Bitmap array.
    public int getBitmapIndex(char blockType) {
        int index;
        switch (blockType) {
            case '.':
                index = 0;
                break;
            case '1':
                index = 1;
                break;
            case 'p':
                index = 2;
                break;
            case '8':
                index = 3;
                break;
            case 'b':
                index = 4;
                break;
            case 'a':
                index = 5;
                break;
            case 's':
                index = 6;
                break;
            case 'f':
                index = 7;
                break;
            case 't':
                index = 8;
                break;
            case 'n':
                index = 9;
                break;
            case 'l':
                index = 10;
                break;
            case 'g':
                index = 11;
                break;
            default:
                index = 0;
                break;

        }// End switch
        return index;
    }// End getBitmapIndex()

    //What type of object to add to the game
    private void loadMapData(Context context,
                             int pixelsPerMetre,
                             float px, float py) {
        char c;
        //Keep track of where we load our game objects
        int currentIndex = -1;
        int teleportIndex = -1;
        // how wide and high is the map? Viewport needs to know
        mapHeight = levelData.tiles.size();
        mapWidth = levelData.tiles.get(0).length();
        for (int i = 0; i < levelData.tiles.size(); i++) {
            for (int j = 0; j <
                    levelData.tiles.get(i).length(); j++) {
                c = levelData.tiles.get(i).charAt(j);
                // Don't want to load the empty spaces
                if (c != '.'){
                    currentIndex++;
                    switch (c) {
                        case 'p':
                            // Add a player to the gameObjects
                            gameObjects.add(new Player(context, px, py, pixelsPerMetre, ps.getFireRate(), ps.getDamage(), ps.getBitmapName(), ps.getxVelocity()));
                            // We want the index of the player
                            playerIndex = currentIndex;
                            // We want a reference to the player
                            player = (Player) gameObjects.get(playerIndex);
                            break;
                        case 'd':
                            // Add a drone to the gameObjects
                            gameObjects.add(new Drone(j, i, c));
                            break;
                        case 'g':
                            // Add a guard to the gameObjects
                            gameObjects.add(new Enemy_tank(context, j, i, c, pixelsPerMetre));
                            break;
                        case 'b':
                            // Add a basic enemy to the gameObjects
                            Enemy_basic eb = new Enemy_basic(context, j, i, c, pixelsPerMetre);
                            gameObjects.add(eb);
                            enemyBasics.add(eb);
                            enemies.add(eb);
                            break;
                        case 'a':
                            // Add a basic enemy to the gameObjects
                            Enemy_advanced ea = new Enemy_advanced(context, j, i, c, pixelsPerMetre);
                            gameObjects.add(ea);
                            advancedEnemies.add(ea);
                            enemies.add(ea);
                            break;
                        case 's':
                            // Add a basic enemy to the gameObjects
                            Enemy_shielded es = new Enemy_shielded(context, j, i, c, pixelsPerMetre);
                            gameObjects.add(es);
                            shieldedEnemies.add(es);
                            enemies.add(es);
                            break;
                        case 'n':
                            //Add the normal character for character selection
                            gameObjects.add(new CharacterNormal(j, i, c));
                            break;
                        case 'h':
                            //Add the heavy character for character selection
                            gameObjects.add(new CharacterHeavy(j, i, c));
                            break;
                        case 'l':
                            //Add the light character for character selection
                            gameObjects.add(new CharacterLight(j, i, c));
                            break;
                        case 'f':
                            // Add a fire tile the gameObjects
                            gameObjects.add(new Shield
                                    (context, j+0.75f, i, c, pixelsPerMetre));
                            break;
                        case '8':
                            // Add a tile to the gameObjects
                            gameObjects.add(new Ground(j, i, c));
                            break;
                        case 't':
                            // Add a teleport to the gameObjects
                            teleportIndex++;
                            gameObjects.add(new Teleport(j, i, c,
                                    levelData.locations.get(teleportIndex)));

                            break;
                    }// End switch
                    // If the bitmap isn't prepared yet
                    if (bitmapsArray[getBitmapIndex(c)] == null) {

                        // Prepare it now and put it in the bitmapsArrayList
                        bitmapsArray[getBitmapIndex(c)] =
                                gameObjects.get(currentIndex).
                                        prepareBitmap(context,
                                                gameObjects.get(currentIndex).
                                                        getBitmapName(),
                                                pixelsPerMetre);
                    }// End if
                }// End if (c != '.'){

            }// End for j

        }// End for i
    }// End loadMapData()

    public void switchPlayingStatus() {
        playing = !playing;
        if (playing) {
            gravity = 6;
        } else {
            gravity = 0;
        }
    }

    //Set they waypoints for the tank enemies
    public void setWaypoints() {
        // Loop through all game objects looking for Guards
        for (GameObject guard : this.gameObjects) {
            if (guard.getType() == 'g') {
                // Set waypoints for this guard
                // find the tile beneath the guard
                // this relies on the designer putting
                // the guard in sensible location
                int startTileIndex = -1;
                int startGuardIndex = 0;
                float waypointX1 = -1;
                float waypointX2 = -1;

                for (GameObject tile : this.gameObjects) {
                    startTileIndex++;
                    if (tile.getWorldLocation().y ==
                            guard.getWorldLocation().y + 2) {

                        // Tile is two spaces below current guard
                        // Now see if has same x coordinate
                        if (tile.getWorldLocation().x ==
                                guard.getWorldLocation().x) {

                            // Found the tile the guard is "standing" on
                            // Now go left as far as possible
                            // before non travers-able tile is found
                            // Either on guards row or tile row
                            // upto a maximum of 5 tiles.
                            // 5 is an arbitrary value you can
                            // change it to suit
                            for (int i = 0; i < 5; i++) {// left for loop
                                if (!gameObjects.get(startTileIndex -
                                        i).isTraversable()) {

                                    //set the left waypoint
                                    waypointX1 = gameObjects.get(startTileIndex -
                                            (i + 1)).getWorldLocation().x;

                                    break;// Leave left for loop
                                } else {
                                    // Set to max 5 tiles as
                                    // no non traversible tile found
                                    waypointX1 = gameObjects.get(startTileIndex -
                                            5).getWorldLocation().x;
                                }
                            }// end get left waypoint
                            for (int i = 0; i < 5; i++) {// right for loop
                                if (!gameObjects.get(startTileIndex +
                                        i).isTraversable()) {

                                    //set the right waypoint
                                    waypointX2 = gameObjects.get(startTileIndex +
                                            (i - 1)).getWorldLocation().x;

                                    break;// Leave right for loop
                                } else {
                                    //set to max 5 tiles away
                                    waypointX2 = gameObjects.get(startTileIndex +
                                            5).getWorldLocation().x;
                                }
                            }// end get right waypoint

                            Enemy_tank g = (Enemy_tank) guard;
                            g.setWaypoints(waypointX1, waypointX2);
                        }
                    }
                }
            }
        }
    }// End setWaypoints()
}// End LevelManager
