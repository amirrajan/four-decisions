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

  if (gameState.currentCard[direction].message) gameState.messages.push(gameState.currentCard[direction].message);

  return setNextSceneById(direction, gameState)  ||
         setNextSceneByInline(direction, gameState) ||
         setNextSceneByDelegate(direction, gameState) ||
         gameState;
}

function setNextSceneByDelegate(direction, gameState) {
  var nextDelegate = gameState.currentCard[direction].nextDelegate;

  if (!nextDelegate) return false;

  assignCurrentScene(nextDelegate(gameState), gameState);
}

function setNextSceneById(direction, gameState) {
  var nextScene = gameState.currentCard[direction].next;

  if (!gameState.cards[nextScene]) return false;

  assignCurrentScene(gameState.cards[nextScene],
                     gameState);

  return gameState;
}

function log(message) {
  console.log("\n====================\n" +
              message +
              "\n====================\n");
}

function assignCurrentScene(newScene, gameState) {
  var lastScene = gameState.currentCard;

  gameState.currentCard = {
    image: newScene.image,
    text: newScene.text,
    up: newScene.up,
    down: newScene.down,
    left: newScene.left,
    right: newScene.right
  };

  setBackNavigation(gameState.currentCard,
                    lastScene);
}

function setNextSceneByInline(direction, gameState) {
  var nextScene = gameState.currentCard[direction].nextInline;

  if (!nextScene) return false;

  assignCurrentScene(nextScene, gameState);

  return gameState;
}

function setBackNavigation(scene, backScene) {
  if(scene.up && scene.up.text == 'Back.' && !scene.up.nextInline) {
    scene.up.nextInline = backScene;
  }

  if(scene.left && scene.left.text == 'Back.' && !scene.left.nextInline) {
    scene.left.nextInline = backScene;
  }

  if(scene.right && scene.right.text == 'Back.' && !scene.right.nextInline) {
    scene.right.nextInline = backScene;
  }

  if(scene.down && scene.down.text == 'Back.' && !scene.down.nextInline) {
    scene.down.nextInline = backScene;
  }
}

function getStatuses(gameState) {
  var timePassed = filter(gameState.messages, m => m.match(/^wait$/));

  var chipDescriptions = {
    'nav-chip-1': ['Earth sensor is down.', 'Earth sensor is down.'],
    'nav-chip-2': ['Solar sails deployment is down.', 'Solar sails deployment is down.'],
    'nav-chip-3': ['After burner controls are down.', 'After burner controls are down.'],
    'nav-chip-4': ['Thrusters are down.', 'Thrusters are down.'],
    'message-chip-1': ['High payload communcation is down.', 'High payload communcation is operational.'],
    'message-chip-2': ['Stage 1 compression is down.', 'Stage 1 compression is down.'],
    'message-chip-3': ['Stage 2 compression is down.', 'Stage 2 compression is down.'],
    'life-chip-1': ['Capacity sensors are down.', 'Capacity sensors are down.']
  }

  var status = [];

  for(var key in chipDescriptions) {
    if(gameState.messages.includes(key)) {
      status.push(chipDescriptions[key][1]);
    } else {
      status.push(chipDescriptions[key][0]);
    }
  }

  return {
    text: [
      'A terminal light blinks.',
      'A distress signal.'
    ],
    right: {
      text: 'Read distress.',
      nextInline: {
        text: status
      }
    }
  };
}

function determineDistressMessageForChip(gameState) {
  var chipA5 = gameState.messages.includes('message-chip-1');

  if (!chipA5) {
    return {
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: {
        text: 'Read distress.',
        nextInline: {
          text: [
            "DIDN'T WORK! HELP!!"
          ],
          right: chipDecisionTree(),
          down: { text: 'Terminal.', nextInline: terminalScene() }
        }
      }
    };
  } else {
    return {
      text: [
        'A terminal light blinks.',
        'A distress signal.'
      ],
      right: {
        text: 'Read distress.',
        nextInline: {
          text: [
            "Holy shit that worked! We can speak in full sentances now.",
            "Me, Simone, and Shiobhan are alive.",
            "Still suffering from Stasus Sickness.",
            "All of our systems are dark. Please advise.",
            "We only have ninteen circuits left.",
            "One was used to fix the communcations system.",
          ],
          right: {
            text: 'What are your system statuses?',
            nextInline: {
              text: ['Message sent.',
                     'Waiting for response.'],
              right: { text: 'Wait.', nextDelegate: getStatuses,  message: 'wait' }
            }
          }
        }
      }
    };
  }

  return gameState.currentCard;
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
      right: { text: 'Wait.', next: 'day-1.5', message: 'wait' }
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
      right: { text: 'Wait.', next: 'day-2', message: 'wait' },
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
             "It's been twenty-three years.",
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
      right: { text: 'Wait.', next: 'day-3', message: 'wait'  }
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
      right: { text: 'Wait.', next: 'day-4', message: 'wait'  }
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
      right: chipDecisionTree(),
      down: { text: 'Terminal.', nextInline: terminalScene() }
    }
  };
}

function chipDecisionTree() {
  return {
    text: 'Place chip in:',
    nextInline: {
      text: ['Place chip in:'],
      up:    {
        text: ['A'],
        nextInline: {
          text: ['Place chip in: A'],
          up: {
            text: '5',
            nextInline: {
              text: ['Place chip in: A5'],
              right: {
                text: 'Send.',
                message: 'message-chip-1',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          right: {
            text: '0',
            nextInline: {
              text: ['Place chip in: A0'],
              right: {
                text: 'Send.',
                message: 'message-chip-A0',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          down: {
            text: '3',
            nextInline: {
              text: ['Place chip in: A3'],
              right: {
                text: 'Send.',
                message: 'message-chip-A3',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          left: { text: 'Back.' }
        }
      },
      right: {
        text: ['E'],
        nextInline: {
          text: ['Place chip in: E'],
          up: {
            text: '7',
            nextInline: {
              text: ['Place chip in: E7'],
              right: {
                text: 'Send.',
                message: 'message-chip-E7',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          right: {
            text: '0',
            nextInline: {
              text: ['Place chip in: E0'],
              right: {
                text: 'Send.',
                message: 'message-chip-E0',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          down: {
            text: '5',
            nextInline: {
              text: ['Place chip in: E5'],
              right: {
                text: 'Send.',
                message: 'message-chip-E5',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          left: { text: 'Back.' }
        }
      },
      down:  {
        text: ['C'],
        nextInline: {
          text: ['Place chip in: C'],
          up: {
            text: '3',
            nextInline: {
              text: ['Place chip in: C3'],
              right: {
                text: 'Send.',
                message: 'message-chip-C3',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          right: {
            text: '0',
            nextInline: {
              text: ['Place chip in: C0'],
              right: {
                text: 'Send.',
                message: 'message-chip-C0',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          down: {
            text: '7',
            nextInline: {
              text: ['Place chip in: C7'],
              right: {
                text: 'Send.',
                message: 'message-chip-C7',
                nextInline: {
                  text: ['Message sent.',
                         'Waiting for response.'],
                  right: { text: 'Wait.', nextDelegate: determineDistressMessageForChip,  message: 'wait' }
                }
              },
              left: { text: 'Back.' }
            }
          },
          left: { text: 'Back.' }
        }
      },
      left: { text: 'Back.' }
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
            image: '/images/communications-module.png',
            text: [],
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
    cards: cards(),
    messages: []
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
