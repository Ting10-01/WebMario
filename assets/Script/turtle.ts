import GameMgr from "./GameMgr";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Turtle extends cc.Component {
    @property(cc.Node)
    gameMgr: cc.Node = null;

    private anim = null;
    private rebornPos = null;
    private isDead = true;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.rebornPos = this.node.position;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-50, 0);
        this.isDead = false;        
    }

    update (dt) {
        if(this.isDead){
            this.node.x = -700;
            this.node.y = -700;
            this.gameMgr.getComponent("GameMgr").updateScore(100);
            this.scheduleOnce(function() {
                this.resetPos();
            }, 2);
            this.isDead = false;
        }
        
    }

    public resetPos() {
        this.node.position = this.rebornPos;
        this.node.scaleX = 1;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-50, 0);
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "l_bound") {
            this.isDead = false;
            this.node.scaleX = -1;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(50, 0);
        }else if(other.node.name == "r_bound"){
            this.isDead = false;
            this.node.scaleX = 1;
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-50, 0);
        }else if(other.node.name=="player" && !Math.abs(contact.getWorldManifold().normal.x))
            this.isDead = true;
    }
}
