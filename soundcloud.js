function updateDockBadge() {
    var playControls = document.getElementsByClassName('playControl');

    if (!playControls || playControls.length == 0) {
        console.log('Found no play control');
        window.fluid.dockBadge = '';
        return;
    }

    var playControl = playControls[0];
    var playing = playControl.title.match(/pause/i);
    var paused = playControl.title.match(/play/i);

    if (playing) {
        window.fluid.dockBadge = '\u27a4';
    } else if (paused) {
        window.fluid.dockBadge = '\u2016';
    } else {
        console.log('The play control had an unexpected title.', playControl);
        window.fluid.dockBadge = '';
    }

    setTimeout(updateDockBadge, 500);
}

setTimeout(updateDockBadge, 1000);