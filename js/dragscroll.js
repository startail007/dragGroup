$.fn.extend({
    dragScroll: function (objParameter, fun) {
        objParameter = objParameter != undefined ? objParameter : {};
        var defaultObjParameter = {
            direction: ''
        };
        return this.each(function (index, element) {
            var mainParameter = {};
            mainParameter.write(defaultObjParameter).modify(objParameter);
            var scroll = {
                x: 0,
                y: 0
            };
            element.dragScroll = {
                getMovableX: getMovableX,
                getMovableY: getMovableY,
                update: update
            };

            var activeX = mainParameter.direction == 'x' || mainParameter.direction == '';
            var activeY = mainParameter.direction == 'y' || mainParameter.direction == '';

            var movable = {
                left: false,
                right: false,
                top: false,
                bottom: false
            };


            $(window).on('resize', resize);
            resize();

            $(element).dragFunction({
                begin: function (e, x, y) {
                    if (activeX) {
                        scroll.x = $(element).scrollLeft();
                    }
                    if (activeY) {
                        scroll.y = $(element).scrollTop();
                    }
                    fun01('begin', {});
                },
                end: function (e, m) {                    
                    return fun01('end', {
                        move: m
                    });
                },
                movebegin: function (e, x, y) {
                    fun01('movebegin', {});
                },
                movetest: function (e, x, y, d, m) {
                    if (activeX) {
                        getMovableX();
                    }
                    if (activeY) {
                        getMovableY();
                    }
                    var bool0 = (activeX && Math.abs(d.x) > Math.abs(d.y));
                    var bool1 = (activeY && Math.abs(d.y) > Math.abs(d.x));
                    var bool2 = activeX && ((-d.x < 0 && !movable.left) || (-d.x > 0 && !movable.right));
                    var bool3 = activeY && ((-d.y < 0 && !movable.top) || (-d.y > 0 && !movable.bottom));
                    return !(bool0 || bool1) || bool2 || bool3;
                },
                move: function (e, x, y, d, m) {
                    var rateX = 0;
                    var rateY = 0;
                    if (activeX) {
                        $(element).scrollLeft(scroll.x - d.x);
                        var temp = getMovableX();
                        rateX = temp.rateX;
                    }
                    if (activeY) {
                        $(element).scrollTop(scroll.y - d.y);
                        var temp = getMovableY();
                        rateY = temp.rateY;
                    }
                    fun01('move', {
                        movable: movable,
                        rateX: rateX,
                        rateY: rateY
                    });
                },
                movement: function (m, ease) {
                    var rateX = 0;
                    var rateY = 0;
                    if (activeX) {
                        $(element).scrollLeft($(element).scrollLeft() - m.x * ease);
                        var temp = getMovableX();
                        rateX = temp.rateX;
                    }
                    if (activeY) {
                        $(element).scrollTop($(element).scrollTop() - m.y * ease);
                        var temp = getMovableY();
                        rateY = temp.rateY;
                    }
                    fun01('movement', {
                        movable: movable,
                        rateX: rateX,
                        rateY: rateY
                    });
                },
                movementend: function () {
                    if (activeX) {
                        getMovableX();
                    }
                    if (activeY) {
                        getMovableY();
                    }
                    fun01('movement_end', {
                        movable: movable
                    });
                }
            });

            function fun01(state, parameter) {
                if (fun) {
                    var temp = fun.call(element, state, parameter);
                    return temp != undefined ? temp : true;
                }
                return true;
            }


            function update() {
                if (activeX) {
                    getMovableX();
                }
                if (activeY) {
                    getMovableY();
                }
                fun01('update', {
                    movable: movable
                });
            }


            function resize(e) {
                if (activeX) {
                    getMovableX();
                }
                if (activeY) {
                    getMovableY();
                }
                fun01('resize', {
                    movable: movable
                });
            }



            function getMovableX() {
                var w = $(element).prop('scrollWidth') - ((element.tagName == 'HTML') ? $(element)[0].clientWidth : $(element).innerWidth());
                movable.left = false;
                movable.right = false;
                var rateX = 0;
                if (w != 0) {
                    rateX = Math.round($(element).scrollLeft()) / w;
                    if (rateX > 0) {
                        movable.left = true;
                    }
                    if (rateX < 1) {
                        movable.right = true;
                    }
                }
                return {
                    movable: movable,
                    rateX: rateX
                };
            }


            function getMovableY() {
                var h = $(element).prop('scrollHeight') - ((element.tagName == 'HTML') ? $(element)[0].clientHeight : $(element).innerHeight());
                movable.top = false;
                movable.bottom = false;
                var rateY = 0;
                if (h != 0) {
                    rateY = Math.round($(element).scrollTop()) / h;
                    if (rateY > 0) {
                        movable.top = true;
                    }
                    if (rateY < 1) {
                        movable.bottom = true;
                    }
                }
                return {
                    movable: movable,
                    rateY: rateY
                };
            }
        });
    }
});
