import * as THREE from 'three'

const skyColor = 0xdde8fd
const groundColor = 0xd1daed
const hemisPhereIntensity = 2.2

const directionalColor = 0xff5a00
const directionalIntensity = .5
const directionalLightPosition = {
  x: -2,
  y: 3,
  z: -6,
}


const createBootSzene = async () => {
  const scene = await new Promise(resolve => {
    const loader = new THREE.ObjectLoader()
    loader.load(`/assets3d/bootSzene.json`, scene => {
      resolve(scene)
    })
  })
  const bootSzeneTexture = new THREE.TextureLoader().load('/assets3d/Atlas_color.png')
  const bootSzeneAO = new THREE.TextureLoader().load('/assets3d/SchiffSzene_AO.jpg')
  const bootSzeneRoughness = new THREE.TextureLoader().load('/assets3d/Atlas_roughness.png')
  const bootEnvironment = new THREE.CubeTextureLoader()
    .setPath('/assets3d/cubemaps/bluesky/')
    .load([
      'posX.jpg',
      'negX.jpg',
      'posY.jpg',
      'negY.jpg',
      'posZ.jpg',
      'negZ.jpg'
    ])

  const material = new THREE.MeshStandardMaterial({
    map: bootSzeneTexture,
    aoMap: bootSzeneAO,
    roughnessMap: bootSzeneRoughness,
    roughness: 1.0,
    aoMapIntensity: 1.0,
    envMap: bootEnvironment,
    envMapIntensity: 1.0,
  })
  scene.children.forEach(mesh => {
    mesh.material = material
  })
  const hemisphereLight = new THREE.HemisphereLight(skyColor, groundColor, hemisPhereIntensity)
  const directionalLight = new THREE.DirectionalLight(directionalColor, directionalIntensity)
  directionalLight.position.x = directionalLightPosition.x
  directionalLight.position.y = directionalLightPosition.y
  directionalLight.position.z = directionalLightPosition.z
  scene.add(hemisphereLight)
  scene.add(directionalLight)

  const mixer = new THREE.AnimationMixer(scene)
  const action = mixer.clipAction(scene.animations[0])
  action.play()

  return [scene, mixer]
}


export default async () => {
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000)

  const renderer = new THREE.WebGLRenderer({ alpha: true })
  renderer.setSize(window.innerWidth, window.innerWidth / 2)
  document.body.querySelector('#boot').appendChild(renderer.domElement)

  const [scene, mixer] = await createBootSzene()

  let initialZ = 9.682811196058351

  camera.position.x = 15 
  camera.position.y = 4
  camera.position.z = 15
  camera.rotation.y += .8


  const captureCamera = (e) => {
    // allow horizontal angles
    const alpha = 0.001
    camera.rotation.y += alpha*e.movementX
    // camera.rotation.x += alpha*e.movementY
  }

  document.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', captureCamera)
  })
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', captureCamera)
  })

  document.addEventListener('scroll', (e) => {
    const alpha = 0.01
    //camera.position.z = initialZ - alpha*window.scrollY
  })


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