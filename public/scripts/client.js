/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

  const timeFormat = timeago.format

  const isTweetValid = () => {
    
    const tweetText = $('#tweet-text').val().trim()
    if (tweetText === '' || tweetText === null) {
      alert("Cannot post an empty tweet")
      return
    } if (tweetText.length > 140) {
      alert('Tweet exceeds maximum character limit')
      return
    }
  }

const createTweetElement = function(tweet) {
  console.log('tweet', tweet)
let $tweet =  $(`
  <article class="tweet">
        <header>
          <div class="left-header">
            <img src="${tweet.user.avatars}" alt="">
            <p class="user-name">"${tweet.user.name}"</p>
          </div>
          <p class="user-handle">"${tweet.user.handle}"</p>
        </header>
        <h3>"${tweet.content.text}"</h3>
        <footer>
          <p>"${timeFormat(tweet.created_at)}"</p>
          <div class="icons">
            <a href=""><i class="fa-solid fa-flag"></i></a>
            <a href=""><i class="fa-solid fa-retweet"></i></a>
            <a href=""><i class="fa-solid fa-heart"></i></a>
          </div>
        </footer>
      </article>
      `)

return $tweet;
}

const renderTweets = function(tweets) {
  $('.tweet-container').empty()
  for (const tweet of tweets) {
    $('.tweet-container').append(createTweetElement(tweet))
  }
}

const loadTweets = function() {
  $.get('http://localhost:8080/tweets')
    .then(function(tweets) {
      console.log('line 58', tweets)
      renderTweets(tweets)
  })
}

$('.new-tweet-form').on('submit', function(event) {
  event.preventDefault()

  isTweetValid()
  
  const serializedTweet = $(this).serialize()

  $.post(`/tweets`, serializedTweet)
    .then(() => {
      loadTweets()
      $('.counter').text(140)
      $('#tweet-text').val('') 
    }).catch(((error) => {
      alert('An error occurred while posting tweet')
      console.error(error)
    }))
  })

  loadTweets()

});