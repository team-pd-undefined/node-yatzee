"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Player = /** @class */ (function () {
    function Player(id, game, turn) {
        this.id = id || 0;
        this.game = game || [NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN, NaN];
        this.turn = turn || 0;
    }
    return Player;
}());
exports.default = Player;
//# sourceMappingURL=player.js.map