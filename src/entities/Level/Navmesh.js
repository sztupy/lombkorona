import * as THREE from 'three';
import Component from '../../Component'

import {Pathfinding} from 'three-pathfinding'


export default class Navmesh extends Component{
    constructor(scene, mesh){
        super();
        this.scene = scene;
        this.name = "Navmesh";
        this.zone = "level1";
        this.mesh = mesh;
    }

    Initialize(){
        this.pathfinding = new Pathfinding();

        this.mesh.traverse( ( node ) => {
            if(node.isMesh){
                this.pathfinding.setZoneData(this.zone, Pathfinding.createZone(node.geometry));
            }
        });
    }

    GetRandomNode(p, range){
        const groupID = this.pathfinding.getGroup(this.zone, p);
        return this.pathfinding.getRandomNode(this.zone, groupID, p, range);
    }

    FindPath(a, b){
        const groupID = this.pathfinding.getGroup(this.zone, a);
        const path = this.pathfinding.findPath(a, b, this.zone, groupID);

        if (path)
            return path;

        const closestStartNode = this.pathfinding.getClosestNode(a, this.zone, groupID, false);
        const closestEndNode = this.pathfinding.getClosestNode(b, this.zone, groupID, false);

        return this.pathfinding.findPath(closestStartNode.centroid, closestEndNode.centroid, this.zone, groupID);
    }
}
