import React, {Component} from 'react';
import {Col} from 'reactstrap';
import {withRouter} from 'react-router-dom';

import CollapseButton from '../CollapseButton/CollapseButton';
import Card from '../Card/Card';
import CardModal from '../CardModal/CardModal';
import {mapObjectToArray} from '../../utils';

class List extends Component {
  state = {
    cards: null,
    modal: false
  };

  async componentDidMount() {
    const cardsResponse = await fetch(
      `https://prollo-8a5a5.firebaseio.com/cards.json?orderBy="listId"&equalTo="${
        this.props.list.id
      }"`
    );
    const cards = await cardsResponse.json();

    this.setState({cards: mapObjectToArray(cards)});
  }

  onCreate = async title => {
    const oldCards = [...this.state.cards];
    const listId = this.props.list.id;

    const card = {
      title,
      listId,
      checklists: []
    };

    const response = await fetch(
      'https://prollo-8a5a5.firebaseio.com/cards.json',
      {
        method: 'post',
        body: JSON.stringify({...card})
      }
    );

    const jsonResponse = await response.json();

    const cards = [...oldCards, {...card, id: jsonResponse.name}];
    this.setState({cards});
  };

  toggleModal = () => {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  };

  renderCards = () => {
    if (!this.state.cards) {
      return <p>Loading...</p>;
    }

    return this.state.cards.map(card => (
      <Card toggle={this.toggleModal} card={card} key={card.id} />
    ));
  };

  render() {
    return (
      <Col xs="2">
        <div className="bg-light rounded px-3 py-1">
          <h2 className="h4 my-2">{this.props.list.title}</h2>
          {this.renderCards()}
          <CollapseButton
            text="Karte hinzufügen..."
            id={this.props.id}
            clicked={this.onCreate}
          />
        </div>
        <CardModal modal={this.state.modal} toggle={this.toggleModal} />
      </Col>
    );
  }
}

export default withRouter(List);
