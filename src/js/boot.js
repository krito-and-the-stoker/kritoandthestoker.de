import * as THREE from 'three'
import { createRenderer, startRendering, loadTexture, loadEnvironment } from './util'


export default async () => {
  const stage = await createRenderer({
    scene: '/assets3d/bootSzene.json',
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
      aoMap: loadTexture('/assets3d/SchiffSzene_AO.jpg'),
      roughnessMap: loadTexture('/assets3d/Atlas_roughness.png'),
      roughness: 0.8,
      aoMapIntensity: 1.2,
      envMap: loadEnvironment('/assets3d/cubemaps/bluesky/'),
      envMapIntensity: 2.0
    },
    domSelector: '#boot',
    camera: {
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
  })
  startRendering(stage)
}

