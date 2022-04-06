export default class Fish {
    async build(id, scene, canvas, positions){
        // Gestion de l'id, de la scene et du canvas
        this.id = id;
        this.scene = scene;
        this.canvas = canvas;

        // Position des poissons
        this.positions = positions;

        // Création des poissons
        await this.#createFish(scene);
    }

    async #createFish(scene){
        // Création du patron des poissons
        const patronFish = BABYLON.MeshBuilder.CreateBox("patronPoissons", { width: 5, depth: 5, height: 3.5 }, scene);
        patronFish.isVisible = true;
        patronFish.checkCollisions = true;
        patronFish.positions = new BABYLON.Vector3(this.positions[0], -8, this.positions[1]);

        // Importation des poissons
        const result = await BABYLON.SceneLoader.ImportMeshAsync(null, "models/Fish/", "fish.glb", scene);  
        var poissons = result.meshes[0];
        poissons.position = new BABYLON.Vector3(this.positions[0], -8, this.positions[1]);     
        poissons.scaling = new BABYLON.Vector3(0.7,0.7,0.7);   
    }

    // Suppression du band de poissons
    delete() {
        this.Fish.dispose();
    }
}


