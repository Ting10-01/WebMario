const {ccclass, property} = cc._decorator;

@ccclass
export default class GoombaFly extends cc.Component {
    @property(cc.Node)
    gameMgr: cc.Node = null;
    private change_dir: boolean = true;
    private random_x: number = 0;
    private random_y: number = 0;

    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
    }

    update(){
        if(this.change_dir){
            this.random_x = -100+Math.random()*200;
            this.random_y = -100+Math.random()*200;
            if(this.node.x <-580)
                this.random_x = Math.abs(this.random_x);
            else if(this.node.x>150 && this.random_x>0)
                this.random_x = this.random_x * (-1);
            if(this.node.y < -175)
                this.random_y = Math.abs(this.random_y);
            else if(this.node.y>130 && this.random_y>0)
                this.random_y = this.random_y * (-1);
            this.change_dir = false;
        }
        this.node.getComponent(cc.RigidBody).linearVelocity = cc.v2(this.random_x, this.random_y);
    }

    onBeginContact(contact, self, other) {
        if(other.node.name=="range" || other.node.name=="bg")
            this.change_dir = true;
    }
}
