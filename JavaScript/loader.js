x_wing_parkour.loader = {
    textures: [],
    increment: 0,
    init: function (tex_list) {
        this.textures = tex_list;
        this.loadTextures();
    },
    loadTextures: function () {
        new THREE.ImageLoader().load(this.textures[this.increment].path, this.onTextureLoaded);
    },
    onTextureLoaded: function (image) {
        const loader = x_wing_parkour.loader;
        let texture = new THREE.CanvasTexture(image);
        loader.textures[loader.increment].texture = texture;
        loader.increment ++;
        if (loader.increment < loader.textures.length) {
            loader.loadTextures();
        }
        else {
            x_wing_parkour.game.init(x_wing_parkour.configuration.game);
        }
    },
    getTexture: function (name) {
        for (let i = 0; i < this.textures.length; i++) {
            if (this.textures[i].name == name) {
                return this.textures[i].texture;
            }
        }
        return null;
    }
}