// Inspired by: http://solovyov.net/en/2016/fluid-gmail/

function getInboxLink() {
    var inboxLinks = document.querySelectorAll('a[href$="#inbox"]');

    if (!inboxLinks || inboxLinks.length == 0) {
        console.log('Could not find any inbox links.');
        return null;
    }

    for (var i = 0; i < inboxLinks.length; i++) {
        var link = inboxLinks[i];
        if (link.getAttribute('href') != '#inbox' && link.title == link.innerText) {
            return link;
        }
    }

    return null;
}


function getUnreadCount() {
    var inboxLink = getInboxLink();

    if (!inboxLink) {
        console.log('Could not find the inbox link.');
        return 0;
    }

    var m = inboxLink.title.match(/[^\(]*\((\d+)\)/);

    if (!m) {
        console.log('Could not find the count in the inbox element.');
        return 0;
    }

    return parseInt(m[1], 10);
}

function updateDockBadge() {
    var count = getUnreadCount();
    window.fluid.dockBadge = count && count > 0 ? '' + count : '';
    setTimeout(updateDockBadge, 1000);
}

setTimeout(updateDockBadge, 1000);