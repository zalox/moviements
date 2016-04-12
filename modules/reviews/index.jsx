import React from 'react';
import ReactDOM from 'react-dom';
import $ from 'jquery';

const api_key = "api_key=b03111368579a70db5e56b9da38717f5";

const picks = "http://api.themoviedb.org/3/movie/popular";
const search = "http://api.themoviedb.org/3/search/movie";
const review = "http://api.themoviedb.org/3/movie";

class ImportButton extends React.Component {
  render() {
    return <button className="btn btn-default" value={this.props.id} onClick={this.props.onClick}>Import</button>;
  }
}

class ReviewModal extends React.Component {
  render(){
    return(
    <div id="reviewModal" className="modal fade" role="dialog">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" data-dismiss="modal">&times;</button>
            <h4 className="modal-title" id={"review-title"}></h4>
          </div>
          <div className={"modal-body"}>
            <h4 id="review-header" ></h4>
            <p id="review-content" ></p><br/>
            <p id="review-score" ></p><br/>
            <p className={"text-right"} id="review-date" ></p>
          </div>
          <div className="modal-footer">
            <button type="button" className={"btn btn-default"} data-dismiss="modal">Close</button>
          </div>
        </div>
      </div>
    </div>
    )
  }
}

class ReviewListElement extends React.Component {
  render(){
    let onclick = (event) => {
      $('#review-title').text(this.props.review.movie);
      $('#review-header').text(this.props.review.title);
      $('#review-content').text(this.props.review.review);
      $('#review-score').text(this.props.review.score);
      $('#review-date').text(this.props.review.date);
    };
    return <tr data-toggle="modal" data-target="#reviewModal" onClick={onclick}>
          <td>{this.props.id}</td>
        <td>{this.props.review.movie}</td>
        <td>{this.props.review.title}</td>
        <td>{this.props.review.score ? this.props.review.score : "N/A"}</td>
        <td>{this.props.review.date}</td>
      </tr>
  }
}

class ReviewList extends React.Component {
  render(){
    var res = this.props.reviews.map((review, i)=><ReviewListElement review={review} id={i} />);
    return <div>
      <div className={"text-center"}>
        <h1>Reviews</h1>
      </div>
      <table className={"table table-hover"}>
        <thead>
        <tr>
          <td>#</td>
          <td>Movie</td>
          <td>Source</td>
          <td>Score</td>
          <td>Date</td>
        </tr>
        </thead>
        <tbody>
        { res }
        </tbody>
      </table>
    </div>
  };
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
        let content = "";
        for (let r of data.results) {
          content += r.content;
        }
        this.setState({result: {author: "Imported", content: content}});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    });
  }
  render(){
    var onClick = (event) => {
      console.log(this);
      $.ajax({
        url: "/review",
        type: "post",
        data: {
          review: this.state.result.content,
          movie: this.props.review.original_title,
          title: this.state.result.author,
          date: Date(this.props.review.release_date)
        },
        cache: false,
        error: (xhr, status, err) => {
          console.error(this.props.url, status, err.toString());
        },
        success: () => {
          this.props.updateReviews();
        }
      })
    };
    return <tr id={this.props.review.id}>
      <td>{this.props.review.original_title}</td>
      <td>{this.props.review.release_date}</td>
      <td>{this.props.review.vote_average}</td>
      <td>{this.props.review.vote_count}</td>
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
    this.state = {movies: [], reviews: []};
  }
  updateReviews(){
    $.ajax({
      url: "/reviews/json",
      success: (data) => {
        this.setState({reviews: data});
      },
      error: (xhr, status, err) => {
        console.error(this.props.url, status, err.toString());
      }
    })
  }
  updateMovies(){
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
  componentDidMount() {
    this.updateMovies();
    this.updateReviews();
    setInterval(()=>this.updateReviews(), 1000);
  }

  render(){
    var reviews = this.state.movies.map((review)=><ListElement review={review} updateReviews={this.updateReviews.bind(this)} />);
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
      <ReviewList reviews={this.state.reviews} updateReviews={this.updateReviews.bind(this)} />
      <SearchBox onClick={onClickSearch} />
      <table className={"table table-hover"}>
        <thead>
        <tr>
          <td>{"Movie"}</td>
          <td>{"Date"}</td>
          <td>{"Rating"}</td>
          <td>{"Count"}</td>
          <td>{"Import"}</td>
        </tr>
        </thead>
        <tbody>
        { reviews }
        </tbody>
      </table>
      <ReviewModal />
    </div>
  }
}

ReactDOM.render(<Application />, document.getElementById('reviewimport'));
