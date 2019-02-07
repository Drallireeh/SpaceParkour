x_wing_parkour.game = {
    field: {
        width: 500,
        height: 2500
    },
    player: null,
    player_stats: {
        is_moving: false,
        speed: 2,
        score: 0,
        score_div: null,
        lives: 3,
        player_x: 0,
        player_y: 0
    },
    type_obstacles: [],
    obstacles: {
        cube: new THREE.BoxGeometry(50, 50, 50),
        spike: new THREE.ConeGeometry(25, 50),
        asteroid: new THREE.CircleGeometry(50, 8)
    },
    nb_obstacles: 30,
    list_obstacles: [],
    init: function (config) {
        config = config || {};
        this.nb_obstacles = config.nb_obstacles || 25;
        this.type_obstacles = config.type_obstacles || ["cube", "asteroid", "spike"];

        const gfx = x_wing_parkour.gfx_engine;

        new THREE.MTLLoader()
            .setPath('Assets/Obj/')
            .load('xwing.mtl', function (materials) {
                materials.preload();
                new THREE.OBJLoader()
                    .setMaterials(materials)
                    .setPath('Assets/Obj/')
                    .load('xwing.obj', function (object) {
                        object.scale.set(0.01, 0.01, 0.01);
                        object.translateX((-innerWidth / 2) + 50);
                        object.translateY((-innerHeight / 2) + 150);
                        object.translateZ(-30);
                        object.rotateY(THREE.Math.degToRad(-90));

                        x_wing_parkour.game.player = object;
                        x_wing_parkour.game.player_stats.player_x = object.position.x;
                        x_wing_parkour.game.player_stats.player_y = object.position.y;
                        x_wing_parkour.gfx_engine.scene.add(object);
                    });
            });

        this.addBackground();
        this.addScenery();

        // Rectangle de jeu
        const plane_mesh = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth, innerHeight - 200), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        plane_mesh.position.set(0, 0, -200);
        gfx.camera.add(plane_mesh);

        this.player_stats.score_div = document.getElementById('score');
        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    },
    update: function () {
        if (this.player != null) {
            // Game Movement
            const camera = x_wing_parkour.gfx_engine.camera;
            camera.translateX(this.player_stats.speed);
            this.player.translateZ(-this.player_stats.speed);
            
            this.player_stats.player_x = this.player.position.x;
            this.player_stats.player_y = this.player.position.y;

            // Move
            if (this.player_stats.is_moving) {
                if (this.player.position.y + 50 < (innerHeight / 2) - 100) {
                    x_wing_parkour.game.player.translateY(5);
                }
            }
            else {
                if ((this.player.position.y - 50) > (-innerHeight / 2) + 100) {
                    x_wing_parkour.game.player.translateY(-5);
                }
            }

            // Collisions & Score update
            if (this.list_obstacles.length > 0) {
                for (let i = 0; i < this.list_obstacles.length; i++) { // A changer avec un numéro fixe, pour eviter de calculer la length à chaque fois
                    if ((this.player_stats.player_x - 50 >= this.list_obstacles[i].position.x - 25 && this.player_stats.player_x - 50 <= this.list_obstacles[i].position.x + 25 &&
                        this.player_stats.player_y - 25 >= this.list_obstacles[i].position.y - 25 && this.player_stats.player_y - 25 <= this.list_obstacles[i].position.y + 25) ||
                        (this.player_stats.player_x + 75 >= this.list_obstacles[i].position.x - 25 && this.player_stats.player_x + 75 <= this.list_obstacles[i].position.x + 25 &&
                            this.player_stats.player_y + 25 >= this.list_obstacles[i].position.y - 25 && this.player_stats.player_y + 25 <= this.list_obstacles[i].position.y + 25)) {
                        // Stop the game
                    }

                    if (this.list_obstacles[i].position.x + 25 < this.player_stats.player_x - 50) {
                        this.player_stats.score += 10;
                        this.list_obstacles[i].position.x += 2000;
                    }
                }
            }

            this.player_stats.score_div.innerText = 'Player score : ' + this.player_stats.score;
        }
    },
    addBackground: function () {
        let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: x_wing_parkour.loader.getTexture("background") });
        let geometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
        let plate = new THREE.Mesh(geometry, material);
        plate.translateZ(-600);
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
            mesh.position.set(Math.floor(Math.random() * (1500 - (-innerWidth/2 + 300) + 1) ) + (-innerWidth/2 + 300),
                Math.floor(Math.random() * ((innerHeight / 2 - 150) - (-innerHeight / 2 + 150 + 1))) + (-innerHeight / 2 + 150),
                -60);
            x_wing_parkour.gfx_engine.scene.add(mesh);
            this.list_obstacles.push(mesh);
        }
    },
    addScenery: function() {
        for (let i = 0; i < this.nb_obstacles; i++) {
            this.addObstacle(this.type_obstacles[Math.floor(Math.random() * 3)]);
        }
    }
};