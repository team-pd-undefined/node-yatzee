import _ from 'lodash';
import express from 'express';
import Player from './model/player';
import {Request, Response, Router} from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';

const app = express();
const router = Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded())
app.use(logger('dev'));
app.use(router);
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.static(path.join(__dirname, '../views')));


const players: Array<Player> = [];
let seq = 0;

const total = function (eyes: Array<number>) {
      return _.reduce(eyes, function (sum, eye) { return sum + eye; }, 0);
    },
    upper = function (n: number, eyes: Array<number>) {
      return _.chain(eyes)
          .filter(function (eye) { return eye == n; })
          .reduce(function (sum, eye) { return sum + eye; }, 0)
          .value();
    },
    nkind = function (n: number, eyes: Array<number>) {
      return _.chain(eyes)
          .countBy(function (eye) { return eye; })
          .find(function (count) { return count >= n; })
          .value();
    },
    akind = function (n: number, eyes: Array<number>) {
      return nkind(n, eyes) ? total(eyes) : 0;
    },
    contain = function (sets: Array<Array<number>>, score: number, eyes: Array<number>) {
      return _.some(sets, function (set) {
          return _.isEmpty(_.difference(set, eyes));
      }) ? score : 0;
    };


const rules = [
  _.partial(upper, 1),
  _.partial(upper, 2),
  _.partial(upper, 3),
  _.partial(upper, 4),
  _.partial(upper, 5),
  _.partial(upper, 6),
  _.partial(akind, 3),
  _.partial(akind, 4),
  function (eyes: Array<number>) {
    var counts = _.chain(eyes).countBy(function (eye) { return eye; });

    if (counts.find(function (count) { return count == 2; }).value()
        && counts.find(function (count) { return count == 3; }).value()) {
        return 25;
    }

    return 0;
  },
  _.partial(contain, [[1,2,3,4], [2,3,4,5], [3,4,5,6]], 30),
  _.partial(contain, [[1,2,3,4,5], [2,3,4,5,6]], 40),
  function (eyes: Array<number>) { return nkind(5, eyes) ? 50 : 0; },
  total
];

app.get('/enroll', function (req: Request, res: Response) {
  players.push(new Player(seq));

  res.json({
    id : seq++
  });
});

app.get('/players', function(req: Request, res: Response) {
  res.json(players);
});

app.post('/:user/roll', function(req: Request, res: Response) {

  const id = req.params.user,
    eyes = req.body,
    player = _.find(players, function (player) { return player.id == id; });
  if(!player) {
    return;
  }
  if (player.turn < 3) {
    _.map(eyes, function (eye) {
        return _.extend(eye, { eye : eye.status === 'hold' ? eye.eye : Math.floor(Math.random() * 6) });
    })

    player.turn++;
  }

  res.json(eyes);
});

app.post('/:user/decision', function(req: Request, res: Response) {
  const id = req.params.user,
      decision = req.body,
      player = _.find(players, function (player) { return player.id == id; });
  
  if(!player) {
    return;
  }

  player.game[decision.slot] = rules[decision.slot](_.map(decision.dices, function (dice) { return dice.eye + 1; }));
  player.turn = 0;

  res.json({
    slot : decision.slot,
    point : player.game[decision.slot]
  });
});

/// catch 404 and forward to error handler
app.use(function(req: Request, res: Response, next: Function) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development') {
  app.use(function(err: Error, req: Request, res: Response, next: Function) {
    res.status(err.status || 500);
    res.sendfile('views/error.html');
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err: Error, req: Request, res: Response, next: Function) {
  res.status(err.status || 500);
  res.sendfile('views/error.html');
});

export default app