function update(state) {
    state.playing = updatePlayingStatus(state);
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
        console.log('New song detected. Notifying!', playingPrevious, playingNow);
        var artist = 'SoundCloud Now Playing';
        var song = playingNow;

        var sendDefaultNotification = function() {
            var artistElement = document.querySelector('.soundTitle__usernameText');
            var songElement = document.querySelector('.compactTrackListItem__trackTitle');
            artist = artistElement ? artistElement.innerText : artist;
            song = songElement ? songElement.innerText : song;

            notify(artist, song);
        };

        try {
            var nowPlayingAvatarElement = document.querySelector('.playbackSoundBadge__avatar');
            if (!nowPlayingAvatarElement) {
                throw new NotificationException('Now playing avatar element not found');
            }

            var songUrl = nowPlayingAvatarElement.getAttribute('href');

            if (!songUrl) {
                throw new NotificationException('Song URL not found');
            }

            var q = songUrl.indexOf('?');
            songUrl = q > -1 ? songUrl.substring(0, q) : songUrl;

            var xhr = new XMLHttpRequest();
            xhr.addEventListener('load', function(e) {
                try {
                    var json = JSON.parse(this.responseText);

                    if (!json || !json['author_name']) {
                        throw new NotificationException('Invalid JSON', { json : json, text : this.responseText });
                    }

                    artist = json['author_name'];
                } catch (e) {
                    console.error(e);
                }

                notify(artist, song);
            });
            xhr.open('GET', 'https://soundcloud.com/oembed?format=json&url=https%3A%2F%2Fsoundcloud.com' + encodeURI(songUrl));
            xhr.send();
        } catch (e) {
            console.error(e);
            sendDefaultNotification();
        }
    }

    return playingNow;
}

function updatePlayingStatus(state) {
    try {
        var playControlsContainer = document.querySelector('.playControls.m-visible');
        if (!playControlsContainer) {
            throw new PlayControlException('Found no visible play controls.');
        }

        var playControls = document.getElementsByClassName('playControl');

        if (!playControls || playControls.length == 0) {
            throw new PlayControlException('Found no play control.');
        }

        var playControl = playControls[0];
        var playing = playControl.title.match(/pause/i);
        var paused = playControl.title.match(/play/i);

        if (playing && !state.playing) {
            console.log('Play state change detected: Playing.');
            window.fluid.dockBadge = '\u25b6';
            state.playing = true;
        } else if (paused && state.playing) {
            console.log('Play state change detected: Paused.');
            window.fluid.dockBadge = 'II';
            state.playing = false;
        } else if (!playing && !paused) {
            throw new PlayControlException('The play control had an unexpected title.', playControls);
        }
    } catch (e) {
        console.error('Play state change detected: Stopped.', e);
        window.fluid.dockBadge = '\u25fc';
        state.playing = false;
    }

    return state.playing;
}

function NotificationException(message, data) {
    this.message = message;
    this.data = data;
    this.toString = function() {
        return this.message;
    };
}

function PlayControlException(message, playControls) {
    this.message = message;
    this.playControls = playControls;
    this.toString = function() {
        return this.message;
    };
}

setTimeout(update, 1000, {});