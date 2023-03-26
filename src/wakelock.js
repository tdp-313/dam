let wakeLock = null;


const wakelockRequest = async () => {
    //console.log("ScreenLockRequest");
    try {
        screenLockToggle = true;
        if (document.visibilityState === 'visible') {
            wakeLock = await navigator.wakeLock.request('screen');
            $('#screenLock_Icon').css('color', 'green');
        }
    } catch (err) {
        console.error(err);
    }
}
const wakelockRelease = async () => {
    wakeLock.release()
        .then(() => {
            wakeLock = null;
            screenLockToggle = false;
            $('#screenLock_Icon').css('color', 'red');
        });
}

document.addEventListener('visibilitychange', async (e) => {
    if (document.visibilityState === 'visible') {
        if (wakeLock !== null) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('ScreenLock OK');
        }
        
    } else {
        //hidden

    }
    worker.postMessage({ visibilitychange: document.visibilityState ,nowPage:""});
});