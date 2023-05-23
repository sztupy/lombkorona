import * as THREE from 'three'
import Component from '../../Component'
import Input from '../../Input'
import {Ammo} from '../../AmmoLib'

import DebugShapes from '../../DebugShapes'


export default class PlayerRespawn extends Component{
    constructor(startingPosition, screamSound, listener){
        super();
        this.name = 'PlayerRespawn';
        this.origin = new Ammo.btVector3(startingPosition.x, startingPosition.y + 10, startingPosition.z);

        this.screamSoundBuffer = screamSound;
        this.listener = listener;
    }

    Initialize(){
        this.physicsComponent = this.GetComponent("PlayerPhysics");
        this.physicsBody = this.physicsComponent.body;
        this.healthComponent = this.GetComponent("PlayerHealth");
        this.uimanager = this.FindEntity("UIManager").GetComponent("UIManager");

        this.screamSound = new THREE.Audio(this.listener);
        this.screamSound.setBuffer(this.screamSoundBuffer);
        this.screamSound.setLoop(false);

    }

    Update(t){
        if (this.parent.Position.y < -10 || this.healthComponent.health <= 0) {
            let transform = this.physicsBody.getCenterOfMassTransform();
            transform.setOrigin(this.origin);
            this.physicsBody.setCenterOfMassTransform(transform);

            this.healthComponent.health = 100;
            this.uimanager.SetHealth(this.healthComponent.health);

            this.uimanager.AddDeath();

            this.screamSound.isPlaying && this.screamSound.stop();
            this.screamSound.play();
        }
    }
}
