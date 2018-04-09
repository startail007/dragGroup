function elementExtend() {
    var _super_ = {
        addEventListener: Element.prototype.addEventListener,
        removeEventListener: Element.prototype.removeEventListener
    }
    Element.prototype.enabled = true;
    Element.prototype.childenabled = true;

    Element.prototype.getChildenabled = function () {
        var temp = this.parentElement;
        var child = true;
        while (temp) {
            if (!temp.childenabled) {
                child = false;
                break;
            }
            temp = temp.parentElement;
        }
        return child;
    }

    Element.prototype.listeners = [];
    Element.prototype.addEventListener = function (type, listener, useCapture) {
        this.listeners.push({
            type: type,
            original: listener,
            extend: listener01
        });
        _super_.addEventListener.apply(this, [type, listener01, useCapture]);

        function listener01(e) {
            if (this.enabled && this.getChildenabled()) {
                listener.call(this,e);
            }
        }
    }

    Element.prototype.removeEventListener = function (type, listener, useCapture) {
        for (var i = 0; i < this.listeners.length; i++) {
            if (this.listeners[i].type === type && this.listeners[i].original === listener) {
                _super_.removeEventListener.apply(this, [type, this.listeners[i].extend, useCapture]);
                this.listeners.splice(i, 1);
                break;
            }
        }
    }
}
elementExtend();
