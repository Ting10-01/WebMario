import GameMgr from "./GameMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Seed extends cc.Component {
    @property(cc.Node)
    gameMgr: cc.Node = null;

    @property({type:cc.AudioClip})
    shootSound: cc.AudioClip = null;
    
    private bound: boolean = false;
    private anim = null;
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 100);
    }
    
    update(){
        if(this.bound){
            this.node.x = 200;
            this.node.y = -190;
            this.bound = false;
            cc.audioEngine.playEffect(this.shootSound, false);
        }
    }

    updatepos(){
        this.bound = true;
    }
}
