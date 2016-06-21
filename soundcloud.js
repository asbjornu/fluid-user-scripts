function resetDockBadge() {
    if (arguments.length > 0) {
        console.log(arguments);
    }

    window.fluid.dockBadge = '\u25fc';
    return false;
}

function update(state) {
    state.playing = updatePlayingStatus();
    state.playingNow = state.playing
                     ? notifyPlayingNow(state.playingNow)
                     : state.playingNow;

    setTimeout(update, 500, state);
}

function notify(title, text) {
    if (!window.Notification) {
        console.log('Notifications not supported.');
        return;
    }

    if (Notification.permission === 'denied') {
        console.log('Notifications denied.')
    } else if (Notification.permission === 'default') {
        Notification.requestPermission(function() {
            notify(text);
        });
    } else if (Notification.permission === 'granted') {
        var image = null;
        var notification = window.webkitNotifications.createNotification(image, title, text);

        /*notification.onclick = function() {
            alert(1);
        };*/

        // console.log(notification);

        try {
            notification.show();
        } catch (e) {
            console.error(e);
        }
    }
}

function notifyPlayingNow(playingPrevious) {
    var playbackSoundBadge = document.querySelector('.playbackSoundBadge span[aria-hidden="true"]');

    if (!playbackSoundBadge) {
        console.error('Found no playback sound badge.')
        return null;
    }

    var playingNow = playbackSoundBadge.innerText;

    if (playingNow !== playingPrevious) {
        console.log('New song detected. Notifying!', playingPrevious, playingNow)
        var dashIndex = playingNow.indexOf('-');
        var artist = dashIndex > -1 ? playingNow.substring(0, dashIndex - 1) : 'SoundCloud Now Playing'
        var song = dashIndex > -1 ? playingNow.substring(dashIndex + 1) : playingNow;
        notify(artist, song);
    }

    return playingNow;
}

function updatePlayingStatus() {
    var playControlsContainer = document.querySelector('.playControls.m-visible');

    if (!playControlsContainer) {
        return resetDockBadge('Found no visible play controls.');
    }

    var playControls = document.getElementsByClassName('playControl');

    if (!playControls || playControls.length == 0) {
        return resetDockBadge('Found no play control.');
    }

    var playControl = playControls[0];
    var playing = playControl.title.match(/pause/i);
    var paused = playControl.title.match(/play/i);

    if (playing) {
        window.fluid.dockBadge = '\u25b6';
        return true;
    } else if (paused) {
        window.fluid.dockBadge = 'II';
    } else {
        return resetDockBadge('The play control had an unexpected title.', playControl);
    }

    return false;
}

setTimeout(update, 1000, {});