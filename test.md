import React, { useEffect, useState, useRef } from 'react';
import { connect } from 'dva';
import { isPCDevice } from "@/utils/sniff.js";
import { getSessionJson, setSessionJson } from "@/utils/mark.js";
import { SmileOutlined } from '@ant-design/icons';
import { Button, Result, Skeleton } from 'antd';
import _ from 'lodash';

import './IndexPage.less';
import HomeImg2 from '@/assets/ddz.gif'
import In from '@/assets/in.mp4'
import Winter from '@/assets/Winter Embrace.mp3'
import playIcon from "@/assets/icon/play.png"
import pauseIcon from "@/assets/icon/pause.png"
// import { db } from "../../mock/user"
// import styles from './IndexPage.css';

const PCstyle = {
  width: "550px",
  margin: 'auto',
  position: 'relative'
}
const PCMockstyle = {
  width: "550px",
  margin: 'auto',
}

function IndexPage(props) {
  const playRef = useRef(null);
  const [skeletonFlag, setSkeletonFlag] = useState(true)
  const [audioPlayer, setAudioPlayer] = useState(null)
  const [audioCtx, setAudioCtx] = useState(null)
  const [mockFlag, setMockFlag] = useState(true)
  const [playIconUrl, setPlayIconUrl] = useState(playIcon)

  // const {
  //   dispatch
  // } = props

  const initMock = () => {
    const localFlag = getSessionJson('mockFlag') || (getSessionJson('mockFlag') === null)
    setMockFlag(localFlag)
  }

  const initAudioCtx = async () => {
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = await fetch(Winter)
      .then(response => response.arrayBuffer())
      .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
      .then(audioBuffer => {
        // 在这里处理解码后的audioBuffer  
        const source = audioCtx.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(audioCtx.destination);
        // source.onended = function() {  
        //   console.log('Audio playback has ended.');  
        // };  
        setAudioPlayer(source)
        setAudioCtx(audioCtx)
        return source
      })
      .catch(error => {
        console.error('Error decoding audio data:', error);
      });

    // 判断页面是否是通过刷新加载的  
    if (performance.navigation.type === 1) {
      try {
        source.start(0)
        // audioCtx.resume();

        //刷新后浏览器限制政策
        setPlayIconUrl(pauseIcon)
        playRef.current && playRef.current.classList.add('pause')
      } catch (error) {
        console.log(error)
      }
    }
  }

  const windowLoad = () => new Promise((resolve, reject) => {
    window.onload = resolve;
    window.onerror = reject;
  })

  useEffect(() => {
    initMock()
    initAudioCtx()
    windowLoad().then(() => {
      setSkeletonFlag(false)
      console.log('加载完毕')
    })
  }, [])


  const join = () => {
    setMockFlag(false)
    setSessionJson({
      key: "mockFlag",
      jValue: false
    })

    try {
      // 节流兜底
      audioPlayer.start(0);
    } catch (error) {
      audioCtx.resume();
      setPlayIconUrl(playIcon)
      playRef.current && playRef.current.classList.remove('pause')
      console.log(error)
    }
  }

  const contrlAudio = () => {
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
      setPlayIconUrl(playIcon)
      playRef.current && playRef.current.classList.remove('pause')
    } else if (audioCtx.state === "running") {
      audioCtx.suspend();
      setPlayIconUrl(pauseIcon)
      playRef.current && playRef.current.classList.add('pause')
    }
  }



  const MockPage = () => {
    return (mockFlag && (getSessionJson('mockFlag') || (getSessionJson('mockFlag')) === null)) && <div className='mock-box' style={isPCDevice().flag ? PCMockstyle : {}}>
      <Result
        icon={<SmileOutlined className='home-icon' />}
        title={<p className='home-title'>里界绮梦</p>}
        extra={
          <div className='spinner-box'>
            <div className="spinner"></div>
            <Button className="spinner-btn" type="dashed" ghost onClick={_.debounce(join, 250, { 'maxWait': 1000 })}>
              进入
            </Button>
          </div>
        }
      />
    </div>
  }

  return (<Skeleton active loading={skeletonFlag} paragraph round title>
    <div className="home-page" style={isPCDevice().flag ? PCstyle : {}}>
      <MockPage />
      <div className='home-img-box'>
        <div className='audio-contrl'>
          <img
            ref={playRef}
            className="music play"
            src={playIconUrl}
            onClick={() => contrlAudio()}
            alt="播放器" />
        </div>
        <video muted autoPlay loop="loop" disablePictureInPicture poster={HomeImg2}>
          <source src={In} type="video/mp4"></source>
          <img src={HomeImg2} alt="loading" title='home' />
        </video>
      </div>
      <div className="welcome">
        界门启兮，丽影憧憧，<br />
        女如玉兮，娇态盈盈。<br />
        眸含水兮，流光溢彩，<br />
        步生莲兮，香径留痕。<br />
      </div>
      <br />
    </div>
  </Skeleton>
  );
}

// IndexPage.propTypes = {
// };

export default connect(({ user }) => (
  user))(IndexPage);
