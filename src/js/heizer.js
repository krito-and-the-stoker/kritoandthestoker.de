import * as THREE from 'three'

const createHeizer = async () => {
  const geometry = await new Promise(resolve => {
    const loader = new THREE.JSONLoader()
    loader.load(`/heizer.json`, geometry => {
      resolve(geometry)
    })
  })
  const heizerTexture = new THREE.TextureLoader().load(`/HeizerKoerperCompleteMap.png`)
  const material = new THREE.MeshBasicMaterial({ map: heizerTexture })

  return new THREE.Mesh( geometry, material )
}

const createBoot = async () => {
  const obj = await new Promise(resolve => {
    const loader = new THREE.ObjectLoader()
    loader.load(`/bootMitSzene.json`, obj => {
      resolve(obj)
    })
  })
  const boot = obj.children[0]
  const bootTexture = new THREE.TextureLoader().load('/SchiffCompleteMap.png')
  boot.material = new THREE.MeshBasicMaterial({ map: bootTexture })
  return [boot, obj.animations[0]]
  // const bootTexture = new THREE.TextureLoader().load(`/SchiffCompleteMap.png`)
  // const material = new THREE.MeshBasicMaterial({ map: bootTexture })
  // return new THREE.Mesh( geometry, material )
}

const createAnimations = (scene) => {
  // Create an AnimationMixer, and get the list of AnimationClip instances
  const mixer = new THREE.AnimationMixer( scene )
  const action = mixer.clipAction( scene.animations[0] )
  action.play()

  return mixer
}

const createBootSzene = async () => {
  const obj = await new Promise(resolve => {
    const loader = new THREE.ObjectLoader()
    loader.load(`/bootSzene.json`, obj => {
      resolve(obj)
    })
  })
  console.log(obj)
  const bootSzeneTexture = new THREE.TextureLoader().load('/schiffDiffuseMap.png')
  const material = new THREE.MeshBasicMaterial({ map: bootSzeneTexture })
  obj.children.forEach(mesh => {
    mesh.material = material
  })

  return obj
  // const boot = obj.children[0]
  // return [boot, obj.animations[0]]
}


export default async () => {
  // const scene = new THREE.Scene()
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 )

  const renderer = new THREE.WebGLRenderer()
  renderer.setSize( window.innerWidth, window.innerHeight )
  document.body.appendChild( renderer.domElement )

  const heizer = await createHeizer()
  // const [boot, clip] = await createBoot()
  const scene = await createBootSzene()
  scene.add(heizer)
  const mixer = createAnimations(scene)
  // scene.add( boot )
  // scene.add( heizer )

  // camera.position.z = 5
  camera.position.x = 8.146366342379562
  camera.position.y = 3.227381223127345
  camera.position.z = 9.682811196058351

  const captureCamera = (e) => {
    const alpha = 0.001
    camera.rotation.y += alpha*e.movementX
    camera.rotation.x += alpha*e.movementY
  }

  document.addEventListener('mousedown', () => {
    document.addEventListener('mousemove', captureCamera)
  })
  document.addEventListener('mouseup', () => {
    document.removeEventListener('mousemove', captureCamera)
  })

  document.addEventListener('mousewheel', (e) => {
    if(window.scrollY + window.innerHeight >= document.body.clientHeight) {
      e.preventDefault()

      const alpha = 0.001
      camera.translateZ(alpha*e.deltaY)
    }
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
    mixer.update( deltaSeconds )
    renderer.render(scene, camera)

    requestAnimationFrame( animate )
  }

  animate()
}