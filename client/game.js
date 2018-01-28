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
      text: ['Serenity:',
             'Communications repaired.',
             'Mark: Stable. In stasus.',
             'Simone: Stable. In stasus.',
             'Will: No heartbeat.',
             'Shiobhan: Stable, In stasus.',
             'Awaiting commands.'],
      right: { text: 'Command: Reanimate crew.',
               next: 'adrenaline-injected' }
    },
    'first-crew-status': {
      text: ['mark: stable, in stasus.',
             'simone: stable, in stasus.',
             'will: no heartbeat.',
             'shiobhan: stable, in stasus.'],
      left: { text: 'Back.', next: 'first-message' }
    },
    'adrenaline-injected': {
      text: ['Command has been sent.',
             'Waiting for response.'],
      right: { text: 'Wait.', next: 'day-1.5' }
    },
    'day-1.5': {
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: { text: 'Read distress.', next: 'day-1.5-message' },
      down: { text: 'Terminal.',
              nextInline: terminalScene('day-1.5-terminal',
                                        'day-1.5') }
    },
    'day-1.5-message': {
      text: [
        'Status: 0x09, 0xAA, 0xF8.'
      ],
      left: { text: 'Back.', next: 'day-1.5' },
      right: { text: 'Wait.', next: 'day-2' },
      down: { text: 'Terminal.',
              nextInline: terminalScene('day-1.5-message-terminal',
                                        'day-1.5-message') }
    },
    'day-2': {
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: { text: 'Read distress.', next: 'day-2-message' }
    },
    'day-2-message': {
      text: [
        'Anyone there?!'
      ],
      right: { text: 'Reply.', next: 'day-2-reply' }
    },
    'day-2-reply': {
      text: ["Yes, I'm here.",
             'We thought we lost Serenity.',
             "It's been fifteen years.",
             "Who is speaking??"],
      right: { text: 'Send reply.', next: 'day-2-reply-too-long' }
    },
    'day-2-reply-too-long': {
      text: ['Error: Reply too long to send.',
             'Please shorten to twenty characters.'],
      right: { text: '"Yes. Here. Ok? Who?"', next: 'day-2-end' }
    },
    'day-2-end': {
      text: ['Message sent.',
             'Waiting for response.'],
      right: { text: 'Wait.', next: 'day-3' }
    },
    'day-3': {
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: { text: 'Read distress.', next: 'day-3-message' },
    },
    'day-3-message': {
      text: ['Will dead. sh si ok.'],
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
  var result = {};

  result.id = id;

  result.text = [
    "light speed terminal TM:",
    'select command.'
  ];

  var statusCodesScene = {
    text: 'Status codes.',
    nextInline: {
      text: ['0x09: communication module fatal failure. message length serverely compromised.',
             '0xAA: navigation module fatal failure. unable to navigate ship.',
             '0xF8: life support module fatal failure. return to Earth not possible.'],
      left: { text: 'back', nextInline: result }
    },
  };

  var searchScene = {
    text: 'Search.',
    nextInline: {
      text: ['Database search. What would you like to search for?'],
      right: { text: 'Personel.' }
    }
  };

  result.right = statusCodesScene;
  result.down =  { text: 'schematics', next: 'schematics' };
  result.up =    searchScene;
  result.left =  { text: 'back', next: backScene };

  return result;
}

export function newGame() {
  return {
    currentCard: {
      id: 'beginning',
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: {
        text: 'Read distress.',
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
