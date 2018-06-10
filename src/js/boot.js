import * as THREE from 'three'
import { createRenderer, startRendering, loadTexture, loadEnvironment } from './util'


export default async () => {
  const config = {
    scene: '/assets3d/bootSzene.json',
    light: {
      hemiSphere: {    
        skyColor: 0xc6daff,
        groundColor: 0xd1daed,
        intensity: 1.3
      },

      directional: {
        color: 0xfaca8c,
        intensity: 1.4,
        position: {
          x: 1,
          y: 1,
          z: -5
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
      envMapIntensity: 2.1
    },
    domSelector: '#boot',
    camera: {
      fieldOfView: 45,
    },
    timeScale: 1,
  }

  const interpolationConfig = {
    from: {
      position: {
        x: 15,
        y: 5,
        z: 15
      },
      lookAt: {
        x: -2,
        y: 2,
        z: 0
      }
    },
    to: {
      position: {
        x: 15,
        y: 0,
        z: 15,
      },
      lookAt: {
        x: -2,
        y: 10,
        z: 0,
      },
    },
  }

  const clamp = (delta, min = 0, max = 1) => Math.max(min, Math.min(delta, max))
  const interpolate = (from, to, delta) => from + clamp(delta) * (to - from)
  const interpolateEntries = (from, to, delta) => Object.entries(from)
    .map(([key, value]) => [key, interpolate(value, to[key], delta)])
    .reduce((obj, [key, value]) => ({ ...obj, [key]: value}), {})

  const stage = await createRenderer(config)

  const updateInterpolation = () => {
    const el = stage.renderer.domElement
    const rect = el.getBoundingClientRect()
    const height = rect.top - rect.bottom
    const scrollY = rect.top
    const relativeScroll = scrollY / height

    const position = interpolateEntries(
      interpolationConfig.from.position,
      interpolationConfig.to.position,
      relativeScroll)
    const lookAt = interpolateEntries(
      interpolationConfig.from.lookAt,
      interpolationConfig.to.lookAt,
      relativeScroll)

    stage.camera.position.x = position.x
    stage.camera.position.y = position.y
    stage.camera.position.z = position.z

    stage.camera.lookAt(lookAt.x, lookAt.y, lookAt.z)    
  }

  updateInterpolation()
  window.addEventListener('scroll', updateInterpolation)

  startRendering(config)(stage)
}

