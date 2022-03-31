import { write } from "fs";
import { connect } from "http2";

const {ccclass, property} = cc._decorator;
@ccclass
export default class GameMgr extends cc.Component {

    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;

    @property({type:cc.AudioClip})
    clearSound: cc.AudioClip = null;

    @property(cc.Node)
    scoreNode: cc.Node = null;

    @property(cc.Node)
    lifeNode: cc.Node = null;

    @property(cc.Node)
    timeNode: cc.Node = null;

    @property(cc.Node)
    coinNode: cc.Node = null;

    @property(cc.Node)
    resultNode: cc.Node = null;
    
    score: number = 0;
    playerLife: number = 3;    
    private startTime: number;
    private finishTime: number;
    private time: number = 0;
    private coin: number = 0;

    updateScore(score: number) {
        this.score = this.score + score;
        if(this.score < 9999999){
            this.scoreNode.getComponent(cc.Label).string = (Array(7).join("0") + this.score.toString()).slice(-7);
            firebase.database().ref(firebase.auth().currentUser.email.replace(".", "")).update({   
                "score": this.score
            });
        }
    }

    updateLife(num: number) {
        this.playerLife += num;
        this.lifeNode.getComponent(cc.Label).string = this.playerLife.toString().slice(-1);
        firebase.database().ref(firebase.auth().currentUser.email.replace(".", "")).update({
            "life": this.playerLife
        });
    }

    updateTime() {
        this.time =  Math.trunc((this.finishTime-this.startTime)/1000);
        if(15-this.time >= 0)
            this.timeNode.getComponent(cc.Label).string = (Array(2).join("0") + (15-this.time).toString()).slice(-2);
    }

    updateCoin() {
        this.coin += 1;
        this.coinNode.getComponent(cc.Label).string = this.coin.toString().slice(-1);
        firebase.database().ref(firebase.auth().currentUser.email.replace(".", "")).update({
            "coin": this.coin
        });
    }

    finish() {
        cc.audioEngine.pauseMusic();
        cc.audioEngine.playEffect(this.clearSound, false);
        this.score = this.score+this.playerLife*300+(15-this.time)*1000+this.coin*50;
        this.scheduleOnce(function() {
            cc.director.loadScene("Level");
        }, 5)
        firebase.database().ref(firebase.auth().currentUser.email.replace('.', '')).update({
            "life": this.playerLife,
            "coin": this.coin,
            "score": this.score
        });
    }

    gameover() {
        cc.director.loadScene("Level");
        firebase.database().ref(firebase.auth().currentUser.email.replace('.', '')).update({
            "life": 3,
            "coin": 0,
            "score": 0
        });
        /*firebase.database().ref(firebase.auth().currentUser.email.replace(".", "")).once('value').then((snapshot)=> {
            this.playerLife = snapshot.child('life').val();
            this.coin = snapshot.child('coin').val();
            this.score = snapshot.child('score').val();
            this.lifeNode.getComponent(cc.Label).string = this.playerLife.toString().slice(-1);
            this.coinNode.getComponent(cc.Label).string = this.coin.toString().slice(-1);
            this.scoreNode.getComponent(cc.Label).string = (Array(7).join("0") + this.score.toString()).slice(-7);
        });*/
    }

    update (dt) {
        this.finishTime = new Date().getTime();
        this.updateTime();
    }
    
    start() {
        this.startTime = new Date().getTime();
        cc.audioEngine.playMusic(this.bgm, true);
    }

    onLoad() {
        firebase.database().ref(firebase.auth().currentUser.email.replace(".", "")).once('value').then((snapshot)=> {
            this.playerLife = snapshot.child('life').val();
            this.coin = snapshot.child('coin').val();
            this.score = snapshot.child('score').val();
            this.lifeNode.getComponent(cc.Label).string = this.playerLife.toString().slice(-1);
            this.coinNode.getComponent(cc.Label).string = this.coin.toString().slice(-1);
            this.scoreNode.getComponent(cc.Label).string = (Array(7).join("0") + this.score.toString()).slice(-7);
        });
    }
}
