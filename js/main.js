import Fish from "./Fish.js";
import Shark from "./Shark.js";

let canvas;
let engine;
let scene;
let camera;
let wsize = 800;
let inputStates = {};
let limite1;
let limite2;
let fish;

//window.onload = startGame;

export async function startGame(canvasId) {
    //Récupération du canvas
    canvas = document.querySelector("#myCanvas");
    //Création d'une instance du moteur 3D
    engine = new BABYLON.Engine(canvas, true);

    scene = await createScene();
    scene.enablePhysics();

    canvas = document.getElementById(canvasId);

    //Modification des paramètres par défault
    modifySettings();

  
    //Récupération du requin
    //shark = scene.getMeshByName("herosharkie");
    let shark = new Shark();
    await shark.build(scene,canvas);

    //Récupération des poissons
    //fish = scene.getMeshByName("fish");

    // main animation loop 60 times/s
    engine.runRenderLoop(async () => {
      shark.checkActionShark(engine.getDeltaTime());

      //let deltaTime = engine.getDeltaTime();

        
      scene.render();
    });

    //Redimensionnement de la fenetre
window.addEventListener("resize", function() {
  if (engine){
    engine.resize()
  }
})
}

//Création de la scène
async function createScene() {
  //Initialisation de la scène
  let scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.14, 0.44, 0.67);
  createLights(scene);
  let ground = createGround(scene);

  //Création du requin
  //let shark = await createSharkie(scene);

  //Création des poissons
  //await createFishs(scene);

  //Création des caméras
  let freeCamera = createFreeCamera(scene);
  //scene.followCameraShark = createFollowCamera(scene, shark);
  //scene.activeCamera = scene.followCameraShark;

  //Axe de mouvement X et Z
  //scene.addListenerMovement();

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
    /*let ground = BABYLON.Mesh.CreateGroundFromHeightMap("ground", "assets/map/heightMap.png", 100, 100, 100, 0, 10, scene, false, (mesh) => {
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
    ground2.position.y = -10;*/
    
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
    /*limite1 = BABYLON.MeshBuilder.CreateSphere("limite1", {diameterX:280, diameterZ:230, diameterY:50, segment: 32, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
    limite1.position.z = 50;
    limite1.rotation.y = 15;
    limite1.visibility = 0;


  });*/
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
  let targetName = target.name;
  let camera = new BABYLON.FollowCamera(targetName + "sharkieFollowCamera", target.position, scene, target);

  camera.radius = 120; // how far from the object to follow
  camera.heightOffset = 50; // how high above the object to place the camera
  camera.rotationOffset = 220; // the viewing angle
  camera.cameraAcceleration = .1; // how fast to move
  camera.maxCameraSpeed = 5; // speed limit

  return camera;
}


//Création des poissons
/*async function createFishs(scene) {
  // load the Fish 3D animated model
  fish = await BABYLON.SceneLoader.ImportMeshAsync("", "models/Fish/", "fish.glb", scene, function (meshes) { 
   
   });
}*/



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
  scene.inputStates = {};
  scene.inputStates.left = false;
  scene.inputStates.right = false;
  scene.inputStates.up = false;
  scene.inputStates.down = false;
  scene.inputStates.space = false;

  //add the listener to the main, window object, and update the states
  window.addEventListener(
    "keydown",
    (event) => {
      if (event.key === "ArrowLeft" || event.key === "q" || event.key === "Q") {
        scene.inputStates.left = true;
      } else if (
        event.key === "ArrowUp"
      ) {
        scene.inputStates.up = true;
      } else if (
        event.key === "ArrowRight" 
      ) {
        scene.inputStates.right = true;
      } else if (
        event.key === "ArrowDown"
      ) {
        scene.inputStates.down = true;
      } else if (event.key === " ") {
        scene.inputStates.space = true;
      } else if (event.key === "l" || event.key === "L") {
        scene.inputStates.laser = true;
      } else if (event.key == "t" || event.key == "T") {
        scene.activeCamera = scene.followCameraTank;
      } else if (event.key == "y" || event.key == "Y") {
        scene.activeCamera = scene.followCameraDude;
      } else if (event.key == "u" || event.key == "U") {
        scene.activeCamera = scene.freeCameraDude;
      }
    },
    false);

  //if the key will be released, change the states object 
  window.addEventListener('keyup', (event) => {
      if ((event.key === "ArrowLeft")) {
         inputStates.left = false;
      } else if ((event.key === "ArrowUp")){
         inputStates.up = false;
      } else if ((event.key === "ArrowRight")){
         inputStates.right = false;
      } else if ((event.key === "ArrowDown")) {
         inputStates.down = false;
      }  else if (event.key === " ") {
         inputStates.space = false;
      }
  }, false);

  
}