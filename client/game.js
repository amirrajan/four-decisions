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

  setBackNavigation(gameState);

  return gameState;
}

function log(message) {
  console.log("\n====================\n" +
              message +
              "\n====================\n");
}

function setNextSceneByInline(direction, gameState) {
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

  setBackNavigation(gameState);

  return gameState;
}

function setBackNavigation(gameState) {
  if(gameState.currentCard.up && gameState.currentCard.up.text == 'Back.')    gameState.currentCard.up.nextInline = gameState.currentCard;
  if(gameState.currentCard.left && gameState.currentCard.left.text == 'Back.')  gameState.currentCard.left.nextInline = gameState.currentCard;
  if(gameState.currentCard.right && gameState.currentCard.right.text == 'Back.') gameState.currentCard.right.nextInline = gameState.currentCard;
  if(gameState.currentCard.down && gameState.currentCard.down.text == 'Back.')  gameState.currentCard.down.nextInline = gameState.currentCard;
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
              nextInline: terminalScene() }
    },
    'day-1.5-message': {
      text: [
        'Status: 0x09, 0xAA, 0xF8.'
      ],
      left: { text: 'Back.', next: 'day-1.5' },
      right: { text: 'Wait.', next: 'day-2' },
      down: { text: 'Terminal.',
              nextInline: terminalScene() }
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
      text: ['ERROR: Reply too long to send. Communication module fatal failure.',
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
      text: ['WS dead, SG SS MR ok'],
      left: { text: 'Back.', next: 'day-3' },
      right: { text: 'Reply.', next: 'day-3-reply' },
      down: { text: 'Terminal.', nextInline: terminalScene() }
    },
    'day-3-reply': {
      text: [
        'Reply to:',
        '>WS dead, SG SS MR ok'
      ],
      right: { text: "\"Sry... Ship status?\"", next: 'day-3-end' }
    },
    'day-3-end': {
      text: ['Message sent.',
             'Waiting for response.'],
      right: { text: 'Wait.', next: 'day-4' }
    },
    'day-4': {
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: { text: 'Read distress.', next: 'day-4-message' }
    },
    'day-4-message': {
      text: ['Hlp fix COM! Qudrnt?'],
      right: { text: 'Place chip in:' }
    }
  };
}

function terminalScene() {
  var result = {
    text: [
      "== Light Speed Terminal® ==",
      'Select command.'
    ],
    right: {
      text: 'Status codes.',
      nextInline: {
        text: ['0x09: Communication module fatal failure. Message length serverely compromised.',
               '0xAA: Navigation module fatal failure. Unable to navigate ship.',
               '0xF8: Life support module fatal failure. Return to Earth not possible.'],
        left: { text: 'Back.' }
      }
    },
    top: {
      text: 'Search.',
      nextInline: {
        text: ['Database search. What would you like to search for?'],
        right: {
          text: 'Personel.',
          nextInline: {

          }
        },
        left: { text: 'Back.' }
      }
    },
    down: {
      text: 'Schematics.',
      nextInline: {
        text: ['Select schematics to view.'],
        right: {
          text: 'Communications Module.',
          nextInline: {
            text: ['=================='],
            left: { text: 'Back.' }
          }
        },
        left: { text: 'Back.' }
      }
    },
    left: { text: 'Back.' }
  };

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
