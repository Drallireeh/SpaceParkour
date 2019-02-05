x_wing_parkour = {
    configuration: {},

    start: function (config) {
        // --- Debug Mode
        if (config.debug_mode == false) {
            console.log = function () { };
        }

        this.configuration = config;
        this.gfx_engine.init(config.gfx_engine);
        this.game.init(config.game);

        this.update();

        console.log("x Wing Parkour is started !");
    },
    update: function () {
        requestAnimFrame(x_wing_parkour.update);

        if (x_wing_parkour.configuration.debug_mode) x_wing_parkour.gfx_engine.stats.begin();

        x_wing_parkour.gfx_engine.update();
        x_wing_parkour.game.update();

        if (x_wing_parkour.configuration.debug_mode) x_wing_parkour.gfx_engine.stats.end();
    }
};