const {ccclass, property} = cc._decorator;

@ccclass
export default class Seed extends cc.Component {
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    down(){
        let random = -50+Math.random()*100;
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(random, -300);
    }
}
