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

  var nextScene = gameState.currentCard[direction].next;

  if (!gameState.cards[nextScene]) return gameState;

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

function cards() {
  return {
    'first-message': {
      text: ['serenity:',
             'communications repaired.',
             'awaiting commands.'],
      up: {
        text: 'ship status',
        next: 'first-ship-status'
      },
      down: {
        text: 'crew status',
        next: 'first-crew-status'
      }
    },
    'first-ship-status': {
      text: ['name: serenity.',
             'speed: 17 km/s',
             'distance: 7.5 billion km.',
             'life support: failing.',
             'message response time: 5.3 hours.'],
      left: {
        text: 'back',
        next: 'first-message'
      }
    },
    'first-crew-status': {
      text: ['mark: stable, in stasus.',
             'simone: stable, in stasus.',
             'will: no heartbeat.',
             'shiobhan: stable, in stasus.'],
      right: {
        text: 'command: inject adrenaline',
        next: 'adrenaline-injected'
      },
      left: {
        text: 'back',
        next: 'first-message'
      }
    },
    'adrenaline-injected': {
      text: ['adrenaline injected.',
             'waiting for response.'],
      right: {
        text: 'sleep',
        next: 'day-2'
      }
    },
    'day-2': {
      text: [
        'a terminal light blinks.',
        'a distress signal.'
      ],
      right: {
        text: 'read distress',
        next: 'day-2-message'
      }
    },
    'day-2-message': {
      text: [
        'mark:',
        'ne1 there!?'
      ],
      right: {
        text: 'reply',
        next: 'day-2-reply'
      }
    },
    'day-2-reply': {
      text: ["reply:",
             "yes, i'm here.",
             'we thought we lost serenity.',
             "it's been fifteen years."],
      right: {
        text: 'send',
        next: 'day-2-reply-too-long'
      }
    },
    'day-2-reply-too-long': {
      text: ['error: reply too long to send.',
             'please shorten to twenty characters.'],
      right: {
        text: 'to mark: "yes. here. ok??"',
        next: 'day-2-end'
      }
    },
    'day-2-end': {
      text: ['message sent.',
             'waiting for response.'],
      right: {
        text: 'sleep',
        next: 'day-3'
      }
    },
    'day-3': {
      text: [
        'a terminal light blinks.',
        'a distress signal.'
      ],
      right: {
        text: 'read distress',
        next: 'day-3-message'
      },
      up: {
        text: 'ship status [update]',
      },
      down: {
        text: 'crew status [update]',
      },
      right: {
        text: 'read distress',
        next: 'day-3-message'
      }
    },
    'day-3-message': {
      text: [
        'mark:',
        'will dead. sh si ok.'
      ],
      left: {
        text: 'back',
        next: 'day-3'
      },
      right: {
        text: 'reply',
        next: 'day-3-reply'
      }
    },
    'day-3-reply': {
      text: [
        'reply to:',
        '>mark:',
        '>will dead. sh si ok.'
      ],
      right: {
        text: "to mark: \"sry. must fix ship.\""
      }
    }
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
