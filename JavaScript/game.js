x_wing_parkour.game = {
    field: {
        width: 500,
        height: 2500
    },
    player: null,
    player_stats: {
        is_moving: false,
        speed: 1,
        score: 0
    },
    obstacles: {
        cube: new THREE.BoxGeometry(50, 50, 50),
        pick: new THREE.ConeGeometry(25, 50),
        asteroid: new THREE.CircleGeometry(50, 32)
    },
    list_obstacles: [],
    init: function (config) {
        config = config || {};

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
                        x_wing_parkour.gfx_engine.camera.add(object);
                    });
            });

        this.addBackground();
        this.addObstacle("cube");
        this.addObstacle("pick");

        // Rectangle de jeu
        const plane_mesh = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth, innerHeight - 200), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        plane_mesh.position.set(0, 0, -200);
        gfx.camera.add(plane_mesh);

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    },
    update: function () {
        if (this.player != null) {
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
        }

        const camera = x_wing_parkour.gfx_engine.camera;
        camera.translateX(this.player_stats.speed);
        // let cam_z = camera.position.z;
    },
    addBackground: function () {
        // new THREE.ImageLoader().load('Assets/Textures/Stars_in_the_sky.jpg', function (image) {
        //     let texture = new THREE.CanvasTexture(image);
        let texture = new THREE.TextureLoader().load('Assets/Textures/Stars_in_the_sky.jpg');
            let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
            let geometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
            let plate = new THREE.Mesh(geometry, material);
            plate.translateZ(-600);
            x_wing_parkour.gfx_engine.camera.add(plate);
        // });
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
                mesh = new THREE.Mesh(this.obstacles.cube, new THREE.MeshBasicMaterial({ color: 0xffffff }));
                break;
            case 'pick':
                mesh = new THREE.Mesh(this.obstacles.pick, new THREE.MeshBasicMaterial({ color: 0xffffff }));
                break;
            case 'asteroid':
                mesh = new THREE.Mesh(this.obstacles.asteroid, new THREE.MeshBasicMaterial({ color: 0xffffff }));
                break;
            default:
                console.log("Wrong type of obstacle");
        }
        if (mesh != null) {
            mesh.position.set(Math.floor(Math.random() * ((innerWidth / 2 - 50) - (-innerWidth / 2 + 300 + 1))) + (-innerWidth / 2 + 300),
                Math.floor(Math.random() * ((innerHeight / 2 - 150) - (-innerHeight / 2 + 150 + 1))) + (-innerHeight / 2 + 150),
                -60);
            x_wing_parkour.gfx_engine.scene.add(mesh);
            this.list_obstacles.push(mesh);
        }
    },
    addCube: function () {

    },
    addPick: function () {

    }
};