const {ccclass, property} = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {
    @property({type:cc.AudioClip})
    bgm: cc.AudioClip = null;

    signup() {
        var Username = cc.find("Canvas/username/New EditBox/TEXT_LABEL").getComponent(cc.Label).string;
        var Email = cc.find("Canvas/email/New EditBox/TEXT_LABEL").getComponent(cc.Label).string;
        var Password = cc.find("Canvas/password/New EditBox").getComponent(cc.EditBox).string;
        if(Username!=null && Email!=null && Password!=null){
            firebase.auth().createUserWithEmailAndPassword(Email, Password).then(function () {
                alert("success");
            })
            .catch(function (error) {
                alert(error.message);
            });
            firebase.database().ref(Email.replace('.', '')).update({
                "username": Username,
                "life": 3,
                "coin": 0,
                "score": 0
            });
            firebase.database().ref('leader_board').child(Username);
            firebase.database().ref('leader_board').child(Username).set('0');
        }
    }

    login() {
        var Email = cc.find("Canvas/email/New EditBox/TEXT_LABEL").getComponent(cc.Label).string;
        var Password = cc.find("Canvas/password/New EditBox").getComponent(cc.EditBox).string;
        firebase.auth().signInWithEmailAndPassword(Email, Password).then(function () {
            this.bgm.pause();
            cc.director.loadScene("Level");
        }).catch(function (error) {
            alert(error.message);
        });
    }

    start() {
        cc.audioEngine.playMusic(this.bgm, true);
    }
}