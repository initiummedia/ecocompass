/**
 * A compoent with an array of social sharing buttons
 */

require('normalize.css')
require('styles/App.css')

import React from 'react'
import app_meta from '../sources/meta_data'

let wechatQrImage = require('../images/wechatQr.png')
let wechatIcon = require('../images/wechat.png')
let weiboIcon = require('../images/weibo.png')
let facebookIcon = require('../images/FB.png')
let twitterIcon = require('../images/twitter.png')

/**
 * Return the link to share a URL in a mansion specified by config
 * @param {object} config - an object containing the configurations of the sharing
 * @returns {string}
 */

function getShareUrl (config) {
  var platform = config.platform
  var facebookAppId = config.facebookAppId
  var targetUrl = config.targetUrl
  var title = config.title
  var description = config.description
  var imageUrl = config.imageUrl

  targetUrl = targetUrl ? encodeURIComponent(targetUrl) : ''
  imageUrl = imageUrl ? encodeURIComponent(imageUrl) : ''

  var shareUrl

  if (platform === 'facebook') {
    shareUrl = 'https://www.facebook.com/dialog/feed?' +
      'app_id=' + facebookAppId +
      '&link=' + targetUrl +
      '&redirect_uri=' + targetUrl

    if (imageUrl) {
      shareUrl += '&picture=' + imageUrl
    }

    if (title) {
      shareUrl += '&name=' + title
    }

    if (description) {
      shareUrl += '&description=' + description
    }

    return shareUrl
  } else if (platform === 'sinaweibo') {
    return 'http://v.t.sina.com.cn/share/share.php?title=' + title + '&url=' + targetUrl
  } else if (platform === 'twitter') {
    return 'https://twitter.com/share?url=' + targetUrl + '&text=' + title
  }
}

let SocialBar = React.createClass({

  propTypes: {
    tracker: React.PropTypes.object
  },

  getInitialState: function () {
    return {
      displayWechatQrImage: 'none'
    }
  },

  handleShareButtonClick: function (event) {
    var chosenPlatform = event.target.dataset.platform
    var shareTitle

    if (chosenPlatform === 'facebook') {
      shareTitle = app_meta.facebookShareTitle
    } else if (chosenPlatform === 'sinaweibo') {
      shareTitle = app_meta.sinaweiboShareTitle
    } else if (chosenPlatform === 'twitter') {
      shareTitle = app_meta.twitterShareTitle
    }

    var shareUrl = getShareUrl({
      facebookAppId: app_meta.facebookAppId,
      title: shareTitle,
      platform: chosenPlatform,
      targetUrl: window.location.href
    })
    this.props.tracker.post('share_button_click', chosenPlatform)
    window.open(shareUrl)
  },

  handleWechatShareButtonClick: function () {
    var display
    if (this.state.displayWechatQrImage === 'none') {
      display = 'block'
    } else {
      display = 'none'
    }

    this.props.tracker.post('share_button_click', 'wechat')

    this.setState({
      displayWechatQrImage: display
    })
  },

  render: function () {
    return (
      <div id='socialBar'>
        <button data-platform='facebook'
                onClick={this.handleShareButtonClick}>
          <image src={facebookIcon}
                 data-platform='facebook' />
        </button>
        <button data-platform='twitter'
                onClick={this.handleShareButtonClick}>
          <image src={twitterIcon}
                 data-platform='twitter' />
        </button>
        <button data-platform='sinaweibo'
                onClick={this.handleShareButtonClick}>
          <image src={weiboIcon}
                 data-platform='sinaweibo' />
        </button>
        <button onClick={this.handleWechatShareButtonClick}>
          <image src={wechatIcon}/>
        </button>
        <div id='code' style={{display: this.state.displayWechatQrImage}}><image src={wechatQrImage} /></div>
      </div>
    )
  }

})

export default SocialBar
