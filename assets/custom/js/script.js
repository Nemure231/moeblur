// RANGE FUNCTION
function range() {
    return {
        maxprice: 0.01,
        min: 0.01,
        max: 0.5,
        minthumb: 0,
        maxthumb: 0,

        maxtrigger() {
            this.maxprice = Math.max(this.maxprice);
            this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);
            localStorage.setItem('strength', this.maxprice)
        },
    }
}

// CIRCLE FUNCTION
function circle() {
    return {
        maxprice: 10,
        min: 10,
        max: 600,
        minthumb: 0,
        maxthumb: 0,

        maxtrigger() {
            this.maxprice = Math.max(this.maxprice);
            this.maxthumb = 100 - (((this.maxprice - this.min) / (this.max - this.min)) * 100);
            localStorage.setItem('circle', this.maxprice)
            document.querySelector('.cursor').style.height = this.maxprice + 'px';
            document.querySelector('.cursor').style.width = this.maxprice + 'px';


        },
    }
}

// DATA FOR LOOPING IMAGE FOR EXAMPLE
document.addEventListener('alpine:init', () => {
    Alpine.data('contoh', () => ({
        bg: {
            1: {
                id: 1,
                url: './assets/img/example/example_1.jpg'
            },
            2: {
                id: 2,
                url: './assets/img/example/example_2.jpg'
            },
            3: {
                id: 3,
                url: './assets/img/example/example_3.jpg'
            },
            4: {
                id: 4,
                url: './assets/img/example/example_4.jpg'
            }
        }

    }));
});



//IMAGE VALIDATION FUNCTION
function isFileImage(file) {
    const acceptedImageTypes = ['image/jpg', 'image/jpeg', 'image/png'];
    return file && acceptedImageTypes.includes(file['type'])
}

document.addEventListener('alpine:init', () => {
    Alpine.data('upload_image', () => ({
        choose_image(){
            this.$refs.choose_image.click();
        },
        // CHOOSE IMAGE AND CONVERT IN INTU URL, AND SHOW IT AS A PREVIEW
        change_image() {
            var files = this.$refs.choose_image['files'][0];
            const fileType = files['type'];
            const fileSize =  files['size'];
            const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
             // TYPE IMAGE VALIDATION
            if (!validImageTypes.includes(fileType)) {
                alert('Please, choose the right format image! The avaiable format is JPG, JPEG, and PNG!');
            }
            //SIZE IMAGE VALIDATION
            else if (fileSize >= 1045301) {
                alert('The maximum size image to upload is 1MB, please reduce your image size before upload again!');
            }else{
                //CHANGE THE IMAGE WITH CURRENT FILE UPLOAD
                var src = window.URL.createObjectURL(files);
                this.$refs.new_image.style.backgroundImage = 'url('+src+')';
                this.$refs.hidden_new_image.value = src;

            }

        },
        start_edit() {

            if(!document.getElementById('hidden-new-image').value){
                alert('You need to choose one image or example before edit!')
            }

            const canvas = document.getElementById("myCanvas");
            const widthCanvas = canvas.clientWidth;
            const heightCanvas = canvas.clientHeight;
            const app = new PIXI.Application({
                view: canvas,
                autoResize: true,
                width: widthCanvas,
                height: heightCanvas,
                resolution: 1,
                transparent: true,

            });

            var file = document.getElementById('hidden-new-image').value;
            
            var image = new Image();
            image.onload = function () {

               
                const rect = PIXI.Texture.from(image.src);
                var sprites = {};
                sprites = new PIXI.Sprite(rect);

                // RESIZE THE IMAGE SO IT CAN FIT TO THE WEBSITE
                // ITS JUST RANDOM SIZE THAT I COHHOSE
                // STILL DONT KNOW HOW TO MAKE THE CANVAS IMAGE GET THE RESPONSIVE DESIGN, FIX LATTER
                if (image.width > widthCanvas && image.height > heightCanvas) {
                    sprites.width = 1366 / 1.5;
                    sprites.height = 768 / 1.5;

                    // GIVE CENTER POSITION OF LANDSCAPE IMAGE
                    sprites.x = sprites.width / sprites.width + 12;

                   
                } else {
                    sprites.width = image.width;
                    sprites.height = image.height;
                }

                app.stage.addChild(sprites);
                document.getElementById('show-canvas').appendChild(app.view);
            }
            image.src = file;


        }



    }));
});


document.addEventListener('alpine:init', () => {
    Alpine.data('canvas', () => ({
        klik(event) {
            // GET CURRENT COORDINATE OF CANVAS POSITION
            var x = event.clientX;
            var y = event.clientY;

            const canvas = this.$refs.myCanvas;
            const widthCanvas = canvas.clientWidth;
            const heightCanvas = canvas.clientHeight;
            // THE BASIC SETTING FOR CANVAS IMAGE
            // THE WIDTH AND HEIGHT IS ACCOURDING TO SIZE OF CANVAS TAG IN INDEX.HTML
            const app = new PIXI.Application({
                view: canvas,
                autoResize: true,
                width: widthCanvas,
                height: heightCanvas,
                resolution: 1,
                transparent: true

            });
            var file = document.getElementById('hidden-new-image').value;

            var image = new Image();
            image.onload = function () {
                const texture = PIXI.Texture.from(image.src);

                var sprites = {};
                sprites = new PIXI.Sprite(texture);
                
                if (image.width > widthCanvas && image.height > heightCanvas) {
                    // RESIZE THE IMAGE SO IT CAN FIT TO THE WEBSITE
                    // ITS JUST RANDOM SIZE THAT I COHHOSE
                    // STILL DONT KNOW HOW TO MAKE THE CANVAS IMAGE GET THE RESPONSIVE DESIGN, FIX LATTER
                    sprites.width = 1366 / 1.5;
                    sprites.height = 768 / 1.5;
                    // GIVE CENTER POSITION OF LANDSCAPE IMAGE
                    sprites.x = sprites.width / sprites.width + 12;

                    // EDIT THE COORDINATE, THE REAL COORDINATE KINDA MISS SO I CHANGE HERE A BIT.
                    //I STILL DONT KNOW WHAT IS THE ABSOLUTE COORDINATE
                    //HOPE THIS CAN FIX SOON IN THE FUTURE
                    x = x - 388;
                    y = y - 95;

                } else {
                    sprites.width = image.width;
                    sprites.height = image.height;
                   
                    // EDIT THE COORDINATE, THE REAL COORDINATE KINDA MISS SO I CHANGE HERE A BIT.
                    //I STILL DONT KNOW WHAT IS THE ABSOLUTE COORDINATE
                    //HOPE THIS CAN FIX SOON IN THE FUTURE
                    x = x - 375;
                    y = y - 95;
                }

                // GIVE IMAGE THE RADIAL BLUR EFFECT
                sprites.filters = [new PIXI.filters.ZoomBlurFilter({
                    strength: localStorage.getItem('strength'),
                    center: [x, y],
                    innerRadius: localStorage.getItem('circle'),
                    maxKernelSize: 32,
                })];
                app.stage.addChild(sprites);
                document.getElementById('show-canvas').appendChild(app.view);

            };
            image.src = file;
        }
    }));
});


// JAVASCRIPT DOM FUNCTION
function ready(fn) {
    if (document.readyState != 'loading') {
        fn();
    } else {
        document.addEventListener('DOMContentLoaded', fn);
    }
}

// CALLING DOM FUNCTION IF YOU DON'T NEED ALPINE JS, JUST WRITE NATIVE JS CODE HERE TO GET FULLY DOM LOADED
ready(function () {

    // EVENT FOR CIRCLE FOLLOWING CURSOR
    var cursor = document.querySelector(".cursor");
    document.body.addEventListener("mousemove", function (e) {
        cursor.style.left = e.clientX + "px",
            cursor.style.top = e.clientY + "px";
    });


});

