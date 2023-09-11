var game;
var shadow;
var background, background2;
var pointerdown = false;
var gameOptions = {
    bounceHeight: 500, // PB was 300
    ballGravity: 1000,
    ballPosition: 0.1,
    platformSpeed: 300, // 650
    platformDistanceRange: [250, 350],
    platformHeightRange: [0, 100],
    platformLengthRange: [100, 120], // 40 - 60
    localStorageName: "BounceToo.score"
}
var gameNo;
var that;
var gpad;

window.onload = function () {
    'use strict';

    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('./sw.js');
    }

    home = document.querySelector('home');
    home.style.left = "1vw";
    home.hidden = true;
    splash = document.querySelector('splash');
    canvas = document.getElementById('game');
    panel = document.querySelector('panel');
    settings = document.querySelector('settings');
    button = document.querySelector('button');
    button1 = document.querySelector('button1');
    button2 = document.querySelector('button2');
    button3 = document.querySelector('button3');
    home.onmousedown = function (e) {
        event.preventDefault();
        showMenu();
    }

    button.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(0);
    }
    button1.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(1);
    }
    button2.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(2);
    }
    button3.onmousedown = function (e) {
        event.preventDefault();
        e.stopPropagation();
        start(3);
    }
    setUpPanel();
}

var canvas;
var splash;
var button;
var button1;
var button2;
var button3;
var inMenu = true;
var panel;
var panelvisible = false;
var settings;
var home;
var singleSwitch = 0; // one or two switches
var holdSwitch = 1; // able to hold switc down or just tap it
var width;
var wScale;
var speed;
var pSpeed;
var s1;
var s2;
var mute = false;

var applause;
var aargh01;
var bounce;
var frog;
var ufo;
var firsttime = true;

function setUpPanel() {
    panel.style.left = "130vw";
    slideTo(panel, 130);
    mute = document.createElement("INPUT");
    mute.style.position = "absolute";
    mute.style.height = "3vh";
    mute.style.width = "3vw";
    mute.style.left = "17vw";
    mute.style.top = "3vh";
    mute.checked = false;
    mute.setAttribute("type", "checkbox");
    mute.checked = false;
    speed = document.createElement("INPUT");
    speed.setAttribute("type", "range");
    speed.style.position = "absolute";
    speed.style.height = "2vh";
    speed.style.width = "14vw";
    speed.style.left = "4.3vw";
    speed.style.top = "11vh";
    speed.style.color = 'green';
    speed.value = 3;
    speed.min = 1;
    speed.max = 5;
    width = document.createElement("INPUT");
    width.setAttribute("type", "range");
    width.style.position = "absolute";
    width.style.height = "2vh";
    width.style.width = "14vw";
    width.style.left = "4.3vw";
    width.style.top = "16.5vh";
    width.style.color = 'green';
    width.value = 3;
    width.min = 1;
    width.max = 5;

    s1 = document.createElement("INPUT");
    s1.style.position = "absolute";
    s1.style.height = "3vh";
    s1.style.width = "3vw";
    s1.style.left = "14vw";
    s1.style.top = "23vh";
    s2 = document.createElement("INPUT");
    s2.style.position = "absolute";
    s2.style.height = "3vh";
    s2.style.width = "3vw";
    s2.style.left = "6.5vw";
    s2.style.top = "23vh";
    s1.setAttribute("type", "radio");
    s2.setAttribute("type", "radio");

    s2.checked = true;

    function switchOption(i) {
        switch (i) {
            case 1:
                s1.checked = true;
                s2.checked = false;
                localStorage.setItem("BounceToo.onUp", 1);
                break;
            case 2:
                s2.checked = true;
                s1.checked = false;
                localStorage.setItem("BounceToo.onUp", 2);
                break;
        }
    }

    s1.onclick = function (e) {
        e.stopPropagation();
        switchOption(1);
    }
    s2.onclick = function (e) {
        e.stopPropagation();
        switchOption(2);
    }

    panel.appendChild(mute);
    panel.appendChild(speed);
    panel.appendChild(width);
    panel.appendChild(s1);
    panel.appendChild(s2);

    settings.style.left = "92vw";
    // Retrieve settings
    var s = localStorage.getItem("BounceToo.mute");
    mute.checked = (s == "true");
    s = parseInt(localStorage.getItem("BounceToo.speed"));
    if (s < 1 || s > 5)
        s = 3;
    speed.value = s.toString();
    pSpeed = speed.value / 1.5;
    s = parseInt(localStorage.getItem("BounceToo.width"));
    if (s < 1 || s > 5)
        s = 3;
    width.value = s.toString();
    wScale = (7 - width.value) / 3.5;
    s = localStorage.getItem("BounceToo.onUp");
    if (s == 2)
        switchOption(2);
    else
        switchOption(1);

    mute.onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("BounceToo.mute", mute.checked);
    }
    speed.onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("BounceToo.speed", speed.value);
        pSpeed = speed.value / 1.5;
        localStorage.setItem(gameOptions.localStorageName, 0);
    }
    width.onclick = function (e) {
        e.stopPropagation();
        localStorage.setItem("BounceToo.width", width.value);
        wScale = (7 - width.value) / 3.5;
        localStorage.setItem(gameOptions.localStorageName, 0);
    }

    panel.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
    }

    settings.onmousedown = function (e) { // speed, paddle size, ball size
        e.stopPropagation();
        if (panelvisible) { // save stored values        pSpeed = (7 - speed.value) / 5;
            slideTo(panel, 130);
            slideTo(settings, 92);
        } else {
            slideTo(panel, 75);
            slideTo(settings, 78);
        }
        panelvisible = !panelvisible;
    }

    function slideTo(el, left) {
        var steps = 5;
        var timer = 50;
        var elLeft = parseInt(el.style.left) || 0;
        var diff = left - elLeft;
        var stepSize = diff / steps;
        console.log(stepSize, ", ", steps);

        function step() {
            elLeft += stepSize;
            el.style.left = elLeft + "vw";
            if (--steps) {
                setTimeout(step, timer);
            }
        }
        step();
    }
}


function hideMenu() {
    splash.hidden = true;
    button.hidden = true;
    button1.hidden = true;
    button2.hidden = true;
    button3.hidden = true;
    inMenu = false;
    home.hidden = false;
}

function showMenu() {
    // also stop game playing
    splash.hidden = false;
    button.hidden = false;
    button1.hidden = false;
    button2.hidden = false;
    button3.hidden = false;
    home.hidden = true;
    inMenu = true;
    try {
        game.destroy(true);
    } catch (e) {};
}

function start(i) {
    gameNo = i;
    let gameConfig = {
        type: Phaser.AUTO,
        backgroundColor: 0x87ceeb,
        scale: {
            mode: Phaser.Scale.AUTO,
            autoCenter: Phaser.Scale.CENTER_BOTH,
            parent: "thegame",
            width: 1000,
            height: 800
        },
        physics: {
            default: "arcade"
        },
        scene: playGame
    }

    game = new Phaser.Game(gameConfig);
    window.focus();
    if (gameNo >= 0)
        hideMenu();
}

var bounceSound, fallSound, chingSound;
class playGame extends Phaser.Scene {
    constructor() {
        super("PlayGame");
    }
    preload() {
        that = this;
        this.load.audio("fallSound", "sounds/aargh01.mp3");
        this.load.audio("chingSound", "sounds/ching.mp3");
        switch (gameNo) {
            case 0:
                this.load.audio("bounceSound", "sounds/bounce.mp3");
                this.load.image('background2', 'images/clouds-white.png');
                this.load.image('background', 'images/clouds-white-small.png ');
                this.load.image("ground", "images/ground2.png");
                this.load.image("ball", "images/ball.png");
                break;
            case 1:
                this.load.audio("bounceSound", "sounds/bounce.mp3");
                this.load.image('background2', 'images/blank.png');
                this.load.image('background', 'images/bamboo.jpg');
                this.load.image("ground", "images/branch.png");
                this.load.image("ball", "images/panda.png");
                break;
            case 2:
                this.load.audio("bounceSound", "sounds/frog.mp3");
                this.load.image('background2', 'images/clouds-white.png ');
                this.load.image('background', 'images/green.png ');
                this.load.image("ground", "images/ground.png");
                this.load.image("ball", "images/frog.png");
                break;
            case 3:
                this.load.audio("bounceSound", "sounds/ufo.mp3");
                this.load.image('background2', 'images/clouds-space.png');
                this.load.image('background', 'images/space.png');
                this.load.image("ground", "images/cloud.png");
                this.load.image("ball", "images/ufo.png");
                break;
        }
    }
    switchdown() {
        if (s2.checked) {
            if (pointerdown)
                this.stopPlatforms();
            else
                this.movePlatforms();
        } else
            this.movePlatforms();
    }
    switchup() {
        if (s2.checked) {} else
            this.stopPlatforms();
    }
    create() {
        if (gameNo == -1)
            this.scene.pause();
        else {
            bounceSound = this.sound.add('bounceSound');
            fallSound = this.sound.add('fallSound');
            chingSound = this.sound.add('chingSound');
            //adding the moving background
            this.platformGroup = this.physics.add.group();
            background = this.add.tileSprite(500, 400, 1500, 800, 'background');
            background2 = this.add.tileSprite(500, 200, 1500, 400, 'background2');
            this.ball = this.physics.add.sprite(game.config.width * gameOptions.ballPosition, game.config.height / 4 * 3 - gameOptions.bounceHeight, "ball");
            this.ball.body.gravity.y = gameOptions.ballGravity;
            this.ball.setBounce(1);
            this.ball.body.checkCollision.down = true;
            this.ball.body.checkCollision.up = false;
            this.ball.body.checkCollision.left = false;
            this.ball.body.checkCollision.right = false;
            this.ball.setSize(30, 50, true)
            let platformX = this.ball.x;
            for (let i = 0; i < 10; i++) {
                let platform = this.platformGroup.create(platformX, game.config.height / 4 * 3 + Phaser.Math.Between(gameOptions.platformHeightRange[0], gameOptions.platformHeightRange[1]), "ground");
                platform.setOrigin(0.5, 1);
                //            platform.body.setSize(0, 0, platform.getBounds().right, 10);
                platform.setImmovable(true);
                platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0] / wScale, gameOptions.platformLengthRange[1] / wScale);
                platformX += Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1] + gameNo * 40);
                //platform.displayWidth = platform.displayWidth / 2;
                //platform.setSize(0, 0, w / 10, 10);
            }
        }
        this.input.on("pointerdown", this.switchdown, this);
        this.input.keyboard.on("keydown", this.switchdown, this);
        this.input.on("pointerup", this.switchup, this);
        this.input.keyboard.on("keyup", this.switchup, this);
        this.input.keyboard.on('keydown-ESC', showMenu, this);

        this.score = 0;
        this.topScore = localStorage.getItem(gameOptions.localStorageName) == null ? 0 : localStorage.getItem(gameOptions.localStorageName);
        var style = {
            font: "40px Arial",
            fill: "#ff0000",
            align: "center"
        };
        var style1 = {
            font: "bold 80px Arial",
            fill: "#ff0000",
            //align: "center"
            boundsAlignH: "center",
            boundsAlignV: "middle"
        };
        this.scoreText = this.add.text(380, 15, "", style);
        this.scoreText.setShadow(3, 3, 'rgba(0,0,0,.8)', 2);
        this.scoreText1 = this.add.text(380, 250, "", style1);
        this.scoreText1.setShadow(3, 3, 'rgba(0,0,0,0.8)', 2);
        this.updateScore(this.score);
    }
    updateScore(inc) {
        this.score += inc;
        this.scoreText.text = "#:" + this.score + "    ^*" + this.topScore + "*^";
    }
    movePlatforms() {
        pointerdown = true;
        this.platformGroup.setVelocityX(-gameOptions.platformSpeed * pSpeed);
    }
    stopPlatforms() {
        pointerdown = false;
        this.platformGroup.setVelocityX(0);
    }
    getRightmostPlatform() {
        let rightmostPlatform = 0;
        this.platformGroup.getChildren().forEach(function (platform) {
            rightmostPlatform = Math.max(rightmostPlatform, platform.x);
        });
        return rightmostPlatform;
    }
    collide() {
        if (!mute.checked)
            bounceSound.play();
    }
    update() {
        this.physics.world.collide(this.platformGroup, this.ball, this.collide);
        this.platformGroup.getChildren().forEach(function (platform) {
            if (platform.getBounds().right < 0) {
                this.updateScore(1);
                if (!mute.checked)
                    chingSound.play();
                platform.x = this.getRightmostPlatform() + Phaser.Math.Between(gameOptions.platformDistanceRange[0], gameOptions.platformDistanceRange[1]);
                platform.displayWidth = Phaser.Math.Between(gameOptions.platformLengthRange[0] / wScale, gameOptions.platformLengthRange[1] / wScale);
            }
        }, this);
        if (pointerdown) {
            background.tilePositionX += 5;
            background2.tilePositionX += 2.5;
        } else {
            background.tilePositionX += .1;
            background2.tilePositionX += .2;
        }
        if (this.ball.y > game.config.height) {
            if (!mute.checked)
                fallSound.play();
            localStorage.setItem(gameOptions.localStorageName, Math.max(this.score, this.topScore));
            //            this.gameover();
            //            setTimeout(this.gamover, 2000);

            pointerdown = false;
            if (this.score > 1) //this.topScore)
                this.scoreText1.text = "** " + this.score + " **";
            else
                this.scoreText1.text = "   " + this.score;
            this.platformGroup.getChildren().forEach(function (platform) {
                platform.displayWidth = 0;
            }, this);
            this.scene.pause();
            setTimeout(function () {
                that.scene.start("PlayGame");
            }, 3000);
        }
    }
}

function Highlight() {
    button.style.opacity = .7;
    button1.style.opacity = .7;
    button2.style.opacity = .7;
    button3.style.opacity = .7;

    switch (menuItem) {
        case 0:
            button.style.opacity = 1.;
            break;
        case 1:
            button1.style.opacity = 1.;
            break;
        case 2:
            button2.style.opacity = 1.;
            break;
        case 3:
            button3.style.opacity = 1.;
            break;
    }
}

var menuItem = 0;

function showPressedButton(index) {
    console.log("Press: ", index);
    if (inMenu) {
        switch (index) {
            case 0: // A
            case 1: // B
            case 2: // X
            case 3: // Y
                start(menuItem);
                break;
            case 12: // dup
                if (menuItem >= 2)
                    menuItem -= 2;
                Highlight();
                break;
            case 13: // ddown
                if (menuItem < 3)
                    menuItem += 2;
                Highlight();
                break;
            case 14: // dleft
                if (menuItem > 0)
                    menuItem--;
                Highlight();
                break;
            case 15: // dright
                if (menuItem < 4)
                    menuItem++;
                Highlight();
                break;
        }
        console.log("Menu: ", menuItem);
    } else switch (index) {

        case 0: // A
        case 1: // B
        case 2: // X
        case 3: // Y 
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            that.switchdown();
            break;
        case 10: // XBox
            showMenu();
            break;
        default:
    }
}

function removePressedButton(index) {
    console.log("Releasd: ", index);
    if (inMenu) {
        console.log("Menu: ", menuItem);
    } else switch (index) {
        case 0: // A
        case 1: // B
        case 2: // X
        case 3: // Y 
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
        case 11:
        case 12:
        case 13:
        case 14:
        case 15:
            that.switchup();
            break;
        case 10: // XBox
            break;
        default:
    }
}

var gpad;

gamepads.addEventListener('connect', e => {
    console.log('Gamepad connected:');
    console.log(e.gamepad);
    Highlight();
    gpad = e.gamepad;
    e.gamepad.addEventListener('buttonpress', e => showPressedButton(e.index));
    e.gamepad.addEventListener('buttonrelease', e => removePressedButton(e.index));
});

gamepads.addEventListener('disconnect', e => {
    console.log('Gamepad disconnected:');
    console.log(e.gamepad);
});

gamepads.start();
