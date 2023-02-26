let wakeLock = null;

// 非同期関数を作成して起動ロックをリクエスト
const wakelockRequest = async () => {
    try {
        wakeLock = await navigator.wakeLock.request('screen');
        screenLockToggle = true;
        $('#screenLock_Icon').css('color', 'green');
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
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        wakeLock = await navigator.wakeLock.request('screen');
        console.log('ScreenLock OK');
    }
});