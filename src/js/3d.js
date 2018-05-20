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

  return new THREE.Mesh( geometry, material );
}


export default async () => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera( 75, window.innerWidth/window.innerHeight, 0.1, 1000 );

  const renderer = new THREE.WebGLRenderer();
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );

  const heizer = await createHeizer();
  scene.add( heizer );

  camera.position.z = 5;

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

  const animate = function () {
    requestAnimationFrame( animate );
    renderer.render(scene, camera);
  };

  animate();
}