// Gestion des importations
import Fish from "./Fish.js";
import Shark from "./Shark.js";

// Déclaration des variables
let canvas;
let engine;
let scene;
let camera;
let wsize = 800;
let inputStates = {};
let limite1;
let limite2;
let nbFish = 0;
let positionFishes = [[-100, 100], [-150, -130], [-300, -180], [-400, -80], [-400, 100], [150, 130], [200, 100], [200, 350], [400, 250], [300, -250]];


window.onload = startGame;

async function startGame() {
  //Récupération du canvas
  canvas = document.querySelector("#myCanvas");
  //Création d'une instance du moteur 3D
  engine = new BABYLON.Engine(canvas, true);
  
  scene = await createScene();
  scene.enablePhysics();
  
  // Modification des settings
  modifySettings();

  //Récupération du requin
  let shark = new Shark();
  await shark.build(scene, canvas);

  //Création des poissons
  //for (nbFish; nbFish < 6; nbFish++){
    let fish = new Fish();
    await fish.build(nbFish, scene, canvas, [-100, -100]); //posPoissons(positionFishes));  
  //}
  
  scene.toRender = () =>{
      let deltaTime = engine.getDeltaTime();

      shark.checkActionShark(deltaTime, inputStates);
      scene.render();
  };
  scene.assetsManager.load();
}

//Création de la scène
function createScene() {
  //Initialisation de la scène
  let scene = new BABYLON.Scene(engine);
  scene.assetsManager = configureAssetManager(scene);

  scene.clearColor = new BABYLON.Color3(0.14, 0.44, 0.67);
  createLights(scene);
  let ground = createGround(scene);

  return scene;
}

//Gérer la configuration des assets
function configureAssetManager(scene) {
  // useful for storing references to assets as properties. i.e scene.assets.cannonsound, etc.
  scene.assets = {};

  let assetsManager = new BABYLON.AssetsManager(scene);

  assetsManager.onProgress = function (
    remainingCount,
    totalCount,
    lastFinishedTask
  ) {
    engine.loadingUIText =
      "We are loading the scene. " +
      remainingCount +
      " out of " +
      totalCount +
      " items still need to be loaded.";
    console.log(
      "We are loading the scene. " +
      remainingCount +
      " out of " +
      totalCount +
      " items still need to be loaded."
    );
  };

  assetsManager.onFinish = function (tasks) {
    engine.runRenderLoop(function () {
      scene.toRender();
    });
  };

  return assetsManager;
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
    ground2.position.y = -5.2;
    
    // Water
    var water = BABYLON.Mesh.CreateGround("waterMesh", 100, 100, 100, scene, false);
    var waterMaterial = new BABYLON.StandardMaterial("water", scene);
    water.material = waterMaterial;
    waterMaterial.diffuseTexture = new BABYLON.Texture("assets/map/waterbump.png", scene);
    waterMaterial.alpha = 0.5;
    waterMaterial.diffuseTexture.uScale = 6;
    waterMaterial.diffuseTexture.vScale = 6;
    water.position.y = 20;
    water.scaling = new BABYLON.Vector3(10,20,10);

    //Délimitation pour les collisions
    limite1 = BABYLON.MeshBuilder.CreateSphere("limite1", {diameterX:280, diameterZ:230, diameterY:50, segment: 32, sideOrientation: BABYLON.Mesh.DOUBLESIDE});
    limite1.position.z = 50;
    limite1.rotation.y = 15;
    limite1.visibility = 0;
  });
  // Ajout de la physique
  //ground.PhysicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.HeightmapImpostor, {mass : 0}, scene);
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

//Gestion de la position des poissons
function posPoissons(listCoord){
  if (listCoord.length == 0){
    positionFishes = [[-100, 100], [-150, -130], [-300, -180], [-400, -80], [-400, 100], [150, 130], [200, 100], [200, 350], [400, 250], [300, -250]];
    listCoord = [[-100, 100], [-150, -130], [-300, -180], [-400, -80], [-400, 100], [150, 130], [200, 100], [200, 350], [400, 250], [300, -250]];
  }
  // Choix aleatoire des coordonnees du poisson
  let coord = listCoord[Math.floor(Math.random() * (listCoord.length + 1))];
  // Suppression des coordonnees deja utilisees
  positionFishes.splice(positionFishes.indexOf(coord), 1);

  return coord;

}

//Redimensionnement de la fenetre
window.addEventListener("resize", () => {
    engine.resize()
})

//Modification des paramètres
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