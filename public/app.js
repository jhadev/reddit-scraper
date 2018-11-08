$.getJSON("/articles", articles => {
  articles.forEach(article => {
    $("#articles").append(`<p class='shownotes' data-id=${article._id}>
    ${article.title}</p>
    <a class='link' target="_blank" href="${article.link}">View Source</a>
    `);
  });
});

$(document).on("click", ".shownotes", function() {
  $("#notes").empty();

  $("body").animate(
    {
      scrollTop: $(".container").offset().top
    },
    2000
  );

  let thisId = $(this).attr("data-id");

  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  }).then(data => {
    $("#notes").append(`<h4>${data.title}</h4>`);
    $("#notes").append(
      `<input class='form-control rounded-0 mt-4 mb-2' placeholder='Note Title' id='titleinput' name='title'>`
    );
    $("#notes").append(
      `<textarea id='bodyinput' placeholder='Write Note Here' class='form-control rounded-0 mt-2' name='body'></textarea>`
    );
    $("#notes").append(
      `<button data-id='${
        data._id
      }' id='savenote' class='btn btn-primary btn-lg btn-block mt-4'>Save Note</button>`
    );

    if (data.note) {
      $("#titleinput").val(data.note.title);
      $("#bodyinput").val(data.note.body);
    }
  });
});

$(document).on("click", "#savenote", function() {
  var thisId = $(this).attr("data-id");

  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      title: $("#titleinput").val(),
      body: $("#bodyinput").val()
    }
  })
  .then(function(data) {
    $('.modal').modal('show');
  });

  $("#titleinput").val("");
  $("#bodyinput").val("");
});
