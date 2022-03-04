import Fish from "./Fish.js";

let canvas;
let engine;
let scene;
let camera;
let wsize = 800;
let inputStates = {};
let sharkie;
let limite1;
let limite2;
let fish;

window.onload = startGame;

async function startGame() {
    //Récupération du canvas
    canvas = document.querySelector("#myCanvas");
    //Création d'une instance du moteur 3D
    engine = new BABYLON.Engine(canvas, true);

    scene = await createScene();
    scene.enablePhysics();

    //Modification des paramètres par défault
    modifySettings();

    //Récupération du requin
    sharkie = scene.getMeshByName("herosharkie");

    //Récupération des poissons
    fish = scene.getMeshByName("fish");

    // main animation loop 60 times/s
    engine.runRenderLoop(() => {
        let deltaTime = engine.getDeltaTime();

        sharkie.move();
        scene.render();
    });
}

//Création de la scène
async function createScene() {
  //Initialisation de la scène
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.14, 0.44, 0.67);
  createLights(scene);
  let ground = createGround(scene);

  //Création du requin
  sharkie = createSharkie(scene);

  //Création des poissons
  await createFishs(scene);

  //Création des caméras
  let freeCamera = createFreeCamera(scene);
  let followCamera = createFollowCamera(scene, sharkie);
  //scene.activeCamera = followCamera;

  return scene;
}

//Création des lumières
function createLights(scene) {
  // Lumière principale
  var light = new BABYLON.HemisphericLight("Light", new BABYLON.Vector3(-0.7, 0.3, -0.7), scene);
  light.diffuse = new BABYLON.Color3(0.89, 0.89, 0.78);
  light.groundColor = new BABYLON.Color3(0.56, 0.56, 0.57);
  light.intensity = 0.8; 

  // Lumière secondaire
	var lightD = new BABYLON.DirectionalLight("dir01", new BABYLON.Vector3(0.7, -0.3, 0.7), scene);
	lightD.position = new BABYLON.Vector3(20, 60, 20);
  lightD.intensity = 1; 
  light.parent = lightD;
}

//Création de la map
function createGround(scene){
  let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/map/heightMap.png", 100, 100, 100, 0, 10, scene, false, (mesh) => {
    var groundMaterial = new BABYLON.StandardMaterial("ground", scene);
    groundMaterial.diffuseTexture = new BABYLON.Texture("assets/map/ground.jpg", scene);
    groundMaterial.diffuseTexture.uScale = 6;
    groundMaterial.diffuseTexture.vScale = 6;
    groundMaterial.specularColor = new BABYLON.Color3(0, 0, 0);
    ground.position.y = -5;
    ground.scaling = new BABYLON.Vector3(4,7,4);
    ground.material = groundMaterial;
    ground.receiveShadows = true;

    //ground partie 2
    var ground2 = BABYLON.Mesh.CreateGround("ground2", 100, 100, 100, scene, false);
    var ground2Material = new BABYLON.StandardMaterial("ground2", scene);
    ground2.material = ground2Material;
    ground2Material.diffuseTexture = new BABYLON.Texture("assets/map/ground.jpg", scene);
    ground2Material.diffuseTexture.uScale = 6;
    ground2Material.diffuseTexture.vScale = 6;
    ground2Material.specularColor = new BABYLON.Color3(0, 0, 0);
    ground2.scaling = new BABYLON.Vector3(10,10,10);
    ground2.position.y = -10;
    
    // Water
    var water = BABYLON.Mesh.CreateGround("waterMesh", 100, 100, 100, scene, false);
    var waterMaterial = new BABYLON.StandardMaterial("water", scene);
    water.material = waterMaterial;
    waterMaterial.diffuseTexture = new BABYLON.Texture("assets/map/waterbump.png", scene);
    waterMaterial.alpha = 0.5;
    waterMaterial.diffuseTexture.uScale = 6;
    waterMaterial.diffuseTexture.vScale = 6;
    water.position.y = 10;
    water.scaling = new BABYLON.Vector3(10,10,10);

    //Délimitation pour les collisions
    limite1 = BABYLON.MeshBuilder.CreateSphere("limite1", {diameterX:280, diameterZ:230, diameterY:50, segment: 32, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
    limite1.position.z = 50;
    limite1.rotation.y = 15;
    limite1.visibility = 0;

  });
}

//Création de la caméra de base
function createFreeCamera(scene) {
  let camera = new BABYLON.FreeCamera("freeCamera", new BABYLON.Vector3(0, 50, 0), scene);
  camera.attachControl(canvas);
  // prevent camera to cross ground
  camera.checkCollisions = true; 
  // avoid flying with the camera
  camera.applyGravity = false;

  // Add extra keys for camera movements
  // Need the ascii code of the extra key(s). We use a string method here to get the ascii code
  camera.keysUp.push('z'.charCodeAt(0));
  camera.keysDown.push('s'.charCodeAt(0));
  camera.keysLeft.push('q'.charCodeAt(0));
  camera.keysRight.push('d'.charCodeAt(0));
  camera.keysUp.push('Z'.charCodeAt(0));
  camera.keysDown.push('S'.charCodeAt(0));
  camera.keysLeft.push('Q'.charCodeAt(0));
  camera.keysRight.push('D'.charCodeAt(0));

  return camera;
}

//Création de la caméra suivant le requin
function createFollowCamera(scene, target) {
  let camera = new BABYLON.FollowCamera("sharkieFollowCamera", target.position, scene, target);

  camera.radius = 120; // how far from the object to follow
  camera.heightOffset = 50; // how high above the object to place the camera
  camera.rotationOffset = 220; // the viewing angle
  camera.cameraAcceleration = .1; // how fast to move
  camera.maxCameraSpeed = 5; // speed limit

  return camera;
}

//Création du requin
function createSharkie(scene) {
  let sharkie = new BABYLON.MeshBuilder.CreateBox("herosharkie", {height:1, depth:6, width:6}, scene);
  // à modifier pour avoir un requin
  let sharkieMaterial = new BABYLON.StandardMaterial("sharkieMaterial", scene);
  sharkieMaterial.diffuseColor = new BABYLON.Color3.Red;
  sharkieMaterial.emissiveColor = new BABYLON.Color3.Blue;
  sharkie.material = sharkieMaterial;

  //Position de départ du joueur
  sharkie.position.y = 5;
  sharkie.position.x = -150;
  sharkie.position.z = -150;
  sharkie.speed = 3;
  sharkie.frontVector = new BABYLON.Vector3(0, 0, 1);

  sharkie.move = () => {
      let yMovement = 0;
      
      if(inputStates.up) {
        //if(sharkie.intersectsMesh(limite1, false)){
          sharkie.moveWithCollisions(sharkie.frontVector.multiplyByFloats(sharkie.speed, 0, sharkie.speed));
        //}
      }    
      if(inputStates.down) {
          sharkie.moveWithCollisions(sharkie.frontVector.multiplyByFloats(-sharkie.speed, 0, -sharkie.speed));
      }  
      if(inputStates.left) {
          //sharkie.moveWithCollisions(new BABYLON.Vector3(-1*sharkie.speed, 0, 0));
          sharkie.rotation.y -= 0.02;
          sharkie.frontVector = new BABYLON.Vector3(Math.sin(sharkie.rotation.y), 0, Math.cos(sharkie.rotation.y));
      }    
      if(inputStates.right) {
          //sharkie.moveWithCollisions(new BABYLON.Vector3(1*sharkie.speed, 0, 0));
          sharkie.rotation.y += 0.02;
          sharkie.frontVector = new BABYLON.Vector3(Math.sin(sharkie.rotation.y), 0, Math.cos(sharkie.rotation.y));
      }
  }
  return sharkie;
}

//Création des poissons
async function createFishs(scene) {
  // load the Fish 3D animated model
  fish = await BABYLON.SceneLoader.ImportMeshAsync("", "models/Fish/", "fish.glb", scene, function (meshes) { 
    var root = meshes[0];
    root.position = new BABYLON.Vector3(0, 100, 0);
   });
}

//Redimensionnement de la fenetre
window.addEventListener("resize", () => {
    engine.resize()
})

//Modification des pramètres
function modifySettings() {
  // as soon as we click on the game window, the mouse pointer is "locked"
  // you will have to press ESC to unlock it
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