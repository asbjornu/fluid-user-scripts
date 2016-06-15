// Must be configured to work on the following domain patterns:
// *messenger.com*

window.fluid.dockBadge = '';
var count;
setInterval(updateDockBadge, 500);

function updateDockBadge() {
    var els = document.getElementsByClassName('_1ht3');

    if (els.length > count) {
        window.console.log('notifying');
        for (i = 0; i < els.length - count; i++) {
            var notifEl = els[i];
            var titleel = notifEl.getElementsByClassName('_1ht6')[0];
            var textel = notifEl.getElementsByClassName('_1htf')[0];
            window.console.log(titleel.innerText, textel.innerText);
            var title = titleel.innerText;
            var text = textel.innerText;
            window.webkitNotifications.createNotification('', title, text).show();
        }
    }

    count = els.length;
    window.fluid.dockBadge = count > 0 ? count : '';
}