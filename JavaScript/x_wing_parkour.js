x_wing_parkour = {
    configuration: {},
    pause: true,
    start: function (config) {
        // --- Debug Mode
        if (config.debug_mode == false) {
            console.log = function () { };
        }

        this.configuration = config;
        this.blocker = document.getElementById('blocker');
        this.instructions = document.getElementById('instructions');

        this.loader.init(this.configuration.textures);
        this.gfx_engine.init(this.configuration.gfx_engine);

        this.update();
        
        console.log("x Wing Parkour is started !");
    },
    setPause: function() {  
        if (this.pause) {
            this.pause = false;
            
            this.instructions.style.display = 'none';
            this.blocker.style.display = 'none';
        }
        else {
            this.pause = true;
            
            this.blocker.style.display = 'block';
            this.instructions.style.display = '';
        }
    },
    update: function () {
        requestAnimFrame(x_wing_parkour.update);

        if (x_wing_parkour.configuration.debug_mode) x_wing_parkour.gfx_engine.stats.begin();
        
        if (x_wing_parkour.pause == false) {

            x_wing_parkour.gfx_engine.update();
            x_wing_parkour.game.update();
        }
        
        if (x_wing_parkour.configuration.debug_mode) x_wing_parkour.gfx_engine.stats.end();
    }
};