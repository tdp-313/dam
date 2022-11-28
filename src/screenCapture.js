

// Options for getDisplayMedia()
const video_start = () => {
    const videoElem = document.getElementById("Picture_in_Picture_video");
    const startElem = document.getElementById("Picture_in_Picture_start");
    const stopElem = document.getElementById("Picture_in_Picture_stop");
    startElem.addEventListener("click", function (evt) {
        startCapture();
    }, false);

    stopElem.addEventListener("click", function (evt) {
        stopCapture();
    }, false);

    var displayMediaOptions = {
        video: {
            cursor: "always"
        },
        audio: false
    };
    
    // Set event listeners for the start and stop buttons
    
    async function startCapture() {
    
        try {
            videoElem.srcObject = await navigator.mediaDevices.getDisplayMedia(displayMediaOptions);
            dumpOptionsInfo();
        } catch (err) {
            console.error("Error: " + err);
        }
    }
    
    
    function stopCapture(evt) {
        let tracks = videoElem.srcObject.getTracks();
    
        tracks.forEach(track => track.stop());
        videoElem.srcObject = null;
    }
}
