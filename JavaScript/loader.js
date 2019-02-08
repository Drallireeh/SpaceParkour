x_wing_parkour.loader_tool = {
    textures: [],
    fbx: [],
    tex_increment: 0,
    fbx_increment: 0,
    init: function (config) {
        this.textures = config.tex_list;
        this.fbx = config.fbx_list;
        this.loadTextures();
    },
    loadTextures: function () {
        new THREE.ImageLoader().load(this.textures[this.tex_increment].path, this.onTextureLoaded);
    },
    onTextureLoaded: function (image) {
        const loader = x_wing_parkour.loader_tool;
        let texture = new THREE.CanvasTexture(image);
        loader.textures[loader.tex_increment].texture = texture;
        loader.tex_increment++;
        if (loader.tex_increment < loader.textures.length) {
            loader.loadTextures();
        }
        else {
            loader.loadFbx();
        }
    },
    loadFbx: function () {
        const loader = new THREE.FBXLoader();

        loader.load(this.fbx[this.fbx_increment].path, this.onFbxLoaded);
    },
    onFbxLoaded: function (object) {
        const loader = x_wing_parkour.loader_tool;
        object.scale.set(0.01, 0.01, 0.01);
        object.translateX((-innerWidth / 2) + 50);
        object.translateY((-innerHeight / 2) + 150);
        object.translateZ(-30);
        object.rotateY(THREE.Math.degToRad(-90));

        loader.fbx[loader.fbx_increment].object = object;
        loader.fbx_increment++;
        if (loader.fbx_increment < loader.fbx.length) {
            loader.loadFbx();
        }
        else {
            x_wing_parkour.game.init(x_wing_parkour.configuration.game);
        }
    },
    getFbx: function (name) {
        for (let i = 0; i < this.fbx.length; i++) {
            if (this.fbx[i].name == name) {
                return this.fbx[i].object;
            }
        }
        return null;
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