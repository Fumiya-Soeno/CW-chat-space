$(function(){
  function buildHTML(message){
  console.log(message);
  image = (message.image) ? `<img class= "main-chat__message-list__message__main__image" src=${message.image} >` : "";
  var html =
    `
    <div class="main-chat__message-list__message" data-message-id=${message.id}>
      <div class="main-chat__message-list__message__upper">
        <div class="main-chat__message-list__message__upper__user">
          ${message.user_name}
        </div>
        <div class="main-chat__message-list__message__upper__date">
          ${message.created_at}
        </div>
      </div>
      <div class="main-chat__message-list__message__main">
        <div class="main-chat__message-list__message__main__contents">
          ${message.content}
        </div>
      </div>
      ${image}
    </div>`
    return html;
  }
  var reloadMessages = function() {
    var last_message_id = $(".main-chat__message-list__message:last").data("message-id");
    if (last_message_id === undefined){
      last_message_id = 0;
    }
    $.ajax({
      type: 'GET',
      url: 'api/messages',
      dataType: 'json',
      data: { id: last_message_id }
    })
    .done(function(messages) {
      if (messages.length !== 0) {
        var insertHTML = '';
        messages.forEach(function (message) {
          insertHTML += buildHTML(message);
          $('.main-chat__message-list').append(insertHTML);
        })
      }
      $('.main-chat__message-list').animate({ scrollTop: $('.main-chat__message-list')[0].scrollHeight});
    })
    .fail(function() {
      alert('error');
    });
  }
  $('#new_message').on('submit', function(e){
    e.preventDefault();
    var formData = new FormData(this);
    var url = $(this).attr('action');
    $.ajax({
      url: url,
      type: "post",
      data: formData,
      dataType: 'json',
      processData: false,
      contentType: false
    })
    .done(function(data){
      var html = buildHTML(data);
      $('.main-chat__message-list').append(html);
      $('.main-chat__message-list').animate({ scrollTop: $('.main-chat__message-list')[0].scrollHeight});
      $('.main-chat__message-form__new-message__input-area__send-btn').prop('disabled', false);
      $('form')[0].reset();
    })
    .fail(function() {
      alert('error');
    })
  });
  if (document.location.href.match(/\/groups\/\d+\/messages/)) {
    setInterval(reloadMessages, 7000);
  }
});