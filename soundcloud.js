function reset() {
    if (arguments.length > 0) {
        console.log(arguments);
    }

    window.fluid.dockBadge = '\u25fc';
    setTimeout(updateDockBadge, 500);
    return null;
}

function updateDockBadge() {
    var playControlsContainer = document.querySelector('.playControls.m-visible');

    if (!playControlsContainer) {
        return reset('Found no visible play controls');
    }

    var playControls = document.getElementsByClassName('playControl');

    if (!playControls || playControls.length == 0) {
        return reset('Found no play control');
    }

    var playControl = playControls[0];
    var playing = playControl.title.match(/pause/i);
    var paused = playControl.title.match(/play/i);

    if (playing) {
        window.fluid.dockBadge = '\u25b6';
    } else if (paused) {
        window.fluid.dockBadge = 'II';
    } else {
        return reset('The play control had an unexpected title.', playControl);
    }

    setTimeout(updateDockBadge, 500);
}

setTimeout(updateDockBadge, 1000);