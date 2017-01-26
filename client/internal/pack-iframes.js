var packIframes = function(win) {
    var i, frame;
    var frames = [];
    console.log("frame length "+win.frames.length);
    console.log(win.frames[0].location.href+"----");
    for(i=0;i<win.frames.length;i++) {
        frame = win.frames[i];

        try{
            
            frames.push(frame);
        }
        catch(e) {
            //ignore exp
            console.log("exception "+e);
        }
    }
    return frames;

};

module.exports = {
    packIframes : packIframes
};