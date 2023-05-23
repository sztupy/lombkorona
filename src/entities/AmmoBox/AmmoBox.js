import * as THREE from 'three';
import Component from '../../Component'
import {Ammo, AmmoHelper, CollisionFilterGroups} from '../../AmmoLib'


export default class AmmoBox extends Component{
    constructor(scene, model, shape, physicsWorld){
        super();
        this.name = 'AmmoBox';
        this.model = model;
        this.shape = shape;
        this.scene = scene;
        this.world = physicsWorld;

        this.quat = new Ammo.btQuaternion();
        this.update = true;
    }

    Initialize(){
        this.player = this.FindEntity('Player');
        this.playerPhysics = this.player.GetComponent('PlayerPhysics');

        this.trigger = AmmoHelper.CreateTrigger(this.shape);

        this.world.addCollisionObject(this.trigger, CollisionFilterGroups.SensorTrigger);
        this.scene.add(this.model);
    }

    Respawn(){
        let x = Math.random()*100-50;
        let z = Math.random()*100-50;

        this.parent.SetPosition(new THREE.Vector3(x,0,z));
        const entityPos = this.parent.position;
        this.model.position.copy(entityPos);
        const transform = this.trigger.getWorldTransform();
        transform.getOrigin().setValue(entityPos.x, entityPos.y, entityPos.z);

    }

    Update(t){
        if(!this.update){
            return;
        }

        const entityPos = this.parent.position;
        const entityRot = this.parent.rotation;

        this.model.position.copy(entityPos);
        this.model.quaternion.copy(entityRot);

        const transform = this.trigger.getWorldTransform();

        this.quat.setValue(entityRot.x, entityRot.y, entityRot.z, entityRot.w);
        transform.setRotation(this.quat);
        transform.getOrigin().setValue(entityPos.x, entityPos.y, entityPos.z);

        if(AmmoHelper.IsTriggerOverlapping(this.trigger, this.playerPhysics.body)){
            this.player.Broadcast({topic: 'AmmoPickup'});
            this.Respawn();
        }
    }

}
