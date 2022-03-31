const {ccclass, property} = cc._decorator;

@ccclass
export default class Menu extends cc.Component {
    loadGameScene1(){
        cc.director.loadScene("Stage1");
    }
    loadGameScene2(){
        cc.director.loadScene("Stage2");
    }
}
