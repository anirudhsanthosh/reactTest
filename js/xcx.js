$(document).ready(function () {
  $(".addUser").click(function () {
    $(".loginTitle").text("Create user");
    $(".signup").removeClass("d-none");
    $(".singnin").addClass("d-none");
  });

  $(".gotologinUser").click(function () {
    $(".loginTitle").text("Login");
    $(".singnin").removeClass("d-none");
    $(".signup").addClass("d-none");
  });
});

firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
  .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });

firebase.auth().onAuthStateChanged(function (user) {
  if (user) {
    $(".login").addClass("d-none");
    $(".authContent").removeClass("d-none");
    // alert('loged in');
    console.log("loged in");
  } else {
    $(".login").removeClass("d-none");
    $(".authContent").addClass("d-none");
    //alert('loged out');
    console.log("loged out");
  }
});

$(".singnOut").click(function () {
  firebase.auth().signOut();
}); // singnout btn

$(".loginUser").click(function () {
  let fields = [$(".email"), $(".password")];
  let input = {
    email: $(".email"),
    password: $(".password"),
  };
  let input_error = false;
  fields.forEach((_v) => {
    if (_v.val() === "") {
      _v.addClass("error_field");
      input_error = true;
    } else _v.removeClass("error_field");
  });
  if (input_error) {
    alert("please check all input fields");
    return;
  }

  firebase
    .auth()
    .signInWithEmailAndPassword(input.email.val(), input.password.val())
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
});

$(".createUser").click(function () {
  let fields = [$(".email"), $(".password"), $(".confirmPassword")];
  let input = {
    email: $(".email"),
    password: $(".password"),
    confirmPassword: $(".confirmPassword"),
  };
  let input_error = false;
  fields.forEach((_v) => {
    if (_v.val() === "") {
      _v.addClass("error_field");
      input_error = true;
    } else _v.removeClass("error_field");
  });
  if (input_error) {
    alert("please check all input fields");
    return;
  }

  if (input.password.val() !== input.confirmPassword.val()) {
    alert("please check both passwords");
    return;
  }
  firebase
    .auth()
    .createUserWithEmailAndPassword(input.email.val(), input.password.val())
    .catch(function (error) {
      // Handle Errors here.
      var errorCode = error.code;
      var errorMessage = error.message;
      // ...
    });
}); // usercreate button click

$(".postBlog").click(function () {
  let fields = [$(".title"), $(".description"), $(".youtubelink"), $(".tags")];
  let input = {
    title: $(".title"),
    desc: $(".description"),
    youtubelink: $(".youtubelink"),
    tags: $(".tags"),
  };
  input.desc.val(tinymce.get("description").getContent());
  let input_error = false;
  fields.forEach((_v) => {
    if (_v.val() === "") {
      _v.addClass("error_field");
      input_error = true;
    } else _v.removeClass("error_field");
  });
  if (input_error) {
    alert("please check all input fields");
    return;
  }

  if (!firebase.auth().currentUser) {
    alert("please login");
    return;
  }
  let newdate = new Date();
  date = newdate.toDateString();

  if (!$(".postimage")[0].files[0]) {
    alert("please choose a file");
    return;
  }

  let validType = ["image/jpeg", "image/png", "image/gif"];

  if ($.inArray($(".postimage")[0].files[0].type, validType) < 0) {
    alert("please choose a valid file");
    return;
  }

  let extention = $(".postimage")[0].files[0].name.split(".");
  extention = extention[extention.length - 1];
  newName = newdate.getTime() + "." + extention;

  //var newpostImage = imagesRef.put($(".postimage")[0].files[0]);
  appCanvas.toBlob(function (e) {
    var storageRef = storage.ref();
    var imagesRef = storageRef.child("post_Images");
    let newimgRef = imagesRef.child(newName);
    var newpostImage = newimgRef.put(e);
    newpostImage.on(
      firebase.storage.TaskEvent.STATE_CHANGED,
      function progress(snapshot) {
        let progres = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        $(".progress-bar").css("width", progres + "%");
        $(".progress-bar").html(progres + "%");
      },
      function (error) {
        alert("faild to save post");

        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;

          case "storage/canceled":
            // User canceled the upload
            break;

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      function () {
        // Upload completed successfully, now we can get the download URL
        newpostImage.snapshot.ref.getDownloadURL().then(function (downloadURL) {
          console.log("File available at", downloadURL);

          let dataObj = {
            title: input.title.val(),
            desc: input.desc.val(),
            time: date,
            image: downloadURL,
            youtubelink: input.youtubelink.val() + "?autoplay=1&controls=1",
            tags: input.tags.val(),
          };
          let newpost = database.ref("posts/").push(dataObj, function (error) {
            if (error) {
              // The write failed...
              console.log("failed to  add post");
              alert("faild to save post");
            } else {
              // Data saved successfully!
              console.log("success added post");
              alert("post saved successfully");
            }
          });
        });
      }
    );
  });
});

tinymce.init({
  selector: "textarea#description",
  plugins: [
    "advlist autolink lists link image charmap print preview anchor",
    "searchreplace visualblocks code fullscreen",
    "insertdatetime media table paste code help wordcount",
    "autoresize",
    "textpattern,textcolor,colorpicker",
  ],
  toolbar:
    "undo redo | formatselect | " +
    " bold italic backcolor | alignleft aligncenter " +
    " alignright alignjustify | bullist numlist outdent indent |" +
    " removeformat | help|forecolor backcolor",
});
let appCanvas = document.createElement("canvas");
function uploadPhotos(e) {
  if (!e.files[0]) return;

  var fileReader = new FileReader();
  var filterType = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;

  fileReader.onload = function (event) {
    var image = new Image();

    image.onload = function () {
      var context = appCanvas.getContext("2d");
      appCanvas.width = 350;
      appCanvas.height = 197;
      context.drawImage(
        image,
        0,
        0,
        image.width,
        image.height,
        0,
        0,
        appCanvas.width,
        appCanvas.height
      );
      $("#previewImage").attr("src", appCanvas.toDataURL());
      $("#previewImage").load(function () {
        $("#previewImage").parent().css("display", "block");
      });
    };
    image.src = event.target.result;
  };
  fileReader.readAsDataURL(e.files[0]);
}
