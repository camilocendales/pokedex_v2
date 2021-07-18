import React from 'react';
import ReactDom from 'react-dom';
import { createStore } from 'redux';

import 'bootstrap/dist/css/bootstrap.css';
import './styles/app.css';



function handleDetails(state = {}, action) {

  const { type, payload } = action;


  switch (type) {
    case 'SET_DATA_POKEMON':
			return payload
    default:
    return state;
  }
}

let store = createStore(handleDetails);


class Card extends React.Component {
  state = {
    loading:true,
    error: null,
    dataDetails: {},
    image: {},
  }

  componentDidMount() {
      this.fetchPokemonDetails();
  }

  fetchPokemonDetails = async () => {
      this.setState({
        loading: true, 
        error: null
      })

      const URL = this.props.pokemon.url
      try{   

          const responseDetails = await fetch(
              URL
          );
          const dataDetails = await responseDetails.json();
          
          console.log(dataDetails);

          this.setState({
              loading: false,
              dataDetails: dataDetails,
              image: dataDetails.sprites,

          });
      } catch(error) {
          this.setState({
              loading: false,
              error: error,
          });
      }
  }
    render() {
        return (
            <li className={`col-6 col-md-3 ${this.props.active ? 'list':''}`} key={this.props.pokemon.name} onClick={this.props.onClick}>
                <img src={this.state.image.back_default} alt="Pokemon" className="img-fluid" />
                <h4 className={this.props.active ? 'text-list':''}>{this.props.pokemon.name}</h4>
                <p>Height: {this.state.dataDetails.height} ft</p>
                <p>Weight: {this.state.dataDetails.weight} lb</p>
            </li>
        );
    }
}

class App extends React.Component{
    
    state = {
        loading:true,
        error: null,
        data: {
            results:[],
        },
        dataDetails: undefined,
        image: {},
        abilities: [],
        moves: [],
        active: false

    }

    componentDidMount() {
        this.fetchPokemon();
    }

    pokemonDetails = async(data) => {
      console.log("click");
      console.log(data);

      const URL = data.url
      try{   

          const responseDetails = await fetch(
              URL
          );
          const dataDetails = await responseDetails.json();
          const abilitiesV1 = dataDetails.abilities
          const movesV1 = dataDetails.moves
          
          console.log(dataDetails);
          console.log(abilitiesV1);

          this.setState({
              loading: false,
              dataDetails: dataDetails,
              image: dataDetails.sprites,
              abilities: abilitiesV1,
              moves: movesV1
          });
      } catch(error) {
          this.setState({
              loading: false,
              error: error,
          });
      }
      console.log(this.state.abilities);
      store.dispatch({ type: 'SET_DATA_POKEMON', payload: this.state.dataDetails });
       
    }

    fetchPokemon = async () => {
      this.setState({
        loading: true, 
        error: null
      })

      try{   

          const response = await fetch(
              `https://pokeapi.co/api/v2/pokemon?limit=150&offset=0`
          );
          const data = await response.json();
          
          console.log(data);
          this.setState({
              loading: false,
              data: {
                  results: data.results,
              },
          });
      } catch(error) {
          this.setState({
              loading: false,
              error: error,
          });
      }
    }

    render() {
        
        if (this.state.error) {
            return `Error : ${this.state.error.message}`
        }
        
        return(
            <div className="container">
                <div className="view">
                  <button className="btn btn-primary" onClick={() =>this.setState({active: false})}>
                    Gallery
                  </button>
                  <button className="btn btn-primary" onClick={() =>this.setState({active: true})}>
                    List
                  </button>
                </div>
                <div className="gallery">
                    <ul className="row list-unstyled">
                        {this.state.data.results.map(pokemon => (
                            <Card
                              pokemon={pokemon}
                              onClick={() => this.pokemonDetails(pokemon)}
                              active={this.state.active}
                            />
                        ))}
                    </ul>

                    {this.state.loading && (
                        <div className="loader">
                            <h1 className="loader">Loading...</h1>
                        </div>
                    )}
                </div>
                <div className="details">
                  { this.state.dataDetails !== undefined &&
                  <div className="content">
                    <img src={this.state.image.front_default} alt="Pokemon" className="img-fluid" />
                    <h4>{this.state.dataDetails.name}</h4>
                    <h3>Abilities:</h3>
                    <div className="list-data">
                      {this.state.abilities.map(abi => (
                          <span>{abi.ability.name} | </span>
                      ))}
                    </div>
                    <h3>Moves:</h3>
                    {this.state.moves.map(mov => (
                        <span>{mov.move.name} | </span>
                    ))}
                  </div>
                  }
                  { this.state.dataDetails === undefined &&
                  <div className="content">
                    <span>Selected a Pokemon</span>
                  </div>
                  }
                </div>
            </div>
        );
    }
}

ReactDom.render(<App />, document.getElementById('main'))
