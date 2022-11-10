import {defs, tiny} from './examples/common.js';

import {Text_Line} from './examples/text-demo.js';

const {
    Vector, Vector3, vec, vec3, vec4, color, hex_color, Matrix, Mat4, Light, Shape, Material, Scene, Texture,
} = tiny;

const {Cube, Textured_Phong, Square} = defs;

class Cube_Outline extends Shape {
    constructor() {
        super("position", "color");

        this.arrays.position = Vector3.cast(
            [-1, -1, -1], [1, -1, -1],
            [-1,-1,-1], [-1,-1, 1],
            [-1,-1,-1],[-1,1,-1],
            [1,-1,-1],[1,-1,1],
            [1,-1,-1], [1,1,-1],
            [-1,-1,1], [1,-1,1],
            [-1,-1,1], [-1,1,1],
            [1,-1,1], [1,1,1],
            [-1,1,1], [1,1,1],
            [-1,1,-1], [-1,1,1],
            [1,1,-1], [-1,1,-1],
            [1,1,-1], [1,1,1]
        );


        this.arrays.color = [
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
            color(1,0.753,0.796,1), color(1,0.753,0.796,1),
        ];

        this.indices = false;
    }
}

export class Tetris extends Scene {
    constructor() {
        super();

        // At the beginning of our program, load one of each of these shape definitions onto the GPU.
        this.shapes = {
            'cube': new Cube(),
            'outline': new Cube_Outline(),
            'text': new Text_Line(20),
            'points': new Square(),
        }

        // *** Materials
        this.materials = {
            grid: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/black.png", "NEAREST"),
            }),

            border: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/white.png", "NEAREST"),
            }),

            piece1: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/blue.png", "NEAREST"),
            }),

            piece2: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/red.png", "NEAREST"),
            }),

            piece3: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/orange.png", "NEAREST"),
            }),

            piece4: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/green.png", "NEAREST"),
            }),

            piece5: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/skyblue.png", "NEAREST"),
            }),

            piece6: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/yellow.png", "NEAREST"),
            }),

            piece7: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/purple.png", "NEAREST"),
            }),
            scoreboard: new Material(new Textured_Phong(), {
                ambient: 1.0,
                texture: new Texture("assets/text.png", "NEAREST"),
            }),
            scoregain_10: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/points10.png", "NEAREST"),
            }),
            scoregain_100: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/points100.png", "NEAREST"),
            }),
            scoregain_1000: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/points1000.png", "NEAREST"),
            }),
            scoregain_10000: new Material(new Textured_Phong(), {
                color: hex_color("#000000"),
                ambient: 1.0,
                texture: new Texture("assets/points10000.png", "NEAREST"),
            }),
        };

        // The white material and basic shader are used for drawing the outline.
        this.white = new Material(new defs.Basic_Shader());

        // Initialize game state
        this.frame = 0;
        this.height = 24;
        this.width = 12;
        this.level = this.height - 1;
        this.score = 0;
        this.fall = false;
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            this.grid.push(new Array(this.width));
            for (let j = 0; j < this.width; j++) {
                if (i == this.height - 1 || j == 0 || j == this.width - 1) {
                    this.grid[i][j] = -1;   // Boundary
                } else {
                    this.grid[i][j] = 0;    // Empty
                }
            }
        }

        this.pieces = {
            1: [[0, 0, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0]],

            2: [[0, 0, 0, 0],
                [0, 0, 2, 0],
                [0, 2, 2, 0],
                [0, 2, 0, 0]],

            3: [[0, 0, 0, 0],
                [0, 3, 3, 0],
                [0, 0, 3, 0],
                [0, 0, 3, 0]],

            4: [[0, 0, 0, 0],
                [0, 4, 0, 0],
                [0, 4, 4, 0],
                [0, 0, 4, 0]],

            5: [[0, 0, 0, 0],
                [5, 5, 5, 5],
                [0, 0, 0, 0],
                [0, 0, 0, 0]],

            6: [[0, 0, 0, 0],
                [0, 6, 6, 0],
                [0, 6, 6, 0],
                [0, 0, 0, 0]],

            7: [[0, 0, 0, 0],
                [0, 7, 0, 0],
                [7, 7, 7, 0],
                [0, 0, 0, 0]],
        };

        this.piece_1_forms = {
            1: [[0, 0, 0, 0],
                [1, 1, 0, 0],
                [1, 0, 0, 0],
                [1, 0, 0, 0]],

            2: [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 1, 1, 0],
                [0, 0, 1, 0]],

            3: [[0, 0, 0, 0],
                [0, 0, 1, 0],
                [0, 0, 1, 0],
                [0, 1, 1, 0]],

            4: [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [1, 0, 0, 0],
                [1, 1, 1, 0]],
        };

        this.piece_2_forms = {
            1: [[0, 0, 0, 0],
                [0, 0, 2, 0],
                [0, 2, 2, 0],
                [0, 2, 0, 0]],

            2: [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [2, 2, 0, 0],
                [0, 2, 2, 0]],

        };

        this.piece_3_forms = {
            1: [[0, 0, 0, 0],
                [0, 3, 3, 0],
                [0, 0, 3, 0],
                [0, 0, 3, 0]],

            2: [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 3, 0],
                [3, 3, 3, 0]],

            3: [[0, 0, 0, 0],
                [0, 3, 0, 0],
                [0, 3, 0, 0],
                [0, 3, 3, 0]],

            4: [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [3, 3, 3, 0],
                [3, 0, 0, 0]],
        };

        this.piece_4_forms = {
            1: [[0, 0, 0, 0],
                [0, 4, 0, 0],
                [0, 4, 4, 0],
                [0, 0, 4, 0]],

            2: [[0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 4, 4],
                [0, 4, 4, 0]],
        };

        this.piece_5_forms = {
            1: [[0, 0, 0, 0],
                [5, 5, 5, 5],
                [0, 0, 0, 0],
                [0, 0, 0, 0]],

            2: [[0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0],
                [0, 5, 0, 0]],
        };

        this.piece_7_forms = {
            1: [[0, 0, 0, 0],
                [0, 7, 0, 0],
                [7, 7, 7, 0],
                [0, 0, 0, 0]],

            2: [[0, 0, 0, 0],
                [0, 7, 0, 0],
                [7, 7, 0, 0],
                [0, 7, 0, 0]],

            3: [[0, 0, 0, 0],
                [7, 7, 7, 0],
                [0, 7, 0, 0],
                [0, 0, 0, 0]],

            4: [[0, 0, 0, 0],
                [0, 7, 0, 0],
                [0, 7, 7, 0],
                [0, 7, 0, 0]],
        };


        this.piece_number = 0;
        this.curr_piece = this.generate_random_piece();
        this.curr_x = this.width / 2 - 2;
        this.curr_y = 0;
        this.ghost_y = this.curr_y;
        this.rotate_count = 0;
        this.clear_number = 0;
        this.pause = false;
        this.added_score = 0;
        this.buffer = 0;

        // *** Music and Sound effects
        this.sounds = {
            'bgm': new Audio("assets/bgm.mp3"),
            'move': new Audio("assets/Button_Press-007.wav"),
            'clear': new Audio("assets/bomb4.wav"),
        }
        this.sounds.bgm.volume = 0.1;
        this.sounds.move.volume = 0.4;
        this.sounds.clear.volume = 0.5;
        this.sounds.bgm.loop = true;
        /* this.sounds.bgm.play();*/
    }

    generate_random_piece() {
        let random_number = Math.random() * 7;

        if (random_number >= 0 && random_number < 1) {
            this.piece_number = 1;
            return this.pieces[1];
        } else if (random_number >= 1 && random_number < 2) {
            this.piece_number = 2;
            return this.pieces[2];
        } else if (random_number >= 2 && random_number < 3) {
            this.piece_number = 3;
            return this.pieces[3];
        } else if (random_number >= 3 && random_number < 4) {
            this.piece_number = 4;
            return this.pieces[4];
        } else if (random_number >= 4 && random_number < 5) {
            this.piece_number = 5;
            return this.pieces[5];
        } else if (random_number >= 5 && random_number < 6) {
            this.piece_number = 6;
            return this.pieces[6];
        } else if (random_number >= 6 && random_number <= 7) {
            this.piece_number = 7;
            return this.pieces[7];
        }
    }

    rotate() {
        this.rotate_count++;
        let r_temp = this.rotate_count;
        switch (this.piece_number) {
            case 1:
                this.curr_piece = this.piece_1_forms[this.rotate_count % 4 + 1];
                break;
            case 2:
                this.curr_piece = this.piece_2_forms[this.rotate_count % 2 + 1];
                break;
            case 3:
                this.curr_piece = this.piece_3_forms[this.rotate_count % 4 + 1];
                break;
            case 4:
                this.curr_piece = this.piece_4_forms[this.rotate_count % 2 + 1];
                break;
            case 5:
                this.curr_piece = this.piece_5_forms[this.rotate_count % 2 + 1];
                break;
            case 6:
                break;
            case 7:
                this.curr_piece = this.piece_7_forms[this.rotate_count % 4 + 1];
                break;
        }

        let x_lindex = this.curr_x + this.left_index(this.curr_piece);
        let x_rindex = this.curr_x + 3 - this.right_index(this.curr_piece);
        let y_dindex = this.curr_y + 3 - this.down_index(this.curr_piece);
        let y_uindex = this.curr_y + this.up_index(this.curr_piece);

        while(x_lindex <= 0)
        {
            if(x_lindex == 0) {
                let temp = this.curr_x;
                this.move(1, 0);
                if (temp == this.curr_x) {
                    /*let temp2 = this.curr_y;
                    this.move(0, -1)

                    if (temp2 == this.curr_y)
                        this.gameover();

                    else
                        this.move(0, 1)*/
                    this.rotate_count--;
                    break;

                }
            }

            else
            {
                this.hardmove(1,0);
            }

            x_lindex = this.curr_x + this.left_index(this.curr_piece);
        }

        while(x_rindex >= this.width-1)
        {
            if(x_rindex == this.width-1) {
                let temp = this.curr_x;
                this.move(-1, 0);
                if (temp == this.curr_x) {
                    /*this.move(0, -1)

                    if (this.curr_y == 0)
                        this.gameover();

                    else
                        this.move(0, 1)*/
                    this.rotate_count--;
                    break;

                }
            }

            else
            {
                this.hardmove(-1,0);
            }

            x_rindex = this.curr_x + 3 - this.right_index(this.curr_piece);
        }

        while(y_dindex >= this.height-1)
        {
            if(y_dindex == this.height-1) {
                this.move(0, -1);
                this.move(0, 1);
            }

            else
            {
                this.rotate_count--;
                break;
            }
            /*this.move(0,-1)*/

            y_dindex = this.curr_y + 3 - this.down_index(this.curr_piece);
        }

        /*while(y_uindex <= 0)
        {
            let temp = this.curr_y;
            this.move(0,1);
            if(this.curr_y == temp)
                this.gameover()

            y_uindex = this.curr_y + this.up_index(this.curr_piece);
        }*/

        if(x_lindex <= 0 || x_rindex >= this.width-1 || y_dindex >= this.height-1 || this.overlap()) {
            if(r_temp == this.rotate_count)
                this.rotate_count--;
        }

        if(r_temp != this.rotate_count)
        {
            switch (this.piece_number) {
                case 1:
                    this.curr_piece = this.piece_1_forms[this.rotate_count % 4 + 1];
                    break;
                case 2:
                    this.curr_piece = this.piece_2_forms[this.rotate_count % 2 + 1];
                    break;
                case 3:
                    this.curr_piece = this.piece_3_forms[this.rotate_count % 4 + 1];
                    break;
                case 4:
                    this.curr_piece = this.piece_4_forms[this.rotate_count % 2 + 1];
                    break;
                case 5:
                    this.curr_piece = this.piece_5_forms[this.rotate_count % 2 + 1];
                    break;
                case 6:
                    break;
                case 7:
                    this.curr_piece = this.piece_7_forms[this.rotate_count % 4 + 1];
                    break;
            }
        }
        /*while (this.overlap()) {
            this.move(0, -1)
            if (this.curr_y == 0)
                this.gameover();
        }
        this.move(0,1);
    }*/

    }

    hardmove(x,y)
    {
        this.curr_x += x;
        this.curr_y += y;
    }

    gameover(context, program_state)
    {
        let model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(5, -2, 4));
        this.shapes.text.set_string("Game Over!", context.context);
        this.shapes.text.draw(context, program_state, model_transform, this.materials.scoreboard);
    }

    UI(context, program_state)
    {
        let model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(30, -30, 0));
        this.shapes.text.set_string(`Score: ${this.score}`, context.context);
        this.shapes.text.draw(context, program_state, model_transform, this.materials.scoreboard);
    }

    //Display score added
    scoregain_text(context, program_state)
    {
        let model_transform = Mat4.identity();
        model_transform = model_transform.times(Mat4.translation(40, -33, 0));
        switch(this.added_score){
            case 10:
                model_transform = model_transform.times(Mat4.scale(2,2,2));
                this.shapes.points.draw(context, program_state, model_transform, this.materials.scoregain_10);
                break;
            case 100:
                model_transform = model_transform.times(Mat4.scale(2.1,2.1,2.1));
                this.shapes.points.draw(context, program_state, model_transform, this.materials.scoregain_100);
                break;
            case 1000:
                model_transform = model_transform.times(Mat4.scale(2.3,2.3,2.3));
                this.shapes.points.draw(context, program_state, model_transform, this.materials.scoregain_1000);
                break;
            case 10000:
                model_transform = model_transform.times(Mat4.scale(2.7,2.7,2.7));
                this.shapes.points.draw(context, program_state, model_transform, this.materials.scoregain_10000);
                break;
            default:
                break;
        }
    }

    score_calculator(){
        if(this.clear_number == 1){
            this.score += 10;
            this.added_score = 10;
        }
        else if(this.clear_number == 2){
            this.score += 100;
            this.added_score = 100;
        }
        else if(this.clear_number == 3){
            this.score += 1000;
            this.added_score = 1000;
        }
        else if(this.clear_number == 4){
            this.score += 10000;
            this.added_score = 10000;
        }
    }

    // Included Ghost Move
    move(x, y, g_state) {
        // TODO: Move piece in specified direction
        this.curr_x += x;
        this.curr_y += y;

        let x_lindex = this.curr_x;
        let x_rindex = this.curr_x + 3;
        let y_index = this.curr_y + 3;

        // Move Left/Right
        if (y == 0) {
            // Move Left
            if (x < 0) {
                // Check Boundary
                if (x_lindex <= 0) {
                    if (this.left_index(this.curr_piece) == 0) {
                        this.curr_x -= x;
                        return;
                    } else if (this.left_index(this.curr_piece) == 1) {
                        if (this.overlap())
                            this.curr_x -= x;
                        return;
                    }
                }

                // Check Overlap
                if (this.overlap()) {
                    this.curr_x -= x;
                    return;
                }
            }

            // Move Right
            if (x > 0) {
                // Check Boundary
                if (x_rindex >= this.width-1) {
                    if (this.right_index(this.curr_piece) == 0) {
                        this.curr_x -= x;
                        return;
                    } else if (this.right_index(this.curr_piece) >= 1) {
                        for (let i = 0; i < 4; i++) {
                            if (this.grid[this.curr_y + i][this.width - 3] != 0 && this.curr_piece[i][3]!=0) {
                                this.curr_x -= x;
                                return;
                            }
                        }

                        for (let i = 0; i < 4; i++) {
                            if (this.grid[this.curr_y + i][this.width - 2] != 0 && this.curr_piece[i][2]!=0) {
                                this.curr_x -= x;
                                return;
                            }
                        }
                    }
                }
                // Check Overlap
                if (this.overlap()) {
                    this.curr_x -= x;
                    return;
                }

            }
        }

        // Case for Move Down
        else if(y > 0)
        {
            if(y_index > this.height - 1)
            {
                if(this.down_index(this.curr_piece)<2)
                {
                    this.curr_y -= y;
                    if(!g_state)
                        this.collision();
                    else
                        this.ghost_y = this.curr_y;
                    return;
                }

                else if(this.down_index(this.curr_piece) == 2)
                {
                    for (let i = 0; i < 4; i++) {
                        if (this.grid[this.height - 2][this.curr_x + i] != 0) {
                            this.curr_y -= y;
                            if(!g_state)
                                this.collision();
                            else
                                this.ghost_y = this.curr_y;
                            return;
                        }
                    }
                    if(y_index == this.height+1)
                    {
                        this.curr_y -= y;

                        if(!g_state)
                            this.collision();
                        else
                            this.ghost_y = this.curr_y;
                        return;
                    }
                    return;
                }
            }

            if(this.overlap())
            {
                this.curr_y -= y;
                if(!g_state)
                    this.collision();
                else
                    this.ghost_y = this.curr_y;
                return;
            }

        }
    }

    // Check for overlap
    overlap()
    {
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                //if(this.grid[this.height_boundary(this.curr_y+j)][this.width_boundary(this.curr_x+i)]!=0 && this.curr_piece[i][j]!=0)
                if (this.grid[this.curr_y + i][this.curr_x + j] != 0) {
                    if(this.curr_piece[i][j] != 0)
                        return true;
                }
            }
        }

        return false;
    }


    // Check for left Space
    left_index(piece)
    {
        let counter = 0;
        for (let j = 0; j < 4; j++) {
            for (let i = 0; i < 4; i++) {
                if (piece[i][j] != 0) {
                    return counter;
                }
            }
            counter++;
        }
    }

    // Check for right Space
    right_index(piece)
    {
        let counter = 0;
        for (let j = 3; j > -1; j--) {
            for (let i = 0; i < 4; i++) {
                if (piece[i][j] != 0) {
                    return counter;
                }
            }
            counter++;
        }
    }

    // Check for down Space
    down_index(piece)
    {
        let counter = 0;
        for (let i = 3; i > -1; i--) {
            for (let j = 0; j < 4; j++) {
                if (piece[i][j] != 0) {
                    return counter;
                }
            }
            counter++;
        }
    }

    // Check for up Space
    up_index(piece)
    {
        let counter = 0;
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                if (piece[i][j] != 0) {
                    return counter;
                }
            }
            counter++;
        }
    }

    clear_line() {
        let counter = 0;

        for (let j = this.height - 2; j > 0; j--) {
            for (let i = 1; i < this.width - 1; i++) {
                if (this.grid[j][i] != 0) {
                    counter++;
                }
            }
            if (counter == 10) {
                //return;
                this.sounds.clear.currentTime = 0;
                this.sounds.clear.play();
                this.clear_number++;
                this.level = j;
                for (let i = 1; i < this.width - 1; i++) {
                    this.grid[j][i] = 0;
                }

                for (let k = this.level; k > 1; k--) {
                    for (let l = 1; l < this.width - 1; l++) {
                        this.grid[k][l] = this.grid[k - 1][l];
                        this.grid[k - 1][l] = 0;
                    }
                }
                this.clear_line();
                return;
            } else
                counter = 0;
        }


    }

    collision() {

        // Check if Game is Over
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < this.width - 1; j++) {
                if (this.grid[i][j] != 0) {
                    this.pause = true;
                }
            }
        }

        if (this.pause) {
            return;
        }

        // Update Grid
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                let H = this.curr_y + i;
                let W = this.curr_x + j;
                if (H >= 1 && H < this.height - 1 && W >= 1 && W < this.width - 1 && this.grid[H][W] == 0)
                    this.grid[H][W] = this.curr_piece[i][j]
            }
        }

        this.clear_line();
        this.score_calculator();
        this.piece_number = 0;
        this.curr_piece = this.generate_random_piece();
        this.curr_x = this.width / 2 - 2;
        this.curr_y = 0;
        this.rotate_count = 0;
        this.clear_number = 0;
        this.ghost_y = 0;
        this.move(0, 1)
        this.move(0, -1);
    }

    reset()
    {
        this.frame = 0;
        this.height = 24;
        this.width = 12;
        this.level = this.height - 1;
        this.score = 0;
        this.fall = false;
        this.grid = [];
        for (let i = 0; i < this.height; i++) {
            this.grid.push(new Array(this.width));
            for (let j = 0; j < this.width; j++) {
                if (i == this.height - 1 || j == 0 || j == this.width - 1) {
                    this.grid[i][j] = -1;   // Boundary
                } else {
                    this.grid[i][j] = 0;    // Empty
                }
            }
        }

        this.piece_number = 0;
        this.curr_piece = this.generate_random_piece();
        this.curr_x = this.width / 2 - 2;
        this.curr_y = 0;
        this.ghost_y = this.curr_y;
        this.rotate_count = 0;
        this.clear_number = 0;
        this.pause = false;
        this.added_score = 0;
        this.buffer = 0;
    }


    make_control_panel()
    {
        this.key_triggered_button("Move Left", ["a"], () => {
            this.move(-1, 0);
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Move Right", ["d"], () => {
            this.move(1, 0);
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Move Down", ["s"], () => {
            this.move(0, 1);
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Rotate", ["i"], () => {
            this.rotate();
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Move Left", ["j"], () => {
            this.move(-1, 0);
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Move Right", ["l"], () => {
            this.move(1, 0);
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Move Down", ["k"], () => {
            this.move(0, 1);
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Rotate", ["w"], () => {
            this.rotate();
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Fall Down", ["c"], () => {
            this.fall = !this.fall;
            this.sounds.move.currentTime = 0;
            this.sounds.move.play();
        });
        this.key_triggered_button("Restart", ["r"], () => {
            this.reset();
        });
    }

    display(context, program_state)
    {
        // display():  Called once per frame of animation. Here, the base class's display only does
        // some initial setup.

        // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
        if (!context.scratchpad.controls) {
            //this.children.push(context.scratchpad.controls = new defs.Movement_Controls());
            // Define the global camera and projection matrices, which are stored in program_state.
            program_state.set_camera(Mat4.translation(-12, 24, -70));
            program_state.lights = [new Light(vec4(10, -10, 100, 1), hex_color("#FFFFFF"), 100)];
        }
        //program_state.set_camera(Mat4.translation(1, 1, -8));
        program_state.projection_transform = Mat4.perspective(
            Math.PI / 4, context.width / context.height, 1, 1000);

        const t = program_state.animation_time / 1000, dt = program_state.animation_delta_time / 1000;

        this.UI(context, program_state);

        this.sounds.bgm.play();

        // timer by using buffer
        if (this.added_score != 0){
            this.buffer++;
            if (this.buffer >= 350){
                this.added_score = 0;
                this.buffer = 0;
            }
        }

        this.scoregain_text(context, program_state);

        // Draw grid
        const scale = 2.0;
        for (let i = 0; i < this.height; i++) {
            for (let j = 0; j < this.width; j++) {
                let model_transform = Mat4.identity();
                if (this.grid[i][j] == -1 && i >= 4) {
                    model_transform = model_transform
                        .times(Mat4.translation(scale * j, -scale * i, 2.5))
                        .times(Mat4.scale(1, 1, 1.5));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.border);
                    continue;
                }
                if (i >= 4) {
                    this.shapes.cube.draw(context, program_state, model_transform.times(Mat4.translation(scale * j, -scale * i, 0)), this.materials.grid);
                }

                // Shape 1
                if (this.grid[i][j] == 1) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece1);
                }

                // Shape 2
                else if (this.grid[i][j] == 2) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece2);
                }

                // Shape 3
                else if (this.grid[i][j] == 3) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece3);
                }

                // Shape 4
                else if (this.grid[i][j] == 4) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece4);
                }

                // Shape 5
                else if (this.grid[i][j] == 5) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece5);
                }

                // Shape 6
                else if (this.grid[i][j] == 6) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece6);
                }

                // Shape 7
                else if (this.grid[i][j] == 7) {
                    model_transform = model_transform.times(Mat4.translation(scale * j, -scale * i, scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece7);
                }
            }
        }


        // Check if Game is Over
        for (let i = 0; i < 4; i++) {
            for (let j = 1; j < this.width - 1; j++) {
                if (this.grid[i][j] != 0) {
                    this.pause = true;
                }
            }
        }

        if (this.pause) {
            this.gameover(context, program_state);
            return;
        }

        // Draw user-controlled piece
        for (let i = 0; i < this.curr_piece.length; i++) {
            for (let j = 0; j < this.curr_piece[i].length; j++) {
                // Shape 1
                if (this.curr_piece[i][j] == 1) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece1); // blue color for shape 1
                }

                // Shape 2
                else if (this.curr_piece[i][j] == 2) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece2); // red color for shape 2
                }

                // Shape 3
                else if (this.curr_piece[i][j] == 3) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece3); // yellow color for shape 3
                }

                // Shape 4
                else if (this.curr_piece[i][j] == 4) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece4); // green color for shape 4
                }

                // Shape 5
                else if (this.curr_piece[i][j] == 5) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece5); // purple color for shape 5
                }

                // Shape 6
                else if (this.curr_piece[i][j] == 6) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece6); // cyan color for shape 6
                }

                // Shape 7
                else if (this.curr_piece[i][j] == 7) {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.curr_y), scale));
                    this.shapes.cube.draw(context, program_state, model_transform, this.materials.piece7); // orange color for shape 7
                }
            }
        }

        // Draw Ghost
        let temp = this.curr_y
        for(let i=0; i<this.height;i++)
        {
            this.move(0,1,1);
        }
        this.curr_y = temp;

        for (let i = 0; i < this.curr_piece.length; i++) {
            for (let j = 0; j < this.curr_piece[i].length; j++) {
                let H = this.ghost_y + i;
                let W = this.curr_x+j;
                if(this.curr_piece[i][j]!=0)
                {
                    let model_transform = Mat4.identity();
                    model_transform = model_transform
                        .times(Mat4.translation(scale * (j + this.curr_x), -scale * (i + this.ghost_y), scale));
                    this.shapes.outline.draw(context, program_state, model_transform, this.white, "LINES");
                }
            }}

        if(this.fall)
        {
            this.curr_y = this.ghost_y;
            this.move(0,1);
            this.fall = !this.fall;
        }

        // User controlled piece falls at 1 unit per second
        if (this.frame < Math.floor(t)) {
            this.frame = Math.floor(t);
            this.move(0, 1);
        }
    }
}
