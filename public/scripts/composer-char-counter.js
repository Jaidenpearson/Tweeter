$(document).ready(function() {
  $('#tweet-text').on('input', function() {
    const counter = $('#tweet-text')
    .closest('form')
    .find('.counter')

    const tweetLength = this.value.length
    const maxLength = 140
    const remainingLength = maxLength - tweetLength

    if(remainingLength < 0) {
      counter.css('color', 'red')
    }

    if(remainingLength >= 0) {
      counter.css('color', 'black')
    }

    counter.text(remainingLength)
  })
});