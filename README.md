# Tetris
A Tetris clone developed using tiny-graphics.js.

## Setup
1. Run the following commands to start a local web server.
  ```
  # Mac Users
  $ host.command
  # Windows Users
  $ host.bat
  ```
2. Open a web browser and go to http://localhost:8000/.
3. A round of Tetris will immediately begin.

## Controls
* Right: d or l
* Left: a or j
* Down: s or k
* Rotate: i or w
* Drop: c
* Restart: r

## Rules
The goal is to obtain as many points by clearing lines without placing a block that is outside of the grid.
Clearing more lines at a time will grant the player more points.

## Implementation Details
* Used basic transformation matrices to translate and scale objects.
* Texture mapped images to cube faces to display different colored pieces.
* Randomly generate Tetris pieces.
* Used cube outline for a "ghost piece" to indicate where it will be placed at current trajectory.
* Created basic UI to display score and game over screen with texture mapping.
* Background music and sound effects play when player starts interaction.
* Used animation_time as a timer for game state updates (frames).

## Advanced Feature
* Collision detection of blocks.

## Game Demo
![Recordit GIF](https://s4.gifyu.com/images/gameDemo.gif)