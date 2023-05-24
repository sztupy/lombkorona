import * as THREE from 'three'
import Component from "../../Component";

export default class PlayerHealth extends Component{
    constructor(oughSound, listener){
        super();
        this.name = 'PlayerHealth';
        this.health = 100;

        this.oughSoundBuffer = oughSound;
        this.listener = listener;
    }

    TakeHit = e =>{
        if (!this.cheatCodes.godMode) {
            this.health = Math.max(0, this.health - 10);
            this.uimanager.SetHealth(this.health);
        }

        this.oughSound.isPlaying && this.oughSound.stop();
        this.oughSound.play();
    }

    Initialize(){
        this.uimanager = this.FindEntity("UIManager").GetComponent("UIManager");
        this.cheatCodes = this.GetComponent('CheatCodes');
        this.parent.RegisterEventHandler(this.TakeHit, "hit");
        this.uimanager.SetHealth(this.health);

        this.physicsComponent = this.GetComponent("PlayerPhysics");
        this.physicsBody = this.physicsComponent.body;

        this.oughSound = new THREE.Audio(this.listener);
        this.oughSound.setBuffer(this.oughSoundBuffer);
        this.oughSound.setLoop(false);

    }
}
