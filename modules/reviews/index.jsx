import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const api_key = "api_key=b03111368579a70db5e56b9da38717f5";

const picks = "http://api.themoviedb.org/3/movie/popular";
const search = "http://api.themoviedb.org/3/search/movie";
const review = "http://api.themoviedb.org/3/movie";

class ImportButton extends React.Component {
  render(){
    return <button className="btn btn-default" value={this.props.id} onClick={this.props.onClick}>Import</button>;
  }
}

class ListElement extends React.Component {
  constructor(props){
    super(props);
    this.state = {result: []};
  }
  componentDidMount(){
    $.ajax({
      url: review + "/" + this.props.review.id + "/reviews?" + api_key,
      data: {id: this.props.review.id},
      success: (data) => {
        for (let r of data.results) {
          if(r.content && r.author){
            this.setState({result: {author: r.author, content: r.content}});
          }
        }
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }
  render(){
    var onClick = (event) => {
      $.ajax({
        url: "/review",
        type: "post",
        data: {
          review: this.state.result.content,
          movie: this.props.review.original_title,
          title: this.state.result.author
        },
        cache: false,
        error: (xhr, status, err) => {
          console.error(this.props.url, status, err.toString());
        }
      })
    };
    return <tr id={this.props.review.id}>
      <td>{this.props.review.original_title}</td>
      <td>{this.props.review.release_date}</td>
      <td>{this.state.result.author}</td>
      <td><ImportButton onClick={onClick} id={this.props.review.id}/></td>
    </tr>;
  }
}

class SearchBox extends React.Component {
  render(){
    return <div className="input-group">
      <input id={"movie-search"} type="text" className="form-control" placeholder="Search for..." />
        <span className="input-group-btn">
          <button onClick={this.props.onClick} className="btn btn-default" type="button">Go!</button>
        </span>
    </div>
  }
}

class Application extends React.Component {
  constructor(props) {
    super(props);
    this.state = {movies: []};
  }
  componentDidMount() {
    $.ajax({
      url: picks + "?" + api_key,
      dataType: 'json',
      cache: false,
      success: (data) => {
        this.setState({movies: data.results});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }
  render(){
    var reviews = this.state.movies.map((review)=><ListElement review={review}/>);
    var onClickSearch = (event) => {
      let url = search + "?" + api_key;
      let query = $('#movie-search').val();
      $.ajax({
        url: url + "&query=" + encodeURI(query),
        dataType: 'json',
        cache: false,
        success: (data) => {
          this.setState({movies: data.results});
        },
        error: (xhr, status, err) => {
          console.error(this.props.url, status, err.toString());
        }
      });
    };
    return <div>
      <SearchBox onClick={onClickSearch} />
      <table className={"table table-hover"}>
        <thead>
        <tr>
          <td>{"Movie"}</td>
          <td>{"Date"}</td>
          <td>{"Author"}</td>
          <td>{"Import"}</td>
        </tr>
        </thead>
        <tbody>
        { reviews }
        </tbody>
      </table>
    </div>
  }
}

ReactDOM.render(<Application />, document.getElementById('reviewimport'));
