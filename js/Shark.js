export default class Shark {
<<<<<<< HEAD

=======
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
    async build(scene, canvas, posDepart, scaling) {
        // Le jeu, la scene et le canvas
        this.scene = scene;
        this.canvas = canvas;
        this.scaling = scaling;

        // Information sur la position et la rotation du shark
        this.infoShark = posDepart;

        // Axe de mouvement X et Z
        this.axisMovement=[false, false, false, false, false];
<<<<<<< HEAD
        this.#addListenerMovement();
=======
        //this.#addListenerMovement();
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b

        // Vitesse de déplacement du sharky
        this.speed = 0.6;

<<<<<<< HEAD


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

         
=======
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
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
    }   

    // Crée le Requin
    async #createShark(scene){
<<<<<<< HEAD

=======
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
        const patronShark = BABYLON.MeshBuilder.CreateBox("patronPlayer", { width: 5, depth: 5, height: 3.5 }, scene);
        patronShark.isVisible = false;
        patronShark.checkCollisions = true;
        patronShark.position = new BABYLON.Vector3(this.infoSharkX, this.infoSharkY, this.infoSharkZ);
        patronShark.ellipsoid = new BABYLON.Vector3(1, 1.5, 1);
        patronShark.ellipsoidOffset = new BABYLON.Vector3(0, 1.5, 0);
        patronShark.bakeTransformIntoVertices(BABYLON.Matrix.Translation(0, 1.5, 0));

        // Déclaration de la musique du requin qui grogne
<<<<<<< HEAD
        this.music1 = new BABYLON.Sound("sharkyGrr", "sound/bulle_de_sharky.mp3", scene);
        this.music2 = new BABYLON.Sound("tadantadan", "sound/dent_mer.mp3", scene);
=======
        this.music1 = new BABYLON.Sound("sharkyGrr", "sound/cannonBlast.mp3", scene);
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b

        // Importation du requin
        const result = await BABYLON.SceneLoader.ImportMeshAsync("", "models/Shark/", "scene.glb", scene, function (newMeshes, particuleSystems, skeletons, animationGroups){           
        });

        var shark = result.meshes[0];
        
<<<<<<< HEAD
        shark.position = new BABYLON.Vector3(0, -7, 0);
        shark.scaling = new BABYLON.Vector3(2,2,2);
=======
        shark.position = new BABYLON.Vector3(-150, -4, -150);
        shark.scaling = new BABYLON.Vector3(2,2,2);
        //Gestion du deplacement du requin
        shark.speed = 3;
        shark.frontVector = new BABYLON.Vector3(0, 0, 1);
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b


        // On définit le patron comme parent au requin
        shark.parent = patronShark;
<<<<<<< HEAD
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
         
        

=======
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
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
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
<<<<<<< HEAD
        

        var animating = true;


=======

        var animating = true;

>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
        scene.onBeforeRenderObservable.add(() => {
            var keydown = false;
            if (inputMap["a"]){
                keydown = true;
            }
            if (inputMap["c"]){
                keydown = true;
<<<<<<< HEAD
            }
            
=======
            } 
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b

            if (keydown) {
                if (!animating) {
                    animating = true;
                    if (inputMap["a"]){
                        grr.start(false, 0.9, grr.from, grr.to, false);
<<<<<<< HEAD
                        this.music1.play(); 
                        particleSystem.start();
                        
                    }
                    else if (inputMap["c"]){
                        cercle.start(false, 4.0, cercle.from, cercle.to, true);
                        this.music2.play();

=======
                        this.music1.play();
                        //particleSystem.start();                     
                    }
                    else if (inputMap["c"]){
                        cercle.start(false, 4.0, cercle.from, cercle.to, true);
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
                    }
                }
            }
            else {
                if (animating){
<<<<<<< HEAD
                    //bubble.stop();
=======
                    //particleSystem.stop();
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
                    //grr.stop();
                    //cercle.stop();
                    animating = false;
                }
            }
        })
    }

<<<<<<< HEAD
    

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
=======
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
>>>>>>> 36d4bd2935887e60500a49cbd6ba74cfac11e49b
            }
        }, false);
    }
}