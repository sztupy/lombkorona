import * as THREE from 'three'
import Component from '../../Component'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'
import CharacterFSM from './CharacterFSM'

import DebugShapes from '../../DebugShapes'


export default class CharacterController extends Component{
    constructor(model, clips, scene, physicsWorld, hitSound, screamSound, listener){
        super();
        this.name = 'CharacterController';
        this.physicsWorld = physicsWorld;
        this.scene = scene;
        this.mixer = null;
        this.clips = clips;
        this.animations = {};
        this.model = model;
        this.dir = new THREE.Vector3();
        this.forwardVec = new THREE.Vector3(0,0,1);
        this.pathDebug = new DebugShapes(scene);
        this.path = [];
        this.tempRot = new THREE.Quaternion();

        this.hitSoundBuffer = hitSound;
        this.screamSoundBuffer = screamSound;
        this.listener = listener;

        this.viewAngle = Math.cos(Math.PI / 4.0);
        this.maxViewDistance = 20.0 * 20.0;
        this.tempVec = new THREE.Vector3();
        this.attackDistance = 2.2;

        this.canMove = true;
        this.health = Math.random() * 100;
        this.size = 0.009 + Math.random() * 0.004;
        this.speed = 1 + Math.random() * 0.75;
    }

    SetAnim(name, clip){
        const action = this.mixer.clipAction(clip);
        this.animations[name] = {clip, action};
    }

    SetupAnimations(){
        Object.keys(this.clips).forEach(key=>{this.SetAnim(key, this.clips[key])});
    }

    Initialize(){
        this.uimanager = this.FindEntity("UIManager").GetComponent("UIManager");
        this.stateMachine = new CharacterFSM(this);
        this.navmesh = this.FindEntity('Level').GetComponent('Navmesh');
        this.hitbox = this.GetComponent('AttackTrigger');
        this.player = this.FindEntity("Player");

        this.parent.RegisterEventHandler(this.TakeHit, 'hit');

        this.hitSound = new THREE.Audio(this.listener);
        this.hitSound.setBuffer(this.hitSoundBuffer);
        this.hitSound.setLoop(false);

        this.screamSound = new THREE.Audio(this.listener);
        this.screamSound.setBuffer(this.screamSoundBuffer);
        this.screamSound.setLoop(false);

        const scene = this.model;

        scene.scale.setScalar(this.size);
        scene.position.copy(this.parent.position);

        this.mixer = new THREE.AnimationMixer( scene );

        scene.traverse(child => {
            if ( !child.isSkinnedMesh  ) {
                return;
            }

            child.frustumCulled = false;
            child.castShadow = true;
            child.receiveShadow = true;
            this.skinnedmesh = child;
            this.rootBone = child.skeleton.bones.find(bone => bone.name == 'MutantHips');
            this.rootBone.refPos = this.rootBone.position.clone();
            this.lastPos = this.rootBone.position.clone();
        });

        this.SetupAnimations();

        this.scene.add(scene);
        this.stateMachine.SetState('idle');
    }

    UpdateDirection(){
        this.dir.copy(this.forwardVec);
        this.dir.applyQuaternion(this.parent.rotation);
    }

    CanSeeThePlayer(){
        const playerPos = this.player.Position.clone();
        const modelPos = this.model.position.clone();
        modelPos.y += 1.35;
        const charToPlayer = playerPos.sub(modelPos);

        if(playerPos.lengthSq() > this.maxViewDistance){
            return;
        }

        charToPlayer.normalize();
        const angle = charToPlayer.dot(this.dir);

        if(angle < this.viewAngle){
            return false;
        }

        const rayInfo = {};
        const collisionMask = CollisionFilterGroups.AllFilter & ~CollisionFilterGroups.SensorTrigger;

        if(AmmoHelper.CastRay(this.physicsWorld, modelPos, this.player.Position, rayInfo, collisionMask)){
            const body = Ammo.castObject( rayInfo.collisionObject, Ammo.btRigidBody );

            if(body == this.player.GetComponent('PlayerPhysics').body){
                return true;
            }
        }

        return false;
    }

    NavigateToRandomPoint(){
        const node = this.navmesh.GetRandomNode(this.model.position, 50);
        this.path = this.navmesh.FindPath(this.model.position, node);
    }

    NavigateToPlayer(){
        this.tempVec.copy(this.player.Position);
        this.tempVec.y = 0.5;

        this.path = this.navmesh.FindPath(this.model.position, this.tempVec);

        /*
        if(this.path){
            this.pathDebug.Clear();
            for(const point of this.path){
                this.pathDebug.AddPoint(point, "blue");
            }
        }
        */
    }

    RespawnCreature() {
        this.model.position.x = Math.random() * 100 - 50;
        this.model.position.z = Math.random() * 100 - 50;
        this.ClearPath();
        this.health = Math.random() * 100;
        this.stateMachine.SetState('idle');
    }

    FacePlayer(t, rate = 3.0){
        this.tempVec.copy(this.player.Position).sub(this.model.position);
        this.tempVec.y = 0.0;
        this.tempVec.normalize();

        this.tempRot.setFromUnitVectors(this.forwardVec, this.tempVec);
        this.model.quaternion.rotateTowards(this.tempRot, rate * t);
    }

    get IsCloseToPlayer(){
        this.tempVec.copy(this.player.Position).sub(this.model.position);

        if(this.tempVec.lengthSq() <= this.attackDistance * this.attackDistance){
            return true;
        }

        return false;
    }

    get IsPlayerInHitbox(){
        return this.hitbox.overlapping;
    }

    HitPlayer(){
        this.player.Broadcast({topic: 'hit'});
    }

    TakeHit = msg => {
        this.health = Math.max(0, this.health - msg.amount);

        if(this.health == 0){
            const stateName = this.stateMachine.currentState.Name;
            if (stateName != 'dead') {
                this.uimanager.AddKill();
                this.screamSound.isPlaying && this.screamSound.stop();
                this.screamSound.play();
            }

            this.stateMachine.SetState('dead');
        }else{
            const stateName = this.stateMachine.currentState.Name;
            if(stateName == 'idle' || stateName == 'patrol'){
                this.stateMachine.SetState('chase');
            }

            this.hitSound.isPlaying && this.hitSound.stop();
            this.hitSound.play();
        }
    }

    MoveAlongPath(t){
        if(!this.path?.length) return;

        const target = this.path[0].clone().sub( this.model.position );
        target.y = 0.0;

        if (target.lengthSq() > 0.1 * 0.1) {
            target.normalize();
            this.tempRot.setFromUnitVectors(this.forwardVec, target);
            this.model.quaternion.slerp(this.tempRot,4.0 * t);
        } else {
            // Remove node from the path we calculated
            this.path.shift();

            if(this.path.length===0){
                this.Broadcast({topic: 'nav.end', agent: this});
            }
        }
    }

    ClearPath(){
        if(this.path){
            this.path.length = 0;
        }
    }

    ApplyRootMotion(){
        if(this.canMove) {
            const vel = this.rootBone.position.clone();
            vel.sub(this.lastPos).multiplyScalar(0.01 * this.speed);
            vel.y = 0;

            vel.applyQuaternion(this.model.quaternion);

            // when the walk/run animation wraps around the vector would be a large jump (back). Make sure we don't move the character for these large jump events
            if(vel.lengthSq() < 1 * 1){
                this.model.position.add(vel);
            }
        }

        //Reset the root bone horizontal position
        this.lastPos.copy(this.rootBone.position);
        this.rootBone.position.z = this.rootBone.refPos.z;
        this.rootBone.position.x = this.rootBone.refPos.x;
    }

    Update(t){
        this.mixer && this.mixer.update(t);
        this.ApplyRootMotion();

        this.UpdateDirection();
        this.MoveAlongPath(t);
        this.stateMachine.Update(t);

        if (Math.abs(this.model.position.x) > 84 || Math.abs(this.model.position.z) > 84) {
            this.RespawnCreature();
        }

        this.parent.SetRotation(this.model.quaternion);
        this.parent.SetPosition(this.model.position);
    }
}
