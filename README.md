# Minecraft Adventures Lite

CS375 Final Project: 2D Platformer Browser Game

Drexel University, Summer 2019-2020

Our project will be a quick platformer game that allows users to make accounts to keep track of their game data. Our intended audience ranges from kids to young adolescents. There are two game modes: (1) Story mode and (2) Infinite mode.

**Story Mode**: Made up of intentionally set-up levels for the player to complete. In this mode, the player will have to collect jewels and avoid zombies from spelling your doom. Grab a sword to have a fighting chance against the zombie, but be warned that a sword can break. Once the player completes all five stages, his or her score will get added to the leaderboard.

**Infinite Mode**: Made up of randomly generate levels created by our custom algorithm. In this mode, the player will test their perseverence as they try to pass as many levels as they can without dying. Each level will have a time limit to finish the map while all collected jewels will add additional time. How long can you last and how many levels will you conquer?

### __Team Covid Coders__
Amanda W.

Catherine N. 

Jessica W.

Phil H. 

## Running the Program After Installing Files

1. Navigate to the program's directory then run ```npm install``` in the terminal to install the Node.js dependencies.

2. Run ```./database``` in Terminal to create a database for users or manually create it using PostgreSQL. Note: If you don't have PostgreSQL installed on your device, please install it.

    ```
    >psql -U postgres
    >Password for user postgres: <Enter_Your_Password_Here>

    postgres=# CREATE DATABASE minecraftgame;

    postgres=# \c minecraftgame;

    minecraftgame=# CREATE TABLE users (
    minecraftgame(#     username VARCHAR(20),
    minecraftgame(#     hashed_password CHAR(60),
    minecraftgame(#     level1_fastest_run NUMERIC,
    minecraftgame(#     level2_fastest_run NUMERIC,
    minecraftgame(#     level3_fastest_run NUMERIC,
    minecraftgame(#     level4_fastest_run NUMERIC,
    minecraftgame(#     level5_fastest_run NUMERIC,
    minecraftgame(#     story_high_score NUMERIC,
    minecraftgame(#     infinite_high_score NUMERIC
    minecraftgame(# );
    ```

3. (Optional) Run ```./make-users``` in Terminal to add our four group members to the database. This is not a necessary step, but if you would like to test behavior when multiple users exist in the database, feel free to use this. Also, if you do not have bash on your device, just run the code manually below.

    ```
    psql --u postgres -d minecraftgame -c "INSERT INTO users (
        username,
        hashed_password,
        level1_fastest_run,
        level2_fastest_run,
        level3_fastest_run,
        level4_fastest_run,
        level5_fastest_run,
        story_high_score,
        infinite_high_score)
        VALUES (
            'phil',
            'philshashedpassword',
            10.124,
            11.246,
            24.631,
            32.443,
            30.774,
            109.218,
            4
    );
    INSERT INTO users (
        username,
        hashed_password,
        level1_fastest_run,
        level2_fastest_run,
        level3_fastest_run,
        level4_fastest_run,
        level5_fastest_run,
        story_high_score,
        infinite_high_score)
        VALUES (
            'amanda',
            'amandashashedpassword',
            9.124,
            11.246,
            24.631,
            32.440,
            25.774,
            94.215,
            5
    );
    INSERT INTO users (
        username,
        hashed_password,
        level1_fastest_run,
        level2_fastest_run,
        level3_fastest_run,
        level4_fastest_run,
        level5_fastest_run,
        story_high_score,
        infinite_high_score)
        VALUES (
            'jess',
            'jessshashedpassword',
            8.124,
            10.246,
            24.631,
            28.443,
            30.574,
            102.018,
            2
    );
    INSERT INTO users (
        username,
        hashed_password,
        level1_fastest_run,
        level2_fastest_run,
        level3_fastest_run,
        level4_fastest_run,
        level5_fastest_run,
        story_high_score,
        infinite_high_score)
        VALUES (
            'cat',
            'catshashedpassword',
            7.124,
            10.246,
            20.621,
            32.443,
            28.774,
            98.208,
            10
    );"
    ```

4. Create an ```env.json``` file with the credentials of your PostgreSQL database. You env.json file should look like the following:
    ```
    {
        "user": "postgres",
        "host": "localhost",
        "database": "minecraftgame",
        "password": "<your_password>",
        "port": 5432
    }
    ```

5. Create an account at the Register page.

6. Type ```node server.js``` into the terminal to run the server.

7. Navigate to ```http://localhost:3000``` on your preferred browser.

8. Enjoy the game!

<!-- ## Schedule
Week 7 (Tuesday, 8/4)
+ Going through the tutorials/Learning the resources
+ Flesh out the specifics of the gameplay
+ Set up basic skeleton of starter code

Week 8 (Tuesday, 8/11)
+ Work on the Game Aspect and Phaser
+ Create at least one level

Week 9 (Tuesday, 8/18)
+ Database
+ Log-in System
+ Continuing to work on the game

Week 10 (Tuesday, 8/25)
+ Implement multiplayer using websockets
+ Implement randomization of the maps

Week 11 (Tuesday, 9/1)
+ Extra Features
+ Polishing the game

Hard Deadline (Thursday of that week)
+ Missing tasks will be worked on together on Friday
+ Give a heads up about having the Friday meeting during Thursday class-time

## Sync-Ups
+ Tuesdays and Thursdays @ 11AM -->
