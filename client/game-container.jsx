import { Component } from 'react';
import Guid from 'guid';

import {
  tick,
  sayHello,
  newGame
} from './game.js';

import {
  map,
  filter,
  difference,
  last,
  debounce
} from 'lodash';

class GameContainer extends Component {
  constructor() {
    super();


    this.state = newGame();
  }

  componentDidMount() {
    key('left', this.selectLeft.bind(this));
    key('h', this.selectLeft.bind(this));

    key('right', this.selectRight.bind(this));
    key('l', this.selectRight.bind(this));

    key('up', this.selectUp.bind(this));
    key('k', this.selectUp.bind(this));

    key('down', this.selectDown.bind(this));
    key('j', this.selectDown.bind(this));
  }

  selectUp() {
    this.setState(tick('up', this.state));
  }

  selectLeft() {
    this.setState(tick('left', this.state));
  }

  selectRight() {
    this.setState(tick('right', this.state));
  }

  selectDown() {
    this.setState(tick('down', this.state));
  }

  renderText(text) {
    return (<p key={text}>{text}</p>);
  }

  renderRight(option) {
    if(!option) {
      return (
        <div className="right-option-none"></div>
      );
    }

    return (
       <div className="right-option">
         {option.text}
       </div>
    );
  }

  renderLeft(option) {
    if(!option) {
      return (
        <div className="left-option-none"></div>
      );
    }

    return (
       <div className="left-option">
         {option.text}
       </div>
    );
  }

  renderUp(option) {
    if(!option) {
      return (
        <div className="up-down-option-none"></div>
      );
    }

    return (
      <div className="up-down-option">
         {option.text}
      </div>
    );
  }

  renderDown(option) {
    if(!option) {
      return (
        <div className="up-down-option-none"></div>
      );
    }

    return (
      <div className="up-down-option">
         {option.text}
      </div>
    );
  }

  render() {
    return (
      <div>
       {this.renderUp(this.state.currentCard.up)}
       {this.renderLeft(this.state.currentCard.left)}
       {this.renderRight(this.state.currentCard.right)}
       <div className="card">
         <div className="text">
           {map(this.state.currentCard.text, this.renderText)}
         </div>
       </div>
       {this.renderDown(this.state.currentCard.down)}
      </div>
    );
  }
}

function initApp() {
  ReactDOM.render(
    <GameContainer />,
    document.getElementById('content')
  );
}

module.exports.initApp = initApp;
