import GameMgr from "./GameMgr";
import mushroom from "./mushroom";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Player extends cc.Component {
    @property(cc.Node)
    private camera: cc.Node = null;
    @property(cc.Node)
    gameMgr: cc.Node = null;
    @property({type:cc.AudioClip})
    jumpSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    kickSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    coinSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    dieSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    reserveSound: cc.AudioClip = null;
    @property({type:cc.AudioClip})
    mushSound: cc.AudioClip = null;
    @property(cc.Node)
    Mushroom: cc.Node = null;
    private idleFrame: cc.SpriteFrame = null;
    private anim = null;
    private playerSpeed: number  = 0;
    private zDown: boolean = false;
    private xDown: boolean = false;
    private spaceDown: boolean = false;
    private isDead: boolean = false;
    private onGround: boolean = false;
    private isEnemy: boolean = false;
    private iscoin1: boolean = false;
    private iscoin2: boolean = false;
    private israndom: boolean = false;
    private levelclear: boolean = false;
    
    start() {
        this.idleFrame = this.getComponent(cc.Sprite).spriteFrame;
    }
    
    onLoad () {
        cc.director.getPhysicsManager().enabled = true;
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        this.camera.x = -290;
        this.anim = this.getComponent(cc.Animation);
        this.anim.play("player");
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
        
        this.node.x += this.playerSpeed * dt;

        if(this.spaceDown && this.onGround && this.node.y>-250)
            this.jump();
    }

    playerAnimation() {
        if(!this.onGround)
            this.anim.play("player_jump");
        else if(this.zDown || this.xDown){
            if(!this.anim.getAnimationState("player").isPlaying)
                this.anim.play("player");
        } 
        else{
           this.anim.stop();
           this.getComponent(cc.Sprite).spriteFrame = this.idleFrame;
        }
    }

    private jump() {
        this.onGround = false;
        cc.audioEngine.playEffect(this.jumpSound, false);
        this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 1000);
    }

    update (dt) {
        this.playerMovement(dt);
        this.playerAnimation();
        if(this.isEnemy){
            if(this.gameMgr.getComponent("GameMgr").playerLife == 1)
                this.camera.x = -600;
            else
                this.camera.x = -900;
            if(!this.isDead){
                this.isDead = true;
                this.scheduleOnce(function() {
                    this.node.x = -380;
                    this.node.y = -180;
                    this.gameMgr.getComponent("GameMgr").updateLife(-1);
                    if(this.gameMgr.getComponent("GameMgr").playerLife == 0)
                        this.gameMgr.getComponent("GameMgr").gameover();
                    else
                        this.camera.x =  -209;
                    this.isEnemy = false;
                    this.isDead = false;
                }, 2)
            }
        }
        else{
            if(this.node.x < -209)
                this.camera.x = -209;
            else if(this.node.x > 780){
                this.camera.x = 780;
                if(this.node.x>900 && !this.levelclear){
                    this.levelclear = true;
                    this.gameMgr.getComponent("GameMgr").finish();
                }
            }
            else
                this.camera.x = this.node.x;
        }
    }

    onBeginContact(contact, self, other) {
        if(other.node.name=="stage1")
            this.onGround = true;
        else if(other.node.name == "turtle1") {
            if(!Math.abs(contact.getWorldManifold().normal.y)){
                cc.audioEngine.playEffect(this.dieSound, false);
                this.isEnemy = true;
            }
            else{
                cc.audioEngine.playEffect(this.kickSound, false);
                this.getComponent(cc.RigidBody).linearVelocity = cc.v2(0, 500);
            }
        }
        else if(other.node.name=="flower" || other.node.name=="seed"){
            cc.audioEngine.playEffect(this.dieSound, false);
            this.isEnemy = true;
        }
        else if(other.node.name=="block_coin1") {
            if(contact.getWorldManifold().normal.y==1 && !this.iscoin1){
                this.gameMgr.getComponent("GameMgr").updateCoin();
                this.iscoin1 = true;
                other.node.getComponent(cc.Animation).play("block_");
                cc.audioEngine.playEffect(this.coinSound, false);
            }
            else
                this.onGround = true;
        }
        else if(other.node.name=="block_coin2") {
            if(contact.getWorldManifold().normal.y==1 && !this.iscoin2){
                this.gameMgr.getComponent("GameMgr").updateCoin();
                this.iscoin2 = true;
                other.node.getComponent(cc.Animation).play("block_");
                cc.audioEngine.playEffect(this.coinSound, false);
            }
            else
                this.onGround = true;
        }
        else if(other.node.name == "block_random") {
            if(contact.getWorldManifold().normal.y==1 && !this.israndom){
                let random = Math.floor(Math.random()*2);
                if(random == 0){
                    cc.audioEngine.playEffect(this.reserveSound, false);
                    this.gameMgr.getComponent("GameMgr").updateLife(1);
                }
                else{
                    cc.audioEngine.playEffect(this.mushSound, false);
                    this.Mushroom.getComponent("mushroom").down();
                }
                this.israndom = true;
                other.node.getComponent(cc.Animation).play("block_");
            }
            else if(contact.getWorldManifold().normal.y == -1)
                this.onGround = true;
        }
        else if(other.node.name == "mushroom"){
            cc.audioEngine.playEffect(this.dieSound, false);
            this.isEnemy = true;
        }
    }
}