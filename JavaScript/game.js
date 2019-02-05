x_wing_parkour.game = {
    field: {
        width: 500,
        height: 2500
    },
    is_moving: false,
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
                        object.rotateY(THREE.Math.degToRad(-90));
                        x_wing_parkour.game.player = object;
                        x_wing_parkour.gfx_engine.scene.add(object);
                    });
            });

        this.addBackground();

        // Rectangle de jeu
        const plane_mesh = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth, innerHeight - 200), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        plane_mesh.position.set(0, 0, -50);
        gfx.scene.add(plane_mesh);

        document.addEventListener('keydown', this.onKeyDown, false);
        document.addEventListener('keyup', this.onKeyUp, false);
    },
    update: function () {
        if (this.player != null) {
            if (this.is_moving && this.player.position.y + 50 < (innerHeight/2) - 100) x_wing_parkour.game.player.translateY(5);
            else if ((this.player.position.y - 50) > (-innerHeight / 2) + 100) x_wing_parkour.game.player.translateY(-5);
        }
    },
    addBackground: function () {
        new THREE.ImageLoader().load('Assets/Textures/Stars_in_the_sky.jpg', function (image) {
            let texture = new THREE.CanvasTexture(image);
            let material = new THREE.MeshBasicMaterial({ color: 0xffffff, map: texture });
            let geometry = new THREE.PlaneGeometry(innerWidth, innerHeight);
            let plate = new THREE.Mesh(geometry, material);
            plate.translateZ(-500);
            x_wing_parkour.gfx_engine.scene.add(plate);
        });
    },
    onKeyDown: function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 90: // z
                x_wing_parkour.game.is_moving = true;
            break;
        }
    },
    onKeyUp: function (event) {
        switch (event.keyCode) {
            case 38: // up
            case 90: // w
                x_wing_parkour.game.is_moving = false;
                break;
        }
    }
};