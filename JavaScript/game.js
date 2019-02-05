x_wing_parkour.game = {
    field: {
        width: 500,
        height: 2500
    },
    init: function (config) {
        config = config || {};

        const gfx = x_wing_parkour.gfx_engine;
        
        this.addBackground();

        // Rectangle de jeu
        const plane_mesh = new THREE.Mesh(new THREE.PlaneGeometry(this.field.width, this.field.height), new THREE.MeshBasicMaterial({ color: 0x808080 }));
        plane_mesh.position.set(0, 0, 0);
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
            plate.translateZ(-20);
            x_wing_parkour.gfx_engine.scene.add(plate);
        });
    },
};