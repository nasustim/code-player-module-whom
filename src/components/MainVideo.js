import React from 'react'


const MainVideo = () => 
<View style={styles.container}>
  <View style={styles.videoContainer}>
    <Video
      fullscreen={true}
      style={styles.video}
      source={{uri: codingVideo}}
      ref={ref => {
        this.player = ref
      }}
      selectedVideoTrack={{
        type: 'resolution',
        value: codeSize.height,
      }}
      onBuffer={this.onBuffer}
      paused={isPaused}
      onProgress={movie => {
        if (Math.floor(movie.currentTime) !== currentTime) {
          this.setState({
            currentTime: Math.floor(movie.currentTime),
          })

          if (Math.floor(movie.currentTime) >= stopTime) {  // @note ストップ後に変な動きをしたらここを === に戻す
            this.sendMessage({
              signal: 1,
              movieId: movieId,
            })
            this.setState({
              isPaused: true,
            })
          } else if (Math.floor(movie.currentTime) === markerTime) {
            this.sendMessage({
              signal: 2,
              movieId: movieId,
            })
          }
        }
      }}
    />
  </View>
  {isPaused === false && setting.mode == 'separate' ? (
    <Wipe
      isPaused={isPaused}
      currentTime={startTime}
      uri={programmerVideo}
    />
  ) : null}
  {isPaused === true ? <View style={styles.mask} /> : null}
</View>