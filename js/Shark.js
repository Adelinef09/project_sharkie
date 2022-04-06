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
        //this.#addListenerMovement();

        // Vitesse de déplacement du sharky
        this.speed = 0.6;

        // On crée le requin avec la caméra qui le suit
        let shark = await this.#createShark(scene);
        this.camera = this.#createCamera(scene, shark);
        
    }

    checkActionShark(deltaTime, inputStates){
        //Déplace le requin
        this.#moveShark(deltaTime, inputStates);

        // Mis à jour de la position du requin pour l'envoyer au server
        //this.#updatePosShark();

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
        this.music1 = new BABYLON.Sound("sharkyGrr", "sound/cannonBlast.mp3", scene);

        // Importation du requin
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", "models/Shark/", "scene.glb", scene, function (newMeshes, particuleSystems, skeletons, animationGroups){           
        });

        var shark = result.meshes[0];
        
        shark.position = new BABYLON.Vector3(-150, -4, -150);
        shark.scaling = new BABYLON.Vector3(2,2,2);
        //Gestion du deplacement du requin
        shark.speed = 3;
        shark.frontVector = new BABYLON.Vector3(0, 0, 1);


        // On définit le patron comme parent au requin
        shark.parent = patronShark;
        this.shark = patronShark;

        return shark;
    }

    // Crée une caméra qui suit la target
    #createCamera(scene, target) {
        let camera = new BABYLON.FollowCamera("this.sharkFollowCamera", target.position, scene, target);

        camera.radius = 120; // how far from the object to follow
        camera.heightOffset = 50; // how high above the object to place the camera
        camera.rotationOffset = 220; // the viewing angle
        camera.cameraAcceleration = .1; // how fast to move
        camera.maxCameraSpeed = 5; // speed limit

        return camera;
    }

    #sharkBite(scene){     
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
                        //particleSystem.start();                     
                    }
                    else if (inputMap["c"]){
                        cercle.start(false, 4.0, cercle.from, cercle.to, true);
                    }
                }
            }
            else {
                if (animating){
                    //particleSystem.stop();
                    //grr.stop();
                    //cercle.stop();
                    animating = false;
                }
            }
        })
    }

    // Permer de déplacer le requin 
    #moveShark(deltaTime, inputStates){    
        if(inputStates.up) {
            this.shark.frontVector = new BABYLON.Vector3(0, 0, 1*this.shark.speed);
        }    
        if(inputStates.down) {
            this.shark.frontVector = new BABYLON.Vector3(0, 0, -1*this.shark.speed);
        }  
        if(inputStates.left) {
            this.shark.rotation.y -= 0.02;
            this.shark.frontVector = new BABYLON.Vector3(Math.sin(this.shark.rotation.y), 0, Math.cos(this.shark.rotation.y));
        }    
        if(inputStates.right) {
            this.shark.rotation.y += 0.02;
            this.shark.frontVector = new BABYLON.Vector3(Math.sin(this.shark.rotation.y), 0, Math.cos(this.shark.rotation.y));
        }
    }

    // Fonction pour modifier les paramètres
    #modifySettings(scene, canvas) {
        scene.onPointerDown = () => {
            if(!scene.alreadyLocked) {
                console.log("requesting pointer lock");
                canvas.requestPointerLock();
            } else {
                console.log("Pointer already locked");
            }
        }
    
        document.addEventListener("pointerlockchange", () => {
            let element = document.pointerLockElement || null;
            if(element) {
                // lets create a custom attribute
                scene.alreadyLocked = true;
            } else {
                scene.alreadyLocked = false;
            }
        })
    
        // key listeners for the tank
        inputStates.left = false;
        inputStates.right = false;
        inputStates.up = false;
        inputStates.down = false;
        inputStates.space = false;
        
        //add the listener to the main, window object, and update the states
        window.addEventListener('keydown', (event) => {
            if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
               inputStates.left = true;
            } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
               inputStates.up = true;
            } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
               inputStates.right = true;
            } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
               inputStates.down = true;
            }  else if (event.key === " ") {
               inputStates.space = true;
            }
        }, false);
    
        //if the key will be released, change the states object 
        window.addEventListener('keyup', (event) => {
            if ((event.key === "ArrowLeft") || (event.key === "q")|| (event.key === "Q")) {
               inputStates.left = false;
            } else if ((event.key === "ArrowUp") || (event.key === "z")|| (event.key === "Z")){
               inputStates.up = false;
            } else if ((event.key === "ArrowRight") || (event.key === "d")|| (event.key === "D")){
               inputStates.right = false;
            } else if ((event.key === "ArrowDown")|| (event.key === "s")|| (event.key === "S")) {
               inputStates.down = false;
            }  else if (event.key === " ") {
               inputStates.space = false;
            }
        }, false);
    }
}