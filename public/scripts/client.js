/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

// const data = [
//   {
//     "user": {
//       "name": "Newton",
//       "avatars": "https://i.imgur.com/73hZDYK.png"
//       ,
//       "handle": "@SirIsaac"
//     },
//     "content": {
//       "text": "If I have seen further it is by standing on the shoulders of giants"
//     },
//     "created_at": 1461116232227
//   },
//   {
//     "user": {
//       "name": "Descartes",
//       "avatars": "https://i.imgur.com/nlhLi3I.png",
//       "handle": "@rd" },
//     "content": {
//       "text": "Je pense , donc je suis"
//     },
//     "created_at": 1461113959088
//   }
// ]

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
          <p>"${tweet.created_at}"</p>
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