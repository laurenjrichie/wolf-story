$(document).ready(function(){
  loopThroughAnimals(pulse);
  // loopThroughAnimals(fadeIn);
  // fadeIn();
});

var animals = ["wolf", "deer","fox", "amphib", "beaver", "bird", "bear", "fish", "coyote", "veg-stream"];

function loopThroughAnimals(func) {
  for (var i = 0; i < animals.length; i++) {
    func($("#" + animals[i]));
  }
} //need to handle special case of grouped animals

function pulse(elem) {
  elem.hover(function(){
    $(this).attr('class','pulse')
      .css('cursor','pointer');
  }, function () {
    $(this).attr('class','oldclass');
  }
  );
}

var relationships = {
  "wolf": ["arrow-to-deer", ['deer', 'elk']],
}

// function fadeIn(elem){
//   var arrowToDeer = $('#' + relationships.wolf[0]);
//   // console.log(relationships.wolf)
//   elem.on('click', function(){
//     arrowToDeer.attr('class','fade-in');  // diff between this and arrow to elk?
//     window.setTimeout(function(){
//       $('#deer').attr('class','fade-in');
//       $('#elk').attr('class','fade-in');
//     }, 500)
//   });
// }
