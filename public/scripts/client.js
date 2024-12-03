/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function(){

  const timeFormat = timeago.format //Formats timestamp on tweets

  //Converts user input into text node to prevent injection
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  //Displays red error on tweet form in case of error
  const displayError = (str) => {
    $('#tweet-error').css('display', 'inline').text(str)
  }

  const isTweetValid = () => {
    
    const tweetText = escape($('#tweet-text').val().trim())

    if (!tweetText) {
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

//HTML format for a tweet
const createTweetElement = function(tweet) {
let $tweet =  $(`
  <article class="tweet">
        <header>
          <div class="left-header">
            <img src="${tweet.user.avatars}" alt="">
            <p class="user-name">${tweet.user.name}</p>
          </div>
          <p class="user-handle">${tweet.user.handle}</p>
        </header>
        <h3>${tweet.content.text}</h3>
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

//Empties tweet container and reloads with all tweets
const renderTweets = function(tweets) {
  $('.tweet-container').empty()
  for (const tweet of tweets) {
    $('.tweet-container').append(createTweetElement(tweet))
  }
}

//Gets info from /tweets and calls renderTweets to reload page with all tweets
const loadTweets = function() {
  $.get('/tweets')
    .then(function(tweets) {
      renderTweets(tweets)
  })
}

//For button when scrolling away from nav bar. Returns to top of page and focuses on the tweet form
$('#returnButton').on('click', function() {
  $('html, body').animate({
    scrollTop: $(".new-tweet").offset().top
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

//Hides return button and slides down the nav bar when at the top of the page
//Timeout is to debug strange animation behavior
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
  }, 12); // Delay on Navbar slideDown
});


//Hides tweet form on load. Click 'Write a new tweet button' at top of page to access form
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


//Submits form data to reload new tweet on page with all the other tweets
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