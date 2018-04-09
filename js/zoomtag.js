$.fn.extend({
    zoomtag: function () {
        return this.each(function (index, element) {
            $(element).click(function (e) {                
                $('body').css('overflow','hidden');
                var zoomtag = $('<div/>', {
                    class: "zoomFrame",
                    html: '<img src=' + e.currentTarget.src + ' class="img" />'
                });
                $('body').append(zoomtag);
                var zoomimg = zoomtag.find('.img');                
                zoomtag.zoom($(element).width()/zoomimg[0].naturalWidth);
                zoomimg.css({
                    left:$(element).offset().left-$('body,html').scrollLeft(),
                    top:$(element).offset().top-$('body,html').scrollTop(),
                    width:$(element).width(),
                    height:$(element).height()
                }).animate({
                    left:($(window).width()-$(element).width())*0.5,
                    top:($(window).height()-$(element).height())*0.5
                });
                zoomtag.click(function(){
                    $('body').css('overflow','');
                    zoomtag.remove();    
                    zoomtag = null;
                })
            });


        });
    },
    zoom: function (s) {
        return this.each(function (index, element) {

            var zoom = $(element);
            var zoomimg = zoom.find('.img')
            var left = 0;
            var top = 0;
            var Distance = 0;
            var scale = s!=undefined?s:1;
            var scale0 = 1;
            var width = zoomimg[0].naturalWidth;
            var height = zoomimg[0].naturalHeight;

            zoomimg.css('transform', ' scale(' + 1 + ')');
            /*zoomimg.css({
                width: scale * width,
                height: scale * height
            });*/

            zoom.on('mousewheel', function (e) {
                var l = parseFloat(zoomimg.css('left'));
                var t = parseFloat(zoomimg.css('top'));
                /*width = zoomimg[0].naturalWidth;
                height = zoomimg[0].naturalHeight;*/
                var dx = (e.clientX - l) / scale0;
                var dy = (e.clientY - t) / scale0;
                scale0 -= e.originalEvent.deltaY * 0.001;
                zoomimg.css('transform', ' scale(' + scale0 + ')');
                zoomimg.css({
                    left: e.clientX - dx * scale0,
                    top: e.clientY - dy * scale0,
                    /*width: width,
                    height: height*/
                });

                left += e.clientX - dx * scale0 - l;
                top += e.clientY - dy * scale0 - t;
                console.log("aaa", e.clientX, e.clientY)
            });
            zoom.dragFunction({
                begin: function (e, x, y, dis) {
                    left = parseFloat(zoomimg.css('left'));
                    top = parseFloat(zoomimg.css('top'));
                    Distance = dis;
                    scale *= scale0;
                    zoomimg.css({
                        width: scale * width,
                        height: scale * height
                    });
                    zoomimg.css('transform', ' scale(' + 1 + ')');
                    scale0 = 1;
                },
                end: function (e, m) {
                    scale *= scale0;
                    zoomimg.css({
                        width: scale * width,
                        height: scale * height
                    });
                    zoomimg.css('transform', ' scale(' + 1 + ')');
                    scale0 = 1;
                },
                movebegin: function (e) {

                },
                movetest: function (e, x, y, d, m) {
                    return false;
                },
                move: function (e, x, y, d, m, dis) {
                    console.log(x, y)
                    var xx = x - left;
                    var yy = y - top;
                    var dx = xx / scale0;
                    var dy = yy / scale0;
                    if (dis == 0 || Distance == 0) {
                        
                    } else {
                        scale0 = dis / Distance;
                        zoomimg.css('transform', ' scale(' + scale0 + ')');
                    }
                    left += xx - dx * scale0;
                    top += yy - dy * scale0;

                    zoomimg.css({
                        left: left + d.x,
                        top: top + d.y
                    });
                },
                movement: function (m, ease) {
                    left = parseFloat(zoomimg.css('left'));
                    top = parseFloat(zoomimg.css('top'));
                    zoomimg.css({
                        left: left + m.x * ease,
                        top: top + m.y * ease
                    });
                },
                movementend: function () {

                }
            });



        });
    }
});
