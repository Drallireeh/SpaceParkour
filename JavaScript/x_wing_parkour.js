x_wing_parkour = {
    configuration: {},

    start: function (config) {
        // --- Debug Mode
        if (config.debug_mode == false) {
            console.log = function () { };
        }

        this.configuration = config;

        instructions.addEventListener('click', function () {
            x_wing_parkour.onClick();
        }, false);
    },
    startGame: function () {
        this.loader.init(this.configuration.textures);
        this.gfx_engine.init(this.configuration.gfx_engine);

        this.update();

        console.log("x Wing Parkour is started !");
    },
    onClick: function () {
        instructions.style.display = 'none';
        blocker.style.display = 'none';
        x_wing_parkour.startGame();
    },
    update: function () {
        requestAnimFrame(x_wing_parkour.update);

        if (x_wing_parkour.configuration.debug_mode) x_wing_parkour.gfx_engine.stats.begin();

        x_wing_parkour.gfx_engine.update();
        x_wing_parkour.game.update();

        if (x_wing_parkour.configuration.debug_mode) x_wing_parkour.gfx_engine.stats.end();
    }
};