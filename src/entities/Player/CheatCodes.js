import Component from '../../Component'
import Input from '../../Input'


export default class CheatCodes extends Component{
    constructor(startingPosition, screamSound, listener){
        super();
        this.name = 'CheatCodes';
        this.currentCode = '';
        this.godMode = false;
        this.unlimitedAmmo = false;
    }

    Initialize(){
    }

    CheckKeys(letters) {
        for (let letter of letters) {
            if (Input.GetKeyDown(letter))
                return true;
        }
        return false;
    }

    Update(t){
        if (this.currentCode == '') {
            if (Input.GetKeyDown('KeyI')) {
                this.currentCode = 'I';
            } else if (this.CheckKeys('KeyD', 'KeyQ', 'KeyK', 'KeyF', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'I') {
            if (Input.GetKeyDown('KeyD')) {
                this.currentCode = 'ID';
            } else if (this.CheckKeys('KeyQ', 'KeyK', 'KeyF', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'ID') {
            if (!Input.GetKeyDown('KeyD')) {
                this.currentCode = 'ID_';
            } else if (this.CheckKeys('KeyI', 'KeyQ', 'KeyF', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'ID_') {
            if (Input.GetKeyDown('KeyD')) {
                this.currentCode = 'ID_D';
            } else if (Input.GetKeyDown('KeyK')) {
                this.currentCode = 'ID_K';
            } else if (this.CheckKeys('KeyI', 'KeyQ', 'KeyF', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'ID_D') {
            if (Input.GetKeyDown('KeyQ')) {
                this.currentCode = 'ID_DQ';
            } else if (this.CheckKeys('KeyK', 'KeyI', 'KeyF', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'ID_DQ') {
            if (Input.GetKeyDown('KeyD')) {
                console.log('God Mode activated');
                this.godMode = true;
                this.currentCode = '';
            } else if (this.CheckKeys('KeyK', 'KeyI', 'KeyF', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'ID_K') {
            if (Input.GetKeyDown('KeyF')) {
                this.currentCode = 'ID_KF';
            } else if (this.CheckKeys('KeyD', 'KeyI', 'KeyA')) {
                this.currentCode = '';
            }
        } else if (this.currentCode == 'ID_KF') {
            if (Input.GetKeyDown('KeyA')) {
                this.unlimitedAmmo = true;
                console.log('Unlimited Ammo activated');
                this.currentCode = '';
            } else if (this.CheckKeys('KeyD', 'KeyI', 'KeyK')) {
                this.currentCode = '';
            }
        }
    }
}
