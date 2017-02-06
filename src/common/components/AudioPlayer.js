import React from "react"
import { SoundPlayerContainer } from "react-soundplayer/addons"
import { PlayButton, Progress, VolumeControl } from "react-soundplayer/components"

class PlayPause extends React.Component {
  togglePlay() {
    let { playing, soundCloudAudio } = this.props;
    if (playing) {
      soundCloudAudio.pause();
    } else {
      soundCloudAudio.play();
    }
  }

  render() {
    let { playing } = this.props;
    let text = playing ? 'Pause' : 'Play';

    return (
      <button onClick={this.togglePlay.bind(this)}>
        {text}
      </button>
    );
  }
}

export default class AudioPlayer extends React.Component {
  render() {
    return (
      <div>
        <SoundPlayerContainer streamUrl={this.props.url} clientId="CLIENT_ID">
          <PlayPause/>
          <Progress/>
        </SoundPlayerContainer>
      </div>
    );
  }
}