$.fn.extend({
    dragFunction: function (objParameter) {
        objParameter = objParameter != undefined ? objParameter : {};
        var defaultObjParameter = {
            init: function () {},
            begin: function (e, x, y, dis) {

            },
            end: function (e, m) {

            },
            movebegin: function (e) {

            },
            movetest: function (e, x, y, d, m) {
                return false;
            },
            move: function (e, x, y, d, m, dis) {

            },
            movement: function (m, ease, c) {

            },
            movementend: function () {

            },
            el: this,
            movementNumber: 30,
            data: {},
        };
        this.children().addClass('GPU');
        this.children().css('transform', 'scale(1, 1)');
        return this.each(function (index, element) {
            var mainParameter = {};
            mainParameter.write(defaultObjParameter).modify(objParameter).modify({
                el: element
            });
            var p = {
                x: 0,
                y: 0
            };
            var c = {
                x: 0,
                y: 0
            };
            var m = {
                x: 0,
                y: 0
            };

            element.drag = {
                enabled: true,
                active: true,
                childrenElement: null,
                parentElement: null,
                state: '',
                updatePos: function (x, y) {
                    c.x = p.x = x;
                    m.x = 0;
                    c.y = p.y = y;
                    m.y = 0;
                    console.log('aaa');
                }
            };
            var moveBool = false;
            var stopId = 0;
            var childenabled = true;
            var activeBegin = true;

            var movementId = 0;
            var movementNumber = mainParameter.movementNumber;
            var movementCount = movementNumber;
            var movementBool = true;


            var IsPCBool = IsPC();

            $(element).on('mousedown', mousedown);
            $(element).on("touchstart", handleStart);
            $(element).on("touchend", handleEnd);
            $(element).on("touchmove", handleMove);

            var data = mainParameter.init();
            mainParameter.data = data ? data : mainParameter.data;

            function mousedown(e) {
                if (element.drag.enabled) {
                    begin(e, e.pageX, e.pageY, 0);
                    $(window).on('mouseup', mouseup);
                    $(window).on('mousemove', mousemove);
                    $(element).on('selectstart', selectstart);
                    $(element).on('dragstart', dragstart);
                }
            }

            function mouseup(e) {
                $(window).off('mouseup', mouseup);
                $(window).off('mousemove', mousemove);
                $(element).off('selectstart', selectstart);
                $(element).off('dragstart', dragstart);
                end(e);
            }

            function mousemove(e) {
                move(e, e.pageX, e.pageY, 0);
            }

            function TouchesPoint(pTouches) {
                var p = new Array();
                var c = {
                    x: 0,
                    y: 0
                };
                var d = 0
                if (pTouches) {
                    var len = pTouches.length;
                    for (var i = 0; i < len; i++) {
                        c.x += pTouches[i].clientX;
                        c.y += pTouches[i].clientY;
                        p.push({
                            x: pTouches[i].clientX,
                            y: pTouches[i].clientY
                        });
                    }
                    c.x /= len;
                    c.y /= len;
                    if (len == 2) {
                        var xx = p[1].x - p[0].x;
                        var yy = p[1].y - p[0].y;
                        d = Math.sqrt(xx * xx + yy * yy);
                    }
                }
                return {
                    Pos: c,
                    Dis: d
                };
            }

            function handleStart(e) {
                if (element.drag.enabled) {
                    var touches = TouchesPoint(e.originalEvent.touches);
                    begin(e, touches.Pos.x, touches.Pos.y, touches.Dis);
                    /*$(element).on("touchend", handleEnd);
                    $(element).on("touchmove", handleMove);*/
                }
            }

            function handleEnd(e) {
                if (e.originalEvent.touches.length == 0) {
                    end(e);
                } else {
                    var touches = TouchesPoint(e.originalEvent.touches);
                    begin(e, touches.Pos.x, touches.Pos.y, touches.Dis);
                }
                /*$(element).off("touchend", handleEnd);
                $(element).off("touchmove", handleMove);*/
            }

            function handleMove(e) {
                var touches = TouchesPoint(e.originalEvent.touches);
                move(e, touches.Pos.x, touches.Pos.y, touches.Dis);
            }

            function begin(e, x, y, dis) {
                c.x = p.x = x;
                m.x = 0;
                c.y = p.y = y;
                m.y = 0;
                clearTimeout(stopId);

                movementBool = true;
                movementCount = movementNumber;
                clearInterval(movementId);

                /*上下層*/
                parentDrag(element, function (val) {
                    val.drag.childrenElement = element;
                    element.drag.parentElement = val;
                    val.drag.active = false;
                    return false;
                });
                element.drag.state = 'top';
                activeBegin = true;

                if (IsPCBool) {
                    childenabled = element.childenabled;
                }
                /*上下層_end*/

                mainParameter.begin(e, x, y, dis);
            }

            function end(e) {
                if (moveBool) {
                    moveBool = false;
                    clearTimeout(stopId);
                    if (element.drag.active) {
                        var temp = mainParameter.end(e, m);
                        movementBool = temp != undefined ? temp : true;
                        clearInterval(movementId);
                        movementId = setInterval(function () {
                            if (movementBool) {
                                var ease = jQuery.easing.easeOutQuad(undefined, movementCount / movementNumber, 0, 1, 1);
                                mainParameter.movement(m, ease, c);
                                movementCount--;
                                if (movementCount <= 0) {
                                    clearInterval(movementId);
                                    mainParameter.movementend();
                                }
                            } else {
                                clearInterval(movementId);
                                mainParameter.movementend();
                            }

                        }, 1000 / 60);
                    }
                }


                /*上下層*/
                setTimeout(function () {
                    element.childenabled = childenabled;
                }, 1);
                element.drag.childrenElement = null;
                element.drag.parentElement = null;
                element.drag.state = '';
                element.drag.active = true;
                activeBegin = true;
                /*上下層_end*/
            }

            function move(e, x, y, dis) {
                var d = {
                    x: x - p.x,
                    y: y - p.y
                };
                if (Math.abs(d.x) > 0 || Math.abs(d.y) > 0) {
                    if (!moveBool) {
                        moveBool = true;
                        mainParameter.movebegin(e);
                    }
                    if (element.drag.active) {
                        m.x = x - c.x;
                        c.x = x;
                        m.y = y - c.y;
                        c.y = y;
                        clearTimeout(stopId);
                        stopId = setTimeout(function () {
                            m.x = 0;
                            m.y = 0;
                        }, 100);
                    } else {
                        m.x = 0;
                        m.y = 0;
                    }

                    /*上下層*/
                    if (element.drag.active) {
                        if (activeBegin) {
                            activeBegin = false;
                            if (mainParameter.movetest(e, x, y, d, m)) {
                                var parentElement = element.drag.parentElement;
                                if (!IsPCBool) {
                                    element.drag.active = false;
                                }
                                if (parentElement == undefined || (parentElement && parentElement.drag.state == 'bottom')) {
                                    var childrenElement = element.drag.childrenElement;
                                    if (childrenElement) {
                                        childrenElement.drag.active = true;
                                        if (IsPCBool) {
                                            element.drag.active = false;
                                            childrenElement.childenabled = !childrenElement.drag.active;
                                            element.childenabled = !element.drag.active;
                                        }
                                        element.drag.state = 'bottom';
                                    }
                                } else if (parentElement && parentElement.drag.state == 'top') {
                                    parentElement.drag.active = true;
                                    if (IsPCBool) {
                                        element.drag.active = false;
                                        parentElement.childenabled = !parentElement.drag.active;
                                        element.childenabled = !element.drag.active;
                                    }
                                    activeBegin = true;
                                }
                            }
                        }
                    }
                    if (IsPCBool) {
                        element.childenabled = !element.drag.active;
                    }

                    /*上下層_end*/

                    if (element.drag.active) {
                        mainParameter.move(e, x, y, d, m, dis);
                    }

                    /*上下層*/
                    if (element.drag.active) {
                        if (!IsPCBool) {
                            e.preventDefault();
                        }
                    }
                    /*上下層_end*/
                }
            }

            function selectstart(e) {
                return false;
            }

            function dragstart(e) {
                return false;
            }

            function parentDrag(element, fun) {
                var temp = element.parentElement;
                while (temp) {
                    if (temp.drag && temp.drag.enabled) {
                        var temp0 = fun(temp);
                        temp0 = temp0 != undefined ? temp0 : true;
                        if (!temp0) {
                            break;
                        }
                    }
                    temp = temp.parentElement;
                }
            }
        });
    }
});
