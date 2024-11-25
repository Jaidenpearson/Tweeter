/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

  const timeFormat = timeago.format

$('.new-tweet-form').on('submit', function(event) {
  event.preventDefault()
  
  const serializedTweet = $(this).serialize()
  
  $.post(`/tweets`, serializedTweet)
    .then((tweet) => {
      console.log(tweet)
      renderTweets([tweet])
    })
  })

  const loadTweets = function() {
    $.get('http://localhost:8080/tweets')
      .then(function(tweets) {
        renderTweets(tweets)
      })
  }

  loadTweets()

  const renderTweets = function(tweets) {
    for (const tweet of tweets) {
      $('.tweet-container').append(createTweetElement(tweet))
    }
  }

const createTweetElement = function(tweet) {
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


});