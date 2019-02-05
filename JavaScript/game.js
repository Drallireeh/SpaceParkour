x_wing_parkour.game = {
    field: {
        width: 500,
        height: 2500
    },
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
                        object.rotateY(THREE.Math.degToRad(-90));
                        object.rotateZ(THREE.Math.degToRad(-90));
                        x_wing_parkour.gfx_engine.scene.add(object);
                    });
            });

        this.addBackground();

        // Rectangle de jeu
        const plane_mesh = new THREE.Mesh(new THREE.PlaneGeometry(innerWidth, innerHeight - 200), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        plane_mesh.position.set(0, 0, -50);
        gfx.scene.add(plane_mesh);

    },
    update: function () {
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
};