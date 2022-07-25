package com.example.RoboResistanceForce_V2;

import java.util.ArrayList;

public class LevelCharacterSelect extends LevelData {

    LevelCharacterSelect() {
        tiles = new ArrayList<String>();

        this.tiles.add("888888888888888888888888888888888888888888888888");
        this.tiles.add("8.p............................................8");
        this.tiles.add("8..............................................8");
        this.tiles.add("8..............................................8");
        this.tiles.add("8..............................................8");
        this.tiles.add("8..............................................8");
        this.tiles.add("8...........n..........h.........l.............8");
        this.tiles.add("8..............................................8");
        this.tiles.add("8..........888........888.......888............8");
        this.tiles.add("8............................................t.8");
        this.tiles.add("8..............................................8");
        this.tiles.add("888888888888888888888888888888888888888888888888");

        // Declare the values for the teleports in order of appearance
        locations = new ArrayList<Location>();

        this.locations.add(new Location("LevelOne", 2f, 8f));

        backgroundDataList = new ArrayList<BackgroundData>();
        // note that speeds less than 2 cause problems

        this.backgroundDataList.add(new BackgroundData("underground", true, -1, -10, 25, 4, 35 ));
    }
}
