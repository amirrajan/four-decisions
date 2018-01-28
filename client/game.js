import {
  each,
  filter,
  first,
  sortBy,
  last,
  concat,
  difference,
  reverse,
  orderBy
} from 'lodash';

export function sayHello() {
  return 'Oh Hai!!!';
}

export function tick(direction, gameState) {
  if (!gameState.currentCard[direction]) return gameState;

  return setNextSceneById(direction, gameState) ||
         setNextSceneByInline(direction, gameState) ||
         gameState;
}

function setNextSceneById(direction, gameState) {
  var nextScene = gameState.currentCard[direction].next;

  if (!gameState.cards[nextScene]) return false;

  gameState.currentCard = {
    id: nextScene,
    text: gameState.cards[nextScene].text,
    up: gameState.cards[nextScene].up,
    down: gameState.cards[nextScene].down,
    left: gameState.cards[nextScene].left,
    right: gameState.cards[nextScene].right
  };

  return gameState;
}

function log(message) {
  console.log("\n====================\n" +
              message +
              "\n====================\n");
}

function setNextSceneByInline(direction, gameState) {
  log('hodor');
  var nextScene = gameState.currentCard[direction].nextInline;

  if (!nextScene) return false;

  gameState.currentCard = {
    id: nextScene.id,
    text: nextScene.text,
    up: nextScene.up,
    down: nextScene.down,
    left: nextScene.left,
    right: nextScene.right
  }

  return gameState;
}

function cards() {
  return {
    'first-message': {
      text: ['serenity:',
             'communications repaired.',
             'mark: stable, in stasus.',
             'simone: stable, in stasus.',
             'will: no heartbeat.',
             'shiobhan: stable, in stasus.',
             'awaiting commands.'],
      right: { text: 'command: reanimate crew',
               next: 'adrenaline-injected' }
    },
    'first-crew-status': {
      text: ['mark: stable, in stasus.',
             'simone: stable, in stasus.',
             'will: no heartbeat.',
             'shiobhan: stable, in stasus.'],
      left: { text: 'back', next: 'first-message' }
    },
    'adrenaline-injected': {
      text: ['command has been sent.',
             'waiting for response.'],
      right: { text: 'sleep', next: 'day-1.5' }
    },
    'day-1.5': {
      text: [
        'a terminal light blinks.',
        'a distress signal.'
      ],
      right: { text: 'read distress', next: 'day-1.5-message' },
      down: { text: 'terminal',
              nextInline: terminalScene('day-1.5-terminal',
                                        'day-1.5') }
    },
    'day-1.5-message': {
      text: [
        'error code: 0x09'
      ],
      left: { text: 'back', next: 'day-1.5' },
      right: { text: 'wait', next: 'day-2' },
      down: { text: 'terminal',
              nextInline: terminalScene('day-1.5-message-terminal',
                                        'day-1.5-message') }
    },
    'day-2': {
      text: [
        'a terminal light blinks.',
        'a distress signal.'
      ],
      right: { text: 'read distress', next: 'day-2-message' }
    },
    'day-2-message': {
      text: [
        'mark:',
        'ne1 there!?'
      ],
      right: { text: 'reply', next: 'day-2-reply' }
    },
    'day-2-reply': {
      text: ["reply:",
             "yes, i'm here.",
             'we thought we lost serenity.',
             "it's been fifteen years."],
      right: { text: 'send', next: 'day-2-reply-too-long' }
    },
    'day-2-reply-too-long': {
      text: ['error: reply too long to send.',
             'please shorten to twenty characters.'],
      right: { text: 'to mark: "yes. here. ok??"', next: 'day-2-end' }
    },
    'day-2-end': {
      text: ['message sent.',
             'waiting for response.'],
      right: { text: 'sleep', next: 'day-3' }
    },
    'day-3': {
      text: [
        'a terminal light blinks.',
        'a distress signal.'
      ],
      right: { text: 'read distress', next: 'day-3-message' },
      right: { text: 'read distress', next: 'day-3-message' }
    },
    'day-3-message': {
      text: [
        'mark:',
        'will dead. sh si ok.'
      ],
      left: { text: 'back', next: 'day-3' },
      right: { text: 'reply', next: 'day-3-reply' }
    },
    'day-3-reply': {
      text: [
        'reply to:',
        '>mark:',
        '>will dead. sh si ok.'
      ],
      right: { text: "to mark: \"sry. ship status?\"" }
    }
  };
}

function terminalScene(id, backScene) {
  return {
    id: id,
    text: [
      "light speed terminal TM:",
      'select command.'
    ],
    right: { text: 'error codes', next: 'error-codes' },
    down:  { text: 'schematics', next: 'schematics' },
    up:    { text: 'search', next: 'search' },
    left:  { text: 'back', next: backScene }
  };
}

export function newGame() {
  return {
    currentCard: {
      id: 'beginning',
      text: [
        'a terminal light blinks.',
        'a distress signal.'
      ],
      right: {
        text: 'read distress',
        next: 'first-message'
      }
    },
    cards: cards()
  };
}



/*
commands:
  schematics:
     communication channels
     life support
     navigation
  status codes:
     ship codes
     equipment codes
     error codes
*/



/*
you have x number of modules, you have to get home

communication channel level: [20, 40, 60, 80, 100, 120, 140]
life support: [30 days, killing someone adds 10 days, one person will have to die]
navigation: [x-spin, y-spin, after burner, bearings]
*/
