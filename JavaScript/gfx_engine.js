x_wing_parkour.gfx_engine = {
    init: function (config) {
        // --- Scene
        this.scene = new THREE.Scene();

        config = config || {};
        const fov = config.camera_fov || 75;

        // --- Camera
        this.camera = new THREE.OrthographicCamera(innerWidth / -2, innerWidth / 2, innerHeight / 2, innerHeight / -2, 1, 5000);
        this.camera.position.set(0, 0, 30);
        this.scene.add(this.camera);

        const light = new THREE.PointLight(0xffffff);
        light.position.set(0, 0, 50);
        this.scene.add(light);

        const high_performance = x_wing_parkour.configuration.high_performance || true;

        // --- Renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: high_performance });
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(innerWidth, innerHeight);
        if (x_wing_parkour.configuration.high_performance) {
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        }
        document.body.appendChild(this.renderer.domElement);

        if (x_wing_parkour.configuration.debug_mode && Stats) {
            this.stats = new Stats();
            this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
            document.body.appendChild(this.stats.dom);
            console.log("gfx_engine debug mode activated.");
        }

        window.requestAnimFrame = (function () {
            return window.requestAnimationFrame ||
                window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                function (callback) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })(),

            console.log("gfx engine is ready");
    },
    update: function () {

        this.renderer.render(this.scene, this.camera);
    }
};