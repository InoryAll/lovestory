/**
 * xyz-listd
 * Create By lucheng 2016.10.21
 */
(function () {
    var SwiperMusic = function (element, options) {
        this.$element = $(element);
        this.options = $.extend({}, SwiperMusic.DEFAULTS, options);
        this.init();
    };
    SwiperMusic.DEFAULTS = {
        //弹窗标题
        version: '1.0.0',
        classNames: {
            musicPlayer: "swiper-music-player",
            playButton: "swiper-music-icon",
            play: "swiper-music-icon-playing",
            stop: "swiper-music-icon-stop"
        }
    };
    SwiperMusic.prototype = {
        init: function () {
            this.initDom();
            this.initEvent();
        },
        initDom: function () {
            this.classNames = this.options.classNames;
            //按钮
            this.$btnPlay = this.$element.find("." + this.options.classNames.playButton);
            this.$musicPlayer = this.$element.find("." + this.options.classNames.musicPlayer);
            this.musicPlayer = this.$musicPlayer.get(0);
        },
        initEvent: function () {
            var self = this;
            this.$btnPlay.on(self.getClickEventType(), function () {
                if (self.$btnPlay.hasClass(self.classNames.play)) {
                    self.$btnPlay.removeClass(self.classNames.play).removeClass(self.classNames.play).addClass(self.classNames.stop);
                    self.musicPlayer.pause();
                }
                else if (!self.$btnPlay.hasClass(self.classNames.play)) {
                    self.$btnPlay.removeClass(self.classNames.stop).addClass(self.classNames.play);
                    self.musicPlayer.play();
                }
            });
            this.play();
            // 单独适配微信端的自动播放
            document.addEventListener("WeixinJSBridgeReady", function () {
               self.play();
            }, false);
        },
        play: function () {
            var self = this;
            //IOS默认需要启动播放器
            this.musicPlayer.play();
        },
        getClickEventType: function () {
            return this.IsPC() ? "click" : "touchend";
        },
        IsPC: function () {
            var userAgentInfo = navigator.userAgent;
            var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
            var flag = true;
            for (var v = 0; v < Agents.length; v++) {
                if (userAgentInfo.indexOf(Agents[v]) > 0) {
                    flag = false;
                    break;
                }
            }
            return flag;
        },
        //设置属性、方法
        setProp: function (key, value) {
            var _this = this;
            //传入
            this[key].apply(_this, [value]);
        }
    };

    function isPc() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = false;
                break;
            }
        }
        return flag;
    }

    var Util = {
        IsPC: function () {
            return isPc();
        },
        clickEventType: (function () {
            return isPc() ? "click" : "tap";
        })()
    };

    var PageInit = (function () {
        return {
            cache: {},
            init: function () {
                this.initSwiper();
                this.initEvent();
            },
            initSwiper: function () {
                this.cache.swiper = new Swiper('.swiper-container', {
                    direction: 'vertical',
                    slidesPerView: 1,
                    initialSlide: 0,
                    paginationClickable: true,
                    mousewheelControl: true,
                    onSlideChangeStart: function(swiper){
                        var activeIndex = swiper.activeIndex;
                        var slides = swiper.slides;
                        if (activeIndex === slides.length - 1) {
                            $('.swiper-music-box').removeClass('swiper-music-box-right').addClass('swiper-music-box-left');
                        }
                        if (activeIndex === slides.length - 2) {
                            if($('.swiper-music-box').attr('class').indexOf('swiper-music-box-left') > -1) {
                                $('.swiper-music-box').removeClass('swiper-music-box-left').addClass('swiper-music-box-right');
                            }
                        }
                    },
                    onSlideChangeEnd: function (swiper) {
                        //console.log(swiper);
                        //swiper外侧容器
                        var $wrapper = swiper.wrapper;
                        //console.log($wrapper);
                        //当前索引
                        var activeIndex = swiper.activeIndex;
                        //所有页面
                        var slides = swiper.slides;
                        //当前滑块
                        var activeSlide = slides.eq(activeIndex);
                        // console.log(activeIndex);
                        // console.log(slides);
                    }
                });
                return this;
            },
            initEvent: function () {
                var _this = this;
                var clickEventType = Util.clickEventType;

                var $shareBox = $(".J-swiper-slider-share");
                var $musicBox = $("#swiperMusic");
                var $mask = $shareBox.find(".mask");
                var $shareTip = $shareBox.find(".shareTip");
                // 点击按钮显示
                $(document).on(clickEventType, '.J-btn-share', function () {
                    $mask.removeClass("addMask").addClass("addMask");
                    $shareTip.removeClass("addShareTip").addClass("addShareTip");
                });

                // 点击遮罩隐藏
                $(document).on(clickEventType, '.mask', function () {
                    $mask.removeClass("addMask").removeClass("addMask");
                    $shareTip.removeClass("addShareTip").removeClass("addShareTip");
                });

                // 点击分享区域隐藏
                $(document).on(clickEventType, '.shareTip ', function () {
                    $mask.removeClass("addMask").removeClass("addMask");
                    $shareTip.removeClass("addShareTip").removeClass("addShareTip");
                });

                // 每页的点击出现悬浮层
                $(document).on(clickEventType, '.swiper-slide-show-content',function () {
                    $('.swiper-slide-show-content').eq(_this.cache.swiper.activeIndex)
                        .parent().children().eq(0).removeClass('act-swiper-page-content-hidden')
                        .addClass('act-swiper-page-content');
                });

                // 每次点击悬浮层的时候消失
                $(document).on(clickEventType, '.act-swiper-page-content',function () {
                    $(this).removeClass('act-swiper-page-content').addClass('act-swiper-page-content-hidden');
                });

                var swiperMusic = this.cache.swiperMusic = new SwiperMusic($("#swiperMusic"), {});
            }
        }
    })();



    setTimeout(function () {
        // window.location.reload();
        // 特殊需求处理，loading加载后，在进行时间初始化
        PageInit.init();
    }, 400);
})();