import React, { Component } from 'react';
import { getRandomInt, getRandomItem, shuffle } from './utils';
const [DEFENSE, OFFENSE] = ['x', 'o'];
const [x, o] = [DEFENSE, OFFENSE];
const [NORMAL_SPEED, FAST_SPEED, SLOW_SPEED] = [1000, 750, 1250];

class Yard extends Component {
  render() {
    const { top, mid, bot, yardline="" } = this.props;
    return (
      <div className={"yard " + yardline} >
        <div className="top segment">{top||''}</div>
        <div className="mid segment">{mid||''}</div>
        <div className="bot segment">{bot||''}</div>
      </div>
    );
  }
}

class EndZone extends Component {
  render() {
    const { team } = this.props;
    return (
      <div className={"endzone " + team }>
      </div>
    );
  }
}

class Field extends Component {
  setYards(fieldData, subjectVal) {
    const [top, mid, bot] = [0,1,2];
    const yardlines = fieldData[top];

    return yardlines
      .map((item, index) => {
        const pos = {
          top: subjectVal(fieldData[top][index]),
          mid: subjectVal(fieldData[mid][index]),
          bot: subjectVal(fieldData[bot][index])
        };

        return <Yard key={index} {...pos}  />;
      });
  }

  render() {
    return (
      <div className="football">
        <EndZone team="visitors" />
        {this.setYards(this.props.fieldData, this.props.subjectVal)}
        <EndZone team="home" />
      </div>
    );
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    const direction = 'left';
    const {field, subjects, qb} = this.setField(direction);
    const yards = this.getFieldYards();
    const startLine = 20;
    const position = direction === 'right'
      ? startLine - 1
      : (yards.length - startLine);

    this.state = {
      field,
      subjects,
      qb,
      playStatus: false,
      direction,
      yards,
      position
    };

    this.moveLeft = this.moveLeft.bind(this);
    this.moveRight = this.moveRight.bind(this);
    this.moveUp = this.moveUp.bind(this);
    this.moveDown = this.moveDown.bind(this);
    this.htmlElement = window.document.getElementsByTagName('html')[0];
  }

  componentDidMount() {
    // https://stackoverflow.com/questions/36180414/reactjs-add-custom-event-listener-to-component
    this.htmlElement.addEventListener("keydown", this.onKeyDown.bind(this), false);
  }

  componentWillUnmount() {
    // https://stackoverflow.com/questions/36180414/reactjs-add-custom-event-listener-to-component
    this.htmlElement.removeEventListener("keydown", this.onKeyDown.bind(this), false);
  }

  setGamePlay() {
    this.setState(() => {

    });
  }

  onKeyDown(e) {
    // https://stackoverflow.com/questions/5597060/detecting-arrow-key-presses-in-javascript
    const [left, up, down, right] = [
      37, 38, 40, 39
    ];

    switch(e.keyCode) {
      case left:
        this.moveLeft(this.state.qb);
        break;
      case up:
        this.moveUp(this.state.qb);
        break;
      case down:
        this.moveDown(this.state.qb);
        break;
      case right:
        this.moveRight(this.state.qb);
        break;
    }

    return;
  }

  addToPosition(addToFlag = true, moveDirection) {
    const { direction, position } = this.state;

    if (!addToFlag || !moveDirection) {
      return position;
    }

    const add = ((direction === 'right' && moveDirection === 'forward') ||
      (direction === 'left' && moveDirection === 'backwards'));
    const substract = ((direction === 'right' && moveDirection === 'backwards') ||
      (direction === 'right' && moveDirection === 'forward'));
    const addBy = add ? 1 : -1;

    return position + addBy;
  }

  getFieldYards() {
    const getPosition = (yard,direction = 'right') => ({
      yard,
      direction
    });

    return (new Array(100))
      .join(',')
      .split(',')
      .map((_,i) => ((i+1) <= 50) ? getPosition(i+1) : getPosition(101 - (i+1), 'left'));
  }

  fieldData(direction) {
    const field = [
      ['', '', x, '', '', '', x, '', '', ''],
      ['', '', '', '', x, '', x, o, '', ''],
      [x, '', '', '', '', '', x, '', '', '']
    ];

    if (direction === 'right') {
      const reversefield = field
        .map(segments => segments.reverse());
    }

    return field;
  }

  setField(direction) {
    let qb;
    let id = 0;
    const subjects = {};
    const field = this.fieldData(direction)
      .map((segmentList, segment) => {
        return segmentList
          .map((val, yardline) => {
            if (!val) {
              return val;
            }

            id++;
            subjects[id] = {
              id, val, segment, yardline
            };

            if (val === o) {
              qb = id;
            }

            return id;
          });
      });
    return {field, subjects, qb};
  }

  setPlayOn() {
    if(this.state.playStatus === false) {
      this.setState({
        playStatus: true
      });

      this.autoDefense();
    }
  }

  subjectById(id) {
    const { subjects } = this.state;
    return subjects[id] || null;
  }

  subjectVal(id) {
    const subject = this.subjectById(id);
    return subject && subject.val || '';
  }

  setSubjectPosition(subject, to, noveDirection) {
    const { field, qb } = this.state;
    const toSpot = field[to.segment] && field[to.segment][to.yardline];

    if (toSpot !== '') {
      return;
    }

    this.setState((prevState) => {
      return {
        position: this.addToPosition(qb === subject.id, noveDirection),
        subjects: Object
          .assign(
            {},
            prevState.subjects,
            {
              [subject.id]: Object.assign({}, subject, {
                segment: to.segment,
                yardline: to.yardline
              })
            }
          ),
        field: prevState
          .field
          .map((seg, segment) => {
            return seg.map((val, yardline) => {
              if (subject.segment === segment && subject.yardline === yardline) {
                return '';
              } else if (to.segment === segment && to.yardline === yardline) {
                return subject.id;
              }

              return val;
            });
          })
      };
    });
  }

  selectDefenseId() {
    const { subjects, qb } = this.state;
    const ids = Object.keys(subjects)
      .filter((id) => +id !== +qb);

    return getRandomItem(ids);
  }

  selectMove(id) {
    const { field } = this.state;
    const subject = this.subjectById(id);
    const { segment, yardline } = subject;
    const availableSpot = '';

    const moves = {
      'left': field[segment][yardline - 1],
      'right': field[segment][yardline + 1],
      'up': field[segment - 1] && field[segment - 1][yardline],
      'down': field[segment + 1] && field[segment + 1][yardline],
      'stay': availableSpot
    };

    const availableMoves = Object.keys(moves)
      .filter((move) => moves[move] === availableSpot);

    return getRandomItem(availableMoves);
  }

  autoDefense() {
    // First Defense Move
    setTimeout(() => {
      this.defenseMove();
    }, 250);

    setInterval(() => {
      this.defenseMove();
    }, 1000);
  }

  defenseMove() {
    const id = this.selectDefenseId();
    const move = this.selectMove(id);

    return this.makeMove(id, move);
  }

  makeMove(id, move) {
    switch(move) {
      case 'left':
        return this.moveLeft(id);
      case 'right':
        return this.moveRight(id);
      case 'up':
        return this.moveUp(id);
      case 'down':
        return this.moveDown(id);
      default:
        return;
    }
  }

  moveSubject(id, addSegment = 0, addYardline = 0, moveDirection = null) {
    const { qb, field, direction } = this.state;
    const startOfField = direction === 'left' ? field[0].length - 1 : 0;
    const isEndOfField = (yardline) =>
      direction === 'left'
      ? yardline < 0
      : yardline >= field[0].length;
    const subject = this.subjectById(id);
    this.setPlayOn();

    if (!subject) {
      return;
    }

    const to = {
      segment: subject.segment + addSegment,
      yardline: subject.yardline + addYardline
    };

    if (isEndOfField(to.yardline) && id === qb) {
      // Startng Yardline Loop
      to.yardline = startOfField;
    }

    this.setSubjectPosition(subject, to, moveDirection);
  }

  moveLeft(id) {
    const { direction } = this.state;
    const moveDirection = direction === 'left' ? 'forward' : 'backwards';
    this.moveSubject(id, 0, -1, moveDirection);
  }

  moveRight(id) {
    const { direction } = this.state;
    const moveDirection = direction === 'right' ? 'forward' : 'backwards';
    this.moveSubject(id, 0, 1, moveDirection);
  }

  moveUp(id) {
    this.moveSubject(id, -1, 0);
  }

  moveDown(id) {
    this.moveSubject(id, 1, 0);
  }

  render() {
    return (
      <div>
        <p>Current Position {this.state.yards[this.state.position].yard}</p>
        <Field
          fieldData={this.state.field}
          subjectVal={this.subjectVal.bind(this)}
        />

        <button onClick={(e) => {e.preventDefault; this.moveLeft(this.state.qb);}}>Move Left</button>
        <button onClick={(e) => {e.preventDefault; this.moveUp(this.state.qb);}}>Move Up</button>
        <button onClick={(e) => {e.preventDefault; this.moveDown(this.state.qb);}}>Move Down</button>
        <button onClick={(e) => {e.preventDefault; this.moveRight(this.state.qb);}}>Move Right</button>
        <br />
        <button onClick={(e) => {e.preventDefault; this.defenseMove();}}>Move Defense</button>
      </div>
    );
  }
}

export default App;
