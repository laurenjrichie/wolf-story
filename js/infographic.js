$(document).ready(function(){
  pulse();
  // fadeIn();
  wolfDeerCoyote();
  coyoteFox();
  deerBearStream();
  beaverStream();
});

var animals = ["wolf", "deer", "fox", "amphib", "beaver", "bird", "bear", "fish", "coyote", "veg-stream"];

function pulse() {
  for (var j = 0; j < animals.length; j++) {
    $("#" + animals[j]).hover(function(){
      $(this).attr('class','pulse')
        .css('cursor','pointer');
    }, function () {
      $(this).attr('class','oldclass');
    });
  }
}

function wolfDeerCoyote() {
  $("#wolf").on('click', function() {
    $('#arrow-to-deer').attr('class','fade-in');
    window.setTimeout(function(){
      $('#deer').attr('class','fade-in');
      $('#elk').attr('class','fade-in');
    }, 500);
    window.setTimeout(function(){
      $('#arrow-to-coyote').attr('class','fade-in');
      window.setTimeout(function() {
        $('#coyote').attr('class','fade-in');
      }, 500);
    }, 1000);
  });
}

function coyoteFox() {
  $('#coyote').on('click', function() {
    $('#arrow-to-fox').attr('class','fade-in');
    window.setTimeout(function() {
      $('#fox').attr('class','fade-in');
    }, 500);
  });
}

function deerBearStream() {
  $("#deer").on('click', function() {
    $('#arrow-to-veg').attr('class','fade-in');
    window.setTimeout(function() {
      $('#veg-stream').attr('class','fade-in');
      window.setTimeout(function() {
        $('#fish').attr('class','fade-in');
        window.setTimeout(function() {
          $('#arrow-to-elk').attr('class','fade-in');
          window.setTimeout(function() {
            $('#bear').attr('class','fade-in');
          }, 500);
        }, 1000);
      }, 1500);
    }, 800);
  });
}

function beaverStream() {
  $('#veg-stream').on('click', function() {
    $('#arrow-to-stream').attr('class','fade-in');
    window.setTimeout(function() {
      $('#beaver').attr('class','fade-in');
    }, 500);
  });
}

// var animateAnimals = ['wolf', 'deer', 'coyote', 'veg-stream'];
// var relationships = {
//   "wolf": [["arrow-to-deer", 'deer'], ['arrow-to-coyote', 'coyote']],
//   'deer': [['arrow-to-veg', 'veg-stream'], ['arrow-to-elk', 'bear']],
//   'coyote': [['arrow-to-fox', 'fox']],
//   'veg-stream': [['arrow-to-stream', 'beaver']]
// }


// function fadeIn(){
//   for (var i = 0; i < animateAnimals.length; i++) {
//     var elem = $('#' + animateAnimals[i]);
//     elem.on('click', function() {
//       for (var j = 0; j < animateAnimals.length; j++) { // i was undefined
//         var arrowElem1 = null;
//         var arrowElem2 = null;
//         var clickedAnimalConnections = relationships[animateAnimals[j]];
//         if (clickedAnimalConnections.length == 2) {
//           arrowElem1 = $('#' + clickedAnimalConnections[0][0]);
//           arrowElem2 = $('#' + clickedAnimalConnections[1][0]);
//           console.log(arrowElem1);
//           console.log(arrowElem2);
//         } else {
//           arrowElem1 = $("#" + clickedAnimalConnections[0]);
//         }
//           // .......!!!!!!
//       }
//     });
//   }
//   // var arrowToDeer = $('#' + relationships.wolf[0]);
//   // // console.log(relationships.wolf)
//   // elem.on('click', function(){
//   //   arrowToDeer.attr('class','fade-in');  // diff between this and arrow to elk?
//   //   window.setTimeout(function(){
//   //     $('#deer').attr('class','fade-in');
//   //     $('#elk').attr('class','fade-in');
//   //   }, 500)
//   // });
// }
// 
// 
// // console.log(animateAnimals);
// // var arrowElem;
// // for (var i = 0; i < animateAnimals.length; i++) {
// //   // console.log("#" + String(animateAnimals[i]));
// //   $("#" + String(animateAnimals[i])).on('click', function() {
// //     // console.log(this);
// //     console.log(animateAnimals[i]);
// //     // if (relationships[animateAnimals[i]].length == 2) {
// //     //   arrowElem = $('#' + relationships[animateAnimals[0]][0], '#' + relationships[animateAnimals[1]][0]);
// //     //   console.log(arrowELem);
// //     // } else {
// //     //   arrowElem = $('#' + relationships[animateAnimals[0]][0]);
// //     // }
// //     // var nextAnimalElem = $('#' + relationships[animateAnimals[0]][1]);
// //     // arrowElem.attr('class','fade-in');
// //     // window.setTimeout(function() {
// //     //   nextAnimalElem.attr('class','fade-in');
// //     // }, 500);
// //   });
// // }
