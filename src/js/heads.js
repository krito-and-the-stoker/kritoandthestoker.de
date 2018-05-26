import * as THREE from 'three'
import { createRenderer, startRendering, loadTexture, loadEnvironment } from './util'

const headsConfig = {
  light: {
    hemiSphere: {    
      skyColor: 0xdde8fd,
      groundColor: 0xd1daed,
      intensity: 1.1
    },

    directional: {
      color: 0xfaca8c,
      intensity: 1.0,
      position: {
        x: 1,
        y: 1,
        z: -3
      }
    }
  },
  material: {
    map: loadTexture('/assets3d/Atlas_color.png'),
    roughnessMap: loadTexture('/assets3d/Atlas_roughness.png'),
    roughness: 0.8,
    aoMapIntensity: 1.2,
    envMap: loadEnvironment('/assets3d/cubemaps/bluesky/'),
    envMapIntensity: 2.0
  },
  domSelector: '#boot',
  camera: {
    perspective: 45,
    position: {
      x: 15,
      y: 4,
      z: 15
    },
    rotation: {
      x: 0,
      y: .8,
      z: 0
    }
  }
}

const kritoConfig = {
  ...headsConfig,
  scene: '/assets3d/KopfKrito.json',
  material: {
    ...headsConfig.material,
    aoMap: loadTexture('/assets3d/KopfKrito_AO.jpg'),
  },
  domSelector: '#krito'
}

const heizerConfig = {
  ...headsConfig,
  scene: '/assets3d/KopfHeizer.json',
  material: {
    ...headsConfig.material,
    aoMap: loadTexture('/assets3d/KopfHeizer_AO.jpg'),
  },
  domSelector: '#heizer'
}

export default async () => {
  const krito = await createRenderer(kritoConfig)
  const heizer = await createRenderer(heizerConfig)
  startRendering(krito)
  startRendering(heizer)
}

