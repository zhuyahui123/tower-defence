module.exports = {
    _frame: null,
    getWebContent(url) {
        url = "http://tidys.gitee.io/noticetest/notice1.txt";
        if (this._frame === null) {
            this._frame = document.createElement("iframe");
            this._frame.src = url;
            this._frame.id = 'gitPages';
            this._frame.style.display = "none";
            this._frame.onload = function () {
                console.log("load");
                let page = document.getElementById('gitPages');

            }.bind(this);
            document.body.appendChild(this._frame);
            this._frame.documentElement;
        } else {
            this._frame.src = url;
            this._frame.style.display = "none";
        }
    },
};