// Copied from: http://solovyov.net/en/2016/fluid-gmail/
//
// Must be configured to work on the following domain patterns:
// *google.com*mail*
// *gmail.com*
// *mail.google.com*

function getUnread() {
    var inbox = document.querySelector('a[title^="Innboks"]');
    var m = inbox.title.match(/Innboks \((\d+)\)/);

    return m ? parseInt(m[1], 10) : 0;
}

function setBadge(count) {
    window.fluid.dockBadge = count ? '' + count : '';
}

function updateDockBadge() {
    setBadge(getUnread());
    setTimeout(updateDockBadge, 1000);
}

setTimeout(updateDockBadge, 1000);