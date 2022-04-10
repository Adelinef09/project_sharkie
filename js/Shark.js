export default class Shark {

    async build(scene, canvas, posDepart, scaling) {
        // Le jeu, la scene et le canvas
        this.scene = scene;
        this.canvas = canvas;
        this.scaling = scaling;

        // Information sur la position et la rotation du shark
        this.infoShark = posDepart;

        // Axe de mouvement X et Z
        this.axisMovement=[false, false, false, false, false];
        this.#addListenerMovement();

        // Vitesse de déplacement du sharky
        this.speed = 0.6;



        // in case, attach the instance to the mesh itself, in case we need to retrieve
        // it after a scene.getMeshByName that would return the Mesh
        // SEE IN RENDER LOOP !
        //sharkMesh.Fish = this;

        // scaling
        //this.sharkMesh.scaling = new BABYLON.Vector3(scaling, scaling, scaling);

        // FOR COLLISIONS, let's associate a BoundingBox to the Dude

        // singleton, static property, computed only for the first dude we constructed
        // for others, we will reuse this property.

        // On crée le requin avec la caméra qui le suit
        await this.#createShark(scene);
        this.camera = this.#createCamera(scene);
        
    }

    checkActionShark(deltaTime){
        //Déplace le requin
        this.#moveShark(deltaTime);

        // Mis à jour de la position du requin pour l'envoyer au server
        this.#updatePosShark();

        //Le requin mord
        this.#sharkBite(this.scene);

         
    }   

    // Crée le Requin
    async #createShark(scene){

        const patronShark = BABYLON.MeshBuilder.CreateBox("patronPlayer", { width: 5, depth: 5, height: 3.5 }, scene);
        patronShark.isVisible = false;
        patronShark.checkCollisions = true;
        patronShark.position = new BABYLON.Vector3(this.infoSharkX, this.infoSharkY, this.infoSharkZ);
        patronShark.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
        patronShark.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0);
        patronShark.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0));

        // Déclaration de la musique du requin qui grogne
        this.music1 = new BABYLON.Sound("sharkyGrr", "sound/bulle_de_sharky.mp3", scene);
        this.music2 = new BABYLON.Sound("tadantadan", "sound/dent_mer.mp3", scene);

        // Importation du requin
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", "models/Shark/", "scene.glb", scene, function (newMeshes, particuleSystems, skeletons, animationGroups){           
        });

        var shark = result.meshes[0];
        
        shark.position = new BABYLON.Vector3(0, -7, 0);
        shark.scaling = new BABYLON.Vector3(2,2,2);


        // On définit le patron comme parent au requin
        shark.parent = patronShark;
        this.shark=patronShark;


        return scene;

    }

    // Crée une caméra qui suit la target
    #createCamera(scene) {        
        let camera = new BABYLON.ArcRotateCamera("SharkRotateCamera", -Math.PI/2, 1, 250, this.shark, scene);
        camera.angularSensibilityX = 2000;
        camera.angularSensibilityY = 2000;

        camera.upperBetaLimit = Math.PI / 2.3;
        camera.lowerBetaLimit = Math.PI / 3;

        camera.upperRadiusLimit = 150;
        camera.lowerRadiusLimit = 15;
        //camera.inputs.attachInput(camera.inputs.attached.mouse);
        camera.attachControl(this.canvas, false);

        scene.activeCamera = camera;
        return camera;
    }

    


    #sharkBite(scene){ 

        //Création des particules
        var particleSystem = new BABYLON.ParticleSystem("particles", 10, scene);

        //Texture des particules
        particleSystem.particleTexture = new BABYLON.Texture("textures/bulles.jpg", scene);

        // Lieu où les particules sont émises
        particleSystem.emitter = new BABYLON.Vector3(this.shark.position.x-0.1, this.shark.position.y-2.95, this.shark.position.z-15); // the starting object, the emitter

        // Direction des particules
        particleSystem.direction1 = new BABYLON.Vector3(-1, 10, 1);

        // taille des particules
        particleSystem.minSize = 0.1;
        particleSystem.maxSize = 0.7;

        // Temps d'émission des particules
        particleSystem.targetStopDuration=3;   
         
        

        // Keyboard events
        var inputMap ={};
        scene.actionManager = new BABYLON.ActionManager(scene);
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyDownTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));
        scene.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnKeyUpTrigger, function (evt) {
            inputMap[evt.sourceEvent.key] = evt.sourceEvent.type == "keydown";
        }));

        // Déclaration des animations du requins
        const grr = scene.getAnimationGroupByName("bite");
        const cercle = scene.getAnimationGroupByName("circling");
        

        var animating = true;


        scene.onBeforeRenderObservable.add(() => {
            var keydown = false;
            if (inputMap["a"]){
                keydown = true;
            }
            if (inputMap["c"]){
                keydown = true;
            }
            

            if (keydown) {
                if (!animating) {
                    animating = true;
                    if (inputMap["a"]){
                        grr.start(false, 0.9, grr.from, grr.to, false);
                        this.music1.play(); 
                        particleSystem.start();
                        
                    }
                    else if (inputMap["c"]){
                        cercle.start(false, 4.0, cercle.from, cercle.to, true);
                        this.music2.play();

                    }
                }
            }
            else {
                if (animating){
                    //bubble.stop();
                    //grr.stop();
                    //cercle.stop();
                    animating = false;
                }
            }
        })
    }

    

    // Permer de déplacer le requin 
    #moveShark(deltaTime){
        let fps = 1000/ deltaTime;
        let relativeSpeed = this.speed /(fps/60);
        let rotationSpeed = 0.05;

        if (this.axisMovement[0]) {
            let forward = new BABYLON.Vector3(
                parseFloat(Math.sin(parseFloat(this.shark.rotation.y))) * relativeSpeed, 
                0,
                parseFloat(Math.cos(parseFloat(this.shark.rotation.y))) * relativeSpeed            
            );
            this.shark.moveWithCollisions(forward);
        } 
        if (this.axisMovement[1]) {
            let backward= new BABYLON.Vector3(
                parseFloat(-Math.sin(parseFloat(this.shark.rotation.y))) * relativeSpeed,
                0,
                parseFloat(-Math.cos(parseFloat(this.shark.rotation.y))) * relativeSpeed
            );
            this.shark.moveWithCollisions(backward);
        }
        if (this.axisMovement[2]){
            this.shark.rotation.y += rotationSpeed;
        }
        if (this.axisMovement[3]){
            this.shark.rotation.y -= rotationSpeed;
        }
        //this.shark.moveWithCollisions(new BABYLON.Vector3(0, (-1.5)* relativeSpeed, 0));
    }

    

    #updatePosShark(){
        
        //Position
        this.infoSharkX = this.shark.position.x;
        this.infoSharkY = this.shark.position.y;
        this.infoSharkZ = this.shark.position.z;

        // Rotation
        this.infoSharkRX = this.shark.rotation.x;
        this.infoSharkRY = this.shark.rotation.y;
        this.infoSharkRZ = this.shark.rotation.z;

    }



    #addListenerMovement() {
        window.addEventListener('keydown', (event) => {
            if ((event.key === "z") || (event.key === "Z")) {
                this.axisMovement[0] = true;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.axisMovement[1] = true;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.axisMovement[2] = true;
            } else if ((event.key === "q") || (event.key === "Q")) {
                this.axisMovement[3] = true;
            } else if (event.key === " ") {
                this.axisMovement[4] = true;
            }
        }, false);

        window.addEventListener('keyup', (event) => {
            if ((event.key === "z") || (event.key === "Z")) {
                this.axisMovement[0] = false;
            } else if ((event.key === "s") || (event.key === "S")) {
                this.axisMovement[1] = false;
            } else if ((event.key === "d") || (event.key === "D")) {
                this.axisMovement[2] = false;
            } else if ((event.key === "q") || (event.key === "Q")) {
                this.axisMovement[3] = false;
            } else if (event.key === " ") {
                this.axisMovement[4] = false;
            }
        }, false);
    }
}