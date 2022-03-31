import GameMgr from "./GameMgr";
import seed from "./seed";
const {ccclass, property} = cc._decorator;

@ccclass
export default class Flower extends cc.Component {
    @property(cc.Node)
    gameMgr: cc.Node = null;
    @property(cc.Node)
    seedMgr: cc.Node = null;
    private anim = null;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 50);
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "u_bound")
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, -50);
        else if(other.node.name == "d_bound"){
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 50);
            this.seedMgr.getComponent("seed").updatepos();
        }
    }
}
