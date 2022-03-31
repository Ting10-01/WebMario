const {ccclass, property} = cc._decorator;

@ccclass
export default class Goomba extends cc.Component {
    @property(cc.Node)
    gameMgr: cc.Node = null;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    start () {
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(30, 0);
    }

    onBeginContact(contact, self, other) {
        if(other.node.name == "l_bound")
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(30, 0);
        else if(other.node.name == "bg")
            this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(-30, 0);
    }
}
