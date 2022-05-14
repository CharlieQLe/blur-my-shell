'use strict';

const { St, Shell } = imports.gi;
const Main = imports.ui.main;
const Background = imports.ui.background;

let sigma;
let brightness;

const UnlockDialog_proto = imports.ui.unlockDialog.UnlockDialog.prototype;
const original_createBackground = UnlockDialog_proto._updateBackgroundEffects;


var LockscreenBlur = class LockscreenBlur {
    constructor(connections, prefs) {
        this.connections = connections;
        this.prefs = prefs;
    }

    enable() {
        this._log("blurring lockscreen");

        brightness = this.prefs.lockscreen.CUSTOMIZE
            ? this.prefs.lockscreen.BRIGHTNESS
            : this.prefs.BRIGHTNESS;
        sigma = this.prefs.lockscreen.CUSTOMIZE
            ? this.prefs.lockscreen.SIGMA
            : this.prefs.SIGMA;

        this.update_lockscreen();
    }

    update_lockscreen() {
        UnlockDialog_proto._updateBackgroundEffects = this._createBackground;
    }

    _createBackground() {
        for (const widget of this._backgroundGroup) {
            const effect = widget.get_effect('blur');

            if (effect) {
                effect.set({
                    brightness: brightness,
                    sigma: sigma,
                });
            }
        }
    }

    set_sigma(s) {
        sigma = s;
        this.update_lockscreen();
    }

    set_brightness(b) {
        brightness = b;
        this.update_lockscreen();
    }

    disable() {
        this._log("removing blur from lockscreen");

        UnlockDialog_proto._updateBackgroundEffects = original_createBackground;

        this.connections.disconnect_all();
    }

    _log(str) {
        if (this.prefs.DEBUG)
            log(`[Blur my Shell] ${str}`);
    }
};