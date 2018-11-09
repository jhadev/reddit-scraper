$.getJSON("/articles", articles => {
  articles.forEach(article => {
    $("#articles").append(`<div class='article-body'><p class='shownotes' data-id=${article._id}>
    ${article.title}</p>
    <button class='btn btn-outline-danger delete text-right' data-id=${article._id}>Delete</button>
    <a class='float-right link btn btn-outline-primary' target="_blank" href="${article.link}">View Source</a>
    </div>
    `);
  });
});

$(document).on("click", ".shownotes", function() {
  $("#notes").empty();

  $("body").animate(
    {
      scrollTop: $(".wrapper").offset().top
    },
    2000
  );

  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(data => {
    $("#notes").append(`<h4>${data.title}</h4>`);
    
    const titleInput = `<input class='form-control rounded-0 mt-4 mb-2' placeholder='Note Title' id='titleinput' name='title'>`;

    $("#notes").append(titleInput);
    
    const bodyInput = `<textarea id='bodyinput' placeholder='Write Note Here' class='form-control rounded-0 mt-2' name='body'></textarea>`;
    
    $("#notes").append(bodyInput);

    const noteButton = `<button data-id='${data._id}' id='savenote' class='btn btn-outline-info btn-block mt-4'>Save Note</button>`;

    $("#notes").append(noteButton)

    const deleteButton = `<button class='btn btn-outline-danger btn-block text-center delete-note' data-id=${data._id}>Delete Note</button>`

    $("#notes").append(deleteButton)

    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});

$(document).on("click", "#savenote", function() {
  
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
    $('.save-modal').modal('show');
  });
});

$(document).on("click", ".delete", function() {
  
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "DELETE",
    url: "/articles/" + thisId,
  })
  .then(function(data) {
    location.reload()
  });
});

$(document).on("click", ".clear", function() {
  
  $.ajax({
    method: "DELETE",
    url: "/articles/"
  })
  .then(function(data) {
    location.reload()
  });
});

$(document).on("click", "#clear-button", function() {
  $('.clear-modal').modal('show');
});

$(document).on("click", ".delete-note", function() {
  $('.note-delete-modal').modal('show');
});

$(document).on("click", ".delete-note-button", function() {
  
  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").empty(),
      body: $("#bodyinput").empty()
    }
  })
  .then(function(data) {
    location.reload()
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});