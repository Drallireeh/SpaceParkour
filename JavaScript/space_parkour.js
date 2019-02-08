space_parkour = {
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

        this.loader_tool.init(this.configuration.loader_tool);
        this.gfx_engine.init(this.configuration.gfx);

        this.update();

        console.log("x Wing Parkour is started !");
    },
    setPause: function () {
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
        if (space_parkour.game.player_stats.lives <= 0) {
            this.game_over_score.innerText = 'Player score : ' + space_parkour.game.player_stats.score;
            this.game_over = true;
            this.pause = true;
            this.blocker.style.display = 'block';
        }
    },
    update: function () {
        requestAnimFrame(space_parkour.update);

        if (space_parkour.configuration.debug_mode) space_parkour.gfx_engine.stats.begin();

        if (space_parkour.pause == false) {
            space_parkour.gfx_engine.update();
            space_parkour.game.update();
        }

        if (space_parkour.configuration.debug_mode) space_parkour.gfx_engine.stats.end();
    }
};