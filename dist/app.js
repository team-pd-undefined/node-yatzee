"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = __importDefault(require("lodash"));
var express_1 = __importDefault(require("express"));
var player_1 = __importDefault(require("./model/player"));
var express_2 = require("express");
var body_parser_1 = __importDefault(require("body-parser"));
var path_1 = __importDefault(require("path"));
var morgan_1 = __importDefault(require("morgan"));
var app = express_1.default();
var router = express_2.Router();
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.use(morgan_1.default('dev'));
app.use(router);
app.use(express_1.default.static(path_1.default.join(__dirname, '../public')));
app.use(express_1.default.static(path_1.default.join(__dirname, '../views')));
var players = [];
var seq = 0;
var total = function (eyes) {
    return lodash_1.default.reduce(eyes, function (sum, eye) { return sum + eye; }, 0);
}, upper = function (n, eyes) {
    return lodash_1.default.chain(eyes)
        .filter(function (eye) { return eye == n; })
        .reduce(function (sum, eye) { return sum + eye; }, 0)
        .value();
}, nkind = function (n, eyes) {
    return lodash_1.default.chain(eyes)
        .countBy(function (eye) { return eye; })
        .find(function (count) { return count >= n; })
        .value();
}, akind = function (n, eyes) {
    return nkind(n, eyes) ? total(eyes) : 0;
}, contain = function (sets, score, eyes) {
    return lodash_1.default.some(sets, function (set) {
        return lodash_1.default.isEmpty(lodash_1.default.difference(set, eyes));
    }) ? score : 0;
};
var rules = [
    lodash_1.default.partial(upper, 1),
    lodash_1.default.partial(upper, 2),
    lodash_1.default.partial(upper, 3),
    lodash_1.default.partial(upper, 4),
    lodash_1.default.partial(upper, 5),
    lodash_1.default.partial(upper, 6),
    lodash_1.default.partial(akind, 3),
    lodash_1.default.partial(akind, 4),
    function (eyes) {
        var counts = lodash_1.default.chain(eyes).countBy(function (eye) { return eye; });
        if (counts.find(function (count) { return count == 2; }).value()
            && counts.find(function (count) { return count == 3; }).value()) {
            return 25;
        }
        return 0;
    },
    lodash_1.default.partial(contain, [[1, 2, 3, 4], [2, 3, 4, 5], [3, 4, 5, 6]], 30),
    lodash_1.default.partial(contain, [[1, 2, 3, 4, 5], [2, 3, 4, 5, 6]], 40),
    function (eyes) { return nkind(5, eyes) ? 50 : 0; },
    total
];
app.get('/enroll', function (req, res) {
    players.push(new player_1.default(seq));
    res.json({
        id: seq++
    });
});
app.get('/players', function (req, res) {
    res.json(players);
});
app.post('/:user/roll', function (req, res) {
    var id = req.params.user, eyes = req.body, player = lodash_1.default.find(players, function (player) { return player.id == id; });
    if (!player) {
        return;
    }
    if (player.turn < 3) {
        lodash_1.default.map(eyes, function (eye) {
            return lodash_1.default.extend(eye, { eye: eye.status === 'hold' ? eye.eye : Math.floor(Math.random() * 6) });
        });
        player.turn++;
    }
    res.json(eyes);
});
app.post('/:user/decision', function (req, res) {
    var id = req.params.user, decision = req.body, player = lodash_1.default.find(players, function (player) { return player.id == id; });
    if (!player) {
        return;
    }
    player.game[decision.slot] = rules[decision.slot](lodash_1.default.map(decision.dices, function (dice) { return dice.eye + 1; }));
    player.turn = 0;
    res.json({
        slot: decision.slot,
        point: player.game[decision.slot]
    });
});
/// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.sendfile('views/error.html');
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.sendfile('views/error.html');
});
exports.default = app;
//# sourceMappingURL=app.js.map