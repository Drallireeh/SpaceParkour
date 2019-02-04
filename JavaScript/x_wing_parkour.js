x_wing_parkour = {
    configuration: {},

    start: function (config) {
        // debug mode
        if (config.debug_mode == false) {
            console.log = function () { };
        }

        this.configuration = config;
        this.gfx_engine.init(config.gfx_engine);
        
        this.update();

        console.log("x Wing Parkour is started !");
    },
    update: function() {
        requestAnimFrame(x_wing_parkour.update);

        x_wing_parkour.gfx_engine.update();
    }
};