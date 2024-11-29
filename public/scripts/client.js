/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

  const timeFormat = timeago.format

  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const displayError = (str) => {
    $('#tweet-error').css('display', 'inline').text(str)
  }

  const isTweetValid = () => {
    
    const tweetText = $('#tweet-text').val().trim()

    if (tweetText === '' || tweetText === null) {
      displayError("Cannot post an empty tweet")
      return false
    } 
    
    if (tweetText.length > 140) {
      displayError('Tweet exceeds maximum character limit')
      return false
    }
    
    $('#tweet-error').css('display', 'none')
    return true
  }

const createTweetElement = function(tweet) {
let $tweet =  $(`
  <article class="tweet">
        <header>
          <div class="left-header">
            <img src="${tweet.user.avatars}" alt="">
            <p class="user-name">${escape(tweet.user.name)}</p>
          </div>
          <p class="user-handle">${escape(tweet.user.handle)}</p>
        </header>
        <h3>${escape(tweet.content.text)}</h3>
        <footer>
          <p>${timeFormat(tweet.created_at)}</p>
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
      renderTweets(tweets)
  })
}

$('#returnButton').on('click', function() {
  $('html, body').animate({
    scrollTop: $("#tweet-text").offset().top
  }, 1000);

  $('.new-tweet').slideDown('slow', function() {
    if($('.new-tweet').is(':visible')) {
      $('#tweet-text').focus()
    } else {
      $('.new-tweet').slideDown('slow', function() {
        $('#tweet-text').focus()
      })
    }
  
  })
})

$('.returnButtonContainer').hide();

let debounceTimer;
$(window).on('scroll', function() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(function() {
    const navHeight = $('#navBar').height();
    if ($(window).scrollTop() > navHeight) {
      if ($('#navBar').is(':visible')) {
        $('#navBar').slideUp();
        $('.returnButtonContainer').slideDown();
      }
    } else {
      if (!$('#navBar').is(':visible')) {
        $('#navBar').slideDown();
        $('.returnButtonContainer').slideUp();
      }
    }
  }, 12); // Adjust the delay (100ms) as needed
});

$('.new-tweet').hide()

$('.newTweetContainer').on('click', function() {
  if($('.new-tweet').is(':visible')) {
    $('.new-tweet').slideUp('slow')
  } else {
    $('.new-tweet').slideDown('slow', function() {
      $('#tweet-text').focus()
    })
  }

})

$('.new-tweet-form').on('submit', function(event) {
  event.preventDefault()

  if(!isTweetValid()) return;
  
  const serializedTweet = $(this).serialize()

  $.post(`/tweets`, serializedTweet)
    .then(() => {
      loadTweets()
      $('.counter').text(140)
      $('#tweet-text').val('') 
    }).catch(((error) => {
      console.error(error)
    }))
  })

  loadTweets()

});