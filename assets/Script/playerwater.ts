import GameMgr from "./GameMgr";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    private camera: cc.Node = null;
    @property(cc.Node)
    gameMgr: cc.Node = null;
    private playerSpeed: number  = 0;
    private zDown: boolean = false;
    private xDown: boolean = false;
    private spaceDown: boolean = false;
    private isDead: boolean = false;
    private isEnemy: boolean = false;
    private levelclear: boolean = false;
    
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.camera.x = -560;
    }

    onKeyDown(event) {
        if(event.keyCode == cc.macro.KEY.z) {
            this.zDown = true;
            this.xDown = false;
        } else if(event.keyCode == cc.macro.KEY.x) {
            this.xDown = true;
            this.zDown = false;
        } else if(event.keyCode == cc.macro.KEY.space)
            this.spaceDown = true;
    }

    onKeyUp(event) {
        if(event.keyCode == cc.macro.KEY.z)
            this.zDown = false;
        else if(event.keyCode == cc.macro.KEY.x)
            this.xDown = false;
        else if(event.keyCode == cc.macro.KEY.space)
            this.spaceDown = false;
    }

    private playerMovement(dt) {
        this.playerSpeed = 0;
        if(this.zDown){
            this.playerSpeed = -100;
            this.node.scaleX = -1;
        }
        else if(this.xDown){
            this.playerSpeed = 100;
            this.node.scaleX = 1;
        }
        if(this.spaceDown)
            this.node.y += -3;
        else
            this.node.y -= -1;
        
        this.node.x += this.playerSpeed * dt;
    }

    update (dt) {
        this.playerMovement(dt);
        if(this.node.y > 75)
            this.isEnemy = true;
        if(this.isEnemy){
            if(this.gameMgr.getComponent("GameMgr").playerLife == 1)
                this.camera.x = -1070;
            else
                this.camera.x = -1360;
            
            if(!this.isDead){
                this.isDead = true;
                this.scheduleOnce(function() {
                    this.node.x = -750;
                    this.node.y = 0;
                    this.gameMgr.getComponent("GameMgr").updateLife(-1);
                    if(this.gameMgr.getComponent("GameMgr").playerLife == 0)
                        this.gameMgr.getComponent("GameMgr").gameover();
                    this.isEnemy = false;
                    this.isDead = false;
                }, 2)
            }
        }
        else{
            if(this.node.x < -560)
                this.camera.x = -560;
            else if(this.node.x > 560){
                this.camera.x = 560;
                if(this.node.x>700 && !this.levelclear){
                    this.levelclear = true;
                    this.gameMgr.getComponent("GameMgr").finish();
                }
            }
            else
                this.camera.x = this.node.x;
        }
    }

    onBeginContact(contact, self, other) {
        if(other.node.name=="goomba" || other.node.name=="goombafly")
            this.isEnemy = true;
    }
}