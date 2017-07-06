App.directive("masonry", function ($rootScope) {
    var NGREPEAT_SOURCE_RE = '<!-- ngRepeat: ((.*) in ((.*?)( track by (.*))?)) -->';
    return {
        compile: function(element, attrs) {
            // auto add animation to brick element
            var animation = attrs.ngAnimate || "'masonry'";
            var $brick = element.children();
            $brick.attr("ng-animate", animation);

            // generate item selector (exclude leaving items)
            var type = $brick.prop('tagName');
            var itemSelector = type+":not([class$='-leave-active'])";
            
            return function (scope, element, attrs) {
                var options = angular.extend({
                    itemSelector: itemSelector
                }, scope.$eval(attrs.masonry));
                
                console.log(options.model);
                // try to infer model from ngRepeat
                if (!options.model) { 
                    var ngRepeatMatch = element.html().match(NGREPEAT_SOURCE_RE);
                    console.log(ngRepeatMatch);
                    if (ngRepeatMatch) {
                        options.model = ngRepeatMatch[4];
                    }
                }
                
                // initial animation
                element.addClass('masonry');
                
                // Wait inside directives to render
                setTimeout(function () {
                    element.masonry(options);
                    
                    element.on("$destroy", function () {
                        element.masonry('destroy')
                    });
                    
                    console.log(options.model);
                    if (options.model) {
                        scope.$apply(function() {
                            scope.$watchCollection(options.model, function (_new, _old) {
                                if(_new == _old) return;
                                // Wait inside directives to render
                                setTimeout(function () {
                                    // console.log(element);
                                    element.masonry("reload");
                                });
                            });

                            // console.log(scope);
                            // console.log(attrs.modelvalue);
                            // scope.$watchCollection(attrs.modelvalue, function(_new, _old){
                            //     console.log('val');
                            //     // if(_new == _old) return;
                            //     // setTimeout(function () {
                            //         // console.log(element);
                            //         element.masonry("reload");
                            //     // });
                            // });

                        });
                    }
                });
            };
        }
    };
});


// App.directive('mainGridWidthWatcher', function(){
//     return{
//         link: function(scope, element, attrs){
//             console.log(scope);
//             console.log(element);
//             console.log(attrs);
//             scope.$watch(window.innerWidth, function(val){
//                 console.log(val);
//             })
//         }
//     }
// });