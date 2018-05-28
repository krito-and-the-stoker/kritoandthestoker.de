import * as THREE from 'three'
import { createRenderer, startRendering, loadTexture, loadEnvironment } from './util'

export default async () => {
  const headsConfig = {
    light: {
      hemiSphere: {    
        skyColor: 0xffffff,
        groundColor: 0xfff2e0,
        intensity: 0.7
      },

      directional: {
        color: 0xf5f1e5,
        intensity: 1.1,
        position: {
          x: 0.6,
          y: 1,
          z: 1
        }
      }
    },
    material: {
      map: loadTexture('/assets3d/Atlas_color.png'),
      roughnessMap: loadTexture('/assets3d/Atlas_roughness.png'),
      roughness: 1.2,
      aoMapIntensity: 2.0,
      envMap: loadEnvironment('/assets3d/cubemaps/bluesky/'),
      envMapIntensity: 2.0
    },
    domSelector: '#boot',
    camera: {
      fieldOfView: 45,
      position: {
        x: 0,
        y: 0,
        z: 1.5
      },
      rotation: {
        x: 0,
        y: 0,
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

  const krito = await createRenderer(kritoConfig)
  const heizer = await createRenderer(heizerConfig)
  startRendering(krito)
  startRendering(heizer)
}

