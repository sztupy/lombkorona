import Component from '../../Component'

export default class UIManager extends Component{
    constructor(){
        super();
        this.name = 'UIManager';
        this.kills = 0;
        this.deaths = 0;
    }

    SetAmmo(mag, rest){
        document.getElementById("current_ammo").innerText = mag;
        document.getElementById("max_ammo").innerText = rest;
    }

    SetHealth(health){
        document.getElementById("health_progress").style.width = `${health}%`;
    }

    AddKill() {
        this.kills += 1;
        document.getElementById("kills").innerText = this.kills;
    }

    AddDeath() {
        this.deaths += 1;
        document.getElementById("deaths").innerText = this.deaths;
    }

    Initialize(){
        document.getElementById("game_hud").style.visibility = 'visible';
    }
}
