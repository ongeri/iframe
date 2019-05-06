var packIframes = function (win) {
    var i, frame;
    var frames = [];
    console.log(document.referrer);
    console.log(win.frames[0].location.href + "----" + win.frames[1].location.href);
    for (i = 0; i < win.frames.length; i++) {
        frame = win.frames[i];

        try {

            frames.push(frame);
        }
        catch (e) {
            //ignore exp
            console.log("exception " + e);
        }
    }
    return frames;

};

module.exports = {
    packIframes: packIframes
};
