x_wing_parkour = {
    configuration: {},
    pause: true,
    game_over: false,
    start: function (config) {
        // --- Debug Mode
        if (config.debug_mode == false) {
            console.log = function () { };
        }

        this.configuration = config;
        this.game_over_score = document.getElementById('game_over_score');
        this.blocker = document.getElementById('blocker');
        this.instructions = document.getElementById('instructions');

        this.loader.init(this.configuration.textures);
        this.gfx_engine.init(this.configuration.gfx);

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
    setGameOver: function () {
        if (x_wing_parkour.game.player_stats.lives <= 0)
        {
            this.game_over_score.innerText = 'Player score : ' + x_wing_parkour.game.player_stats.score;
            this.game_over = true;
            this.pause = true;
            this.blocker.style.display = 'block';
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