var contentWayPoint = function () {
  var i = 0;
  $(".element-animate").waypoint(
    function (direction) {
      if (
        direction === "down" &&
        !$(this.element).hasClass("element-animated")
      ) {
        i++;

        $(this.element).addClass("item-animate");
        setTimeout(function () {
          $("body .element-animate.item-animate").each(function (k) {
            var el = $(this);
            setTimeout(function () {
              var effect = el.data("animate-effect");
              if (effect === "fadeIn") {
                el.addClass("fadeIn element-animated");
              } else if (effect === "fadeInLeft") {
                el.addClass("fadeInLeft element-animated");
              } else if (effect === "fadeInRight") {
                el.addClass("fadeInRight element-animated");
              } else {
                el.addClass("fadeInUp element-animated");
              }
              el.removeClass("item-animate");
            }, k * 100);
          });
        }, 100);
      }
    },
    { offset: "95%" }
  );
};

database.ref("posts").once("value", function (snapshot) {
  if (!snapshot.val()) {
    $(".postBody").html("Sorry nothing to show");
    $(".pageloader").addClass("d-none");
    return;
  }

  snapshot.forEach(function (childSnapshot) {
    var childKey = childSnapshot.key;
    var childData = childSnapshot.val();
    var childData = childSnapshot.val();
    let col = $('<div class="col-md-6"></div>');
    let link = $(
      '<a href="blog-single.html?page=' +
        childKey +
        '" class="blog-entry element-animate" data-animate-effect="fadeIn"></a>'
    );
    let image = $(
      '<img src="' + childData.image + '" alt="Image placeholder">'
    );
    let contentBody = $('<div class="blog-content-body"></div>');
    let contentData = $(
      '<div class="post-meta"><span class="author mr-2"><img src="images/person_1.jpg" alt="DarkGames"> DarkGame</span>&bullet;<span class="mr-2">' +
        childData.time +
        "</span> &bullet;</div>"
    );
    let title = $("<h2>" + childData.title + "</h2>");

    col.append(link);
    link.append(image);
    link.append(contentBody);
    contentBody.append(contentData);
    contentBody.append(title);
    $(".postBody").prepend(col);
    console.log("ok");
  });
  $(".pageloader").addClass("d-none");
  contentWayPoint();
});
