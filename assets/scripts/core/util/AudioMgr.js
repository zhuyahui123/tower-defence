
module.exports = {
    _menuSoundID: null,
    playMenuMusic() {
        if (this._menuSoundID === null) {
            let url = cc.url.raw("resources/matchAni/mp3/music_menu.mp3");
            this._menuSoundID = cc.audioEngine.playMusic(url, true);
        }
        this.updateVolume();
    },
    updateVolume() {
        if (true) {
            cc.audioEngine.setMusicVolume(1);
            cc.audioEngine.setEffectsVolume(1);
        } else {
            cc.audioEngine.setMusicVolume(0);
            cc.audioEngine.setEffectsVolume(0);
        }
    },
    playGameMusic() {
        if (this._menuSoundID !== null) {
            cc.audioEngine.stopMusic(this._menuSoundID);
            this._menuSoundID = null;
        }
        let url = cc.url.raw("resources/matchAni/mp3/music_game.mp3");
        cc.audioEngine.playMusic(url, true);
        this.updateVolume();
    },
    playNorBtnEffect(){
        let url = cc.url.raw("resources/matchAni/mp3/click.mp3");
        cc.audioEngine.playEffect(url, false);
        this.updateVolume();
    },
}