import React from "react"

export default class AudioPlayer extends React.Component {
  render() {
    return (
      <div>
        <audio controls="controls">
          <source src={this.props.url}/>
        </audio>
      </div>
    );
  }
}