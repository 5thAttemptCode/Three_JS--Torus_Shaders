import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import testVertexShader from './shaders/test/vertex.glsl'
import testFragmentShader from './shaders/test/fragment.glsl'


//CANVAS
const canvas = document.querySelector('canvas.webgl')

//SCENE
const scene = new THREE.Scene()


//GEOMETRY
const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );

const count = geometry.attributes.position.count
const randoms = new Float32Array(count)

for(let i = 0; i < count; i++){
    randoms[i] = Math.random()
}

geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1))


//MATERIAL
const material = new THREE.RawShaderMaterial({
    vertexShader: testVertexShader,
    fragmentShader: testFragmentShader,
    wireframe: true,
    //transparent: true //To make opacity/alpha work value: 10 
    uniforms:{
        uFrequency: { value: new THREE.Vector2(10, 5) },
        uTime: { value: 0 },
        uColor: { value: new THREE.Color('#6f7eff') }
    }
})


//MESH
const mesh = new THREE.Mesh(geometry, material)
scene.add(mesh)


//SIZE
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    //Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    //Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()

    //Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})


//CAMERA
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.set(0.25, - 0.25, 1)
scene.add(camera)


//CONTROLS
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


//RENDERER
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
camera.position.setZ(30)


//ANIMATE
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    //Material
    material.uniforms.uTime.value = elapsedTime

    //Update controls
    controls.update()

    //Render
    renderer.render(scene, camera)

    //Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()