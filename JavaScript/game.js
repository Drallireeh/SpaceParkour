x_wing_parkour.game = {
    player: null,
    camera_speed: 0,
    player_stats: {
        is_moving: false,
        speed: 0,
        score: 0,
        score_div: null,
        lives: 0,
        lives_div: null,
        player_x: 0,
        player_y: 0,
        got_hit: false
    },
    type_obstacles: [],
    obstacles: {
        cube: new THREE.BoxGeometry(50, 50),
        spike: new THREE.ConeGeometry(25, 50),
        asteroid: new THREE.CircleGeometry(50, 8)
    },
    nb_obstacles: 0,
    list_obstacles: [],
    init: function (config) {
        config = config || {};
        this.nb_obstacles = config.nb_obstacles || 25;
        this.type_obstacles = config.type_obstacles || ["cube", "asteroid", "spike"];
        this.camera_speed = config.camera_speed || 2;
        this.player_stats.speed = config.player.speed || 5;
        this.player_stats.lives = config.player.lives || 3;

        const gfx = x_wing_parkour.gfx_engine;

        const loader = new THREE.FBXLoader();

        loader.load('Assets/Obj/x_wing.fbx', function (object) {
            object.scale.set(0.01, 0.01, 0.01);
            object.translateX((-innerWidth / 2) + 50);
            object.translateY((-innerHeight / 2) + 150);
            object.translateZ(-30);
            object.rotateY(THREE.Math.degToRad(-90));

            x_wing_parkour.game.player = object;
            x_wing_parkour.game.player_stats.player_x = object.position.x;
            x_wing_parkour.game.player_stats.player_y = object.position.y;
            x_wing_parkour.gfx_engine.scene.add(object);
        })

        this.addScenery();

        const game_field = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth, innerHeight - 200), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        game_field.position.set(0, 0, -200);
        gfx.camera.add(game_field);

        this.player_stats.score_div = document.getElementById('score');
        this.player_stats.lives_div = document.getElementById('lives');

        this.player_stats.lives_div.innerText = 'Lives : ' + this.player_stats.lives;
        this.player_stats.score_div.innerText = 'Player score : ' + this.player_stats.score;

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    },
    update: function () {
        if (this.player != null) {
            // Game Movement
            const camera = x_wing_parkour.gfx_engine.camera;
            camera.translateX(this.camera_speed);
            this.player.translateZ(-this.camera_speed);

            this.player_stats.player_x = this.player.position.x;
            this.player_stats.player_y = this.player.position.y;

            // Move
            if (this.player_stats.is_moving) {
                if (this.player.position.y + 50 < (innerHeight / 2) - 100) {
                    x_wing_parkour.game.player.translateY(this.player_stats.speed);
                }
            } else {
                if ((this.player.position.y - 50) > (-innerHeight / 2) + 100) {
                    x_wing_parkour.game.player.translateY(-this.player_stats.speed);
                }
            }

            // Collisions & Score update
            if (this.list_obstacles.length > 0) {
                for (let i = 0; i < this.nb_obstacles; i++) {
                    if ((this.player_stats.player_x - 40 >= this.list_obstacles[i].position.x - 25 && this.player_stats.player_x - 40 <= this.list_obstacles[i].position.x + 25 &&
                        this.player_stats.player_y - 25 >= this.list_obstacles[i].position.y - 25 && this.player_stats.player_y - 25 <= this.list_obstacles[i].position.y + 25) ||
                        (this.player_stats.player_x + 65 >= this.list_obstacles[i].position.x - 25 && this.player_stats.player_x + 65 <= this.list_obstacles[i].position.x + 25 &&
                            this.player_stats.player_y + 25 >= this.list_obstacles[i].position.y - 25 && this.player_stats.player_y + 25 <= this.list_obstacles[i].position.y + 25)) {

                        if (this.list_obstacles[i].is_collide == false && this.player_stats.got_hit == false) {
                            this.list_obstacles[i].is_collide = true;
                            this.collide();
                        }
                    }

                    if (this.list_obstacles[i].position.x + 25 < this.player_stats.player_x - 100) {
                        if (this.list_obstacles[i].is_collide == false) {
                            this.player_stats.score += 10;
                        }
                        this.player_stats.score_div.innerText = 'Player score : ' + this.player_stats.score;
                        this.list_obstacles[i].position.x += 1500;
                        this.list_obstacles[i].position.y = Math.floor(Math.random() * ((innerHeight / 2 - 150) - (-innerHeight / 2 + 150 + 1))) + (-innerHeight / 2 + 150);
                        this.list_obstacles[i].is_collide = false;
                    }
                }
            }
        }
    },
    addBackground: function () {
        let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: x_wing_parkour.loader.getTexture("background") });
        let geometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
        let plate = new THREE.Mesh(geometry, material);
        plate.translateZ(-300);
        x_wing_parkour.gfx_engine.camera.add(plate);
    },
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 90: // z
                x_wing_parkour.game.player_stats.is_moving = true;
                break;
        }
    },
    onKeyUp: function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 90: // w
                x_wing_parkour.game.player_stats.is_moving = false;
                break;
            case 27:
                if (!x_wing_parkour.game_over) {
                    x_wing_parkour.setPause();
                }
                break;
        }
    },
    addObstacle: function (geometry) {
        let mesh = null;
        switch (geometry) {
            case 'cube':
                mesh = new THREE.Mesh(this.obstacles.cube, new THREE.MeshBasicMaterial({ color: 0xffffff, map: x_wing_parkour.loader.getTexture("box") }));
                break;
            case 'spike':
                mesh = new THREE.Mesh(this.obstacles.spike, new THREE.MeshBasicMaterial({ color: 0xffffff, map: x_wing_parkour.loader.getTexture("spike") }));
                break;
            case 'asteroid':
                mesh = new THREE.Mesh(this.obstacles.asteroid, new THREE.MeshBasicMaterial({ color: 0xffffff, map: x_wing_parkour.loader.getTexture("asteroid") }));
                break;
            default:
                console.log("Wrong type of obstacle");
        }
        if (mesh != null) {
            mesh.is_collide = false;
            mesh.position.set(Math.floor(Math.random() * (1500 - (-innerWidth / 2 + 300) + 1)) + (-innerWidth / 2 + 300),
                Math.floor(Math.random() * ((innerHeight / 2 - 150) - (-innerHeight / 2 + 150 + 1))) + (-innerHeight / 2 + 150),
                -60);
            x_wing_parkour.gfx_engine.scene.add(mesh);
            this.list_obstacles.push(mesh);
        }
    },
    addScenery: function () {
        this.addBackground();

        for (let i = 0; i < this.nb_obstacles; i++) {
            this.addObstacle(this.type_obstacles[Math.floor(Math.random() * 3)]);
        }
    },
    collide: function () {
        this.player_stats.lives -= 1;

        if (this.player_stats.got_hit == false) {
            this.player.children[1].material.emissive.setHex(0xff0000);
            x_wing_parkour.game.player_stats.got_hit = true;
            setTimeout(function () {
                x_wing_parkour.game.player.children[1].material.emissive.setHex(0);
                x_wing_parkour.game.player_stats.got_hit = false;
            }, 1200);
        }
        x_wing_parkour.setGameOver();

        this.player_stats.lives_div.innerText = 'Lives : ' + this.player_stats.lives;
    }
};