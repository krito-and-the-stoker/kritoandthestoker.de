import * as THREE from 'three'

export const loadScene = async (name) => {
  return new Promise(resolve => {
    const loader = new THREE.ObjectLoader()
    loader.load(name, scene => {
      resolve(scene)
    })
  })
}

export const loadTexture = filename => new THREE.TextureLoader().load(filename)
export const loadEnvironment = path => new THREE.CubeTextureLoader()
  .setPath(path)
  .load([
    'posX.jpg',
    'negX.jpg',
    'posY.jpg',
    'negY.jpg',
    'posZ.jpg',
    'negZ.jpg'
  ])

export const createHemisphereLight = config => new THREE.HemisphereLight(config.skyColor, config.groundColor, config.intensity)
export const createDirectionalLight = config => {
  const light = new THREE.DirectionalLight(config.color, config.intensity)
  light.position.x = config.position.x
  light.position.y = config.position.y
  light.position.z = config.position.z
  return light
}

export const assignMaterial = (scene, material) => {
  const recursive = (mesh, fn) => {
    fn(mesh)
    mesh.children.forEach(mesh => recursive(mesh, fn))
  }

  recursive(scene, mesh => {
    mesh.material = material
  })
}

export const createScene = async (config) => {
  const scene = await loadScene(config.scene)
  const material = new THREE.MeshStandardMaterial(config.material)
  assignMaterial(scene, material)
  scene.add(createHemisphereLight(config.light.hemiSphere))
  scene.add(createDirectionalLight(config.light.directional))

  const mixer = new THREE.AnimationMixer(scene)
  const action = mixer.clipAction(scene.animations[0])
  action.play()

  return { scene, mixer }
}

export const createRenderer = async (config) => {
  const camera = createCamera(config)
  const renderer = new THREE.WebGLRenderer({ alpha: true })
  const domElement = document.querySelector(config.domSelector)
  renderer.setSize(domElement.clientWidth, domElement.clientHeight)
  domElement.appendChild(renderer.domElement)
  domElement.querySelector('canvas').style.width = '100%';
  domElement.querySelector('canvas').style.height = 'auto';

  const { scene, mixer } = await createScene(config)

  return { camera, scene, mixer, renderer }
}

export const createCamera = (config) => {
  const domElement = document.querySelector(config.domSelector)
  const camera = new THREE.PerspectiveCamera(config.camera.fieldOfView, domElement.clientWidth/domElement.clientHeight, 0.1, 1000)
  camera.position.x = config.camera.position.x
  camera.position.y = config.camera.position.y
  camera.position.z = config.camera.position.z

  camera.rotation.x += config.camera.rotation.x
  camera.rotation.y += config.camera.rotation.y
  camera.rotation.z += config.camera.rotation.z

  return camera
}

export const startRendering = ({ camera, scene, mixer, renderer }) => {
  let deltaSeconds = 0
  let lastTime = 0
  const animate = function (time) {
    if (lastTime) {
      deltaSeconds = (time - lastTime) / 1000
    } else {
      deltaSeconds = 0
    }
    lastTime = time
    mixer.update(deltaSeconds)
    renderer.render(scene, camera)

    requestAnimationFrame(animate)
  }

  animate()  
}

export const enableMouseLook = (camera) => {
  const captureCamera = (e) => {
    // allow horizontal angles
    const alpha = 0.001
    camera.rotation.y += alpha*e.movementX
  }

  document.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', captureCamera)
  })
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', captureCamera)
  })  
}