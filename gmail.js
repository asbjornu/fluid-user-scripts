// From: https://gist.github.com/kirbysayshi/5356592

window.fluid.dockBadge = '';
setTimeout(updateDockBadge, 1000);
setTimeout(updateDockBadge, 3000);
setInterval(updateDockBadge, 5000);

function updateDockBadge() {
    var navigation = document.querySelector('[role=navigation]')
    var doc = navigation.contentDocument || navigation.ownerDocument;

    if (!doc) { return; }

    var anchors = [].slice.call(doc.querySelectorAll('a'))

    var result = anchors.reduce(function(prev, curr, i) {
        var match = curr.innerText.match(/\s*Innboks\s*\((\d+)\)[^\d]*/)
        if (match) return match;
        else return prev;
    }, null);

    if (result && result[1]) {
        window.fluid.dockBadge = result[1];
    }
}
